'use client'
import { useEffect, useState } from 'react'
import TopicsView from '@/components/student/TopicsView'

// --- Types ---
interface StudentStats {
  name: string
  activeQuests: number
  completedSessions: number
  totalTurns: number
  progressPct: number
}

interface StudentSession {
  id: string
  topic: string
  format: string
  turn_count: number
  last_active_at: string
  status: 'In Progress' | 'Pending'
  priority: 'High' | 'Medium'
}

interface ActiveQuest {
  id: string
  teacher_name: string
  topic: string
  format: string
  message: string | null
  created_at: string
}

// --- Sidebar nav items ---
const NAV_ITEMS = [
  { icon: '🏠', label: 'Dashboard', active: false, comingSoon: false, tab: 'dashboard' as const },
  { icon: '🧩', label: 'Quiz Rooms', active: false, comingSoon: true },
  { icon: '📚', label: 'Learn', active: false, comingSoon: false, action: 'learn' },
  { icon: '🗂️', label: 'Topics', active: false, comingSoon: false, tab: 'topics' as const },
  { icon: '💬', label: 'Discussions', active: false, comingSoon: true },
]

// --- Component ---
export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'topics'>('dashboard')
  const [name, setName] = useState<string>('')
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [sessions, setSessions] = useState<StudentSession[]>([])
  const [quest, setQuest] = useState<ActiveQuest | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lumina_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setName(parsed.name ?? '')
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (!name) return
    const encodedName = encodeURIComponent(name)

    Promise.all([
      fetch(`/api/student/stats?name=${encodedName}`).then(r => r.json()),
      fetch(`/api/student/sessions?name=${encodedName}`).then(r => r.json()),
      fetch('/api/teacher/quest').then(r => r.json()),
    ]).then(([statsData, sessionsData, questData]) => {
      setStats(statsData)
      setSessions(sessionsData.sessions ?? [])
      setQuest(questData.quest ?? null)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [name])

  // Learn nav handler: postMessage to parent OS
  const handleLearnClick = () => {
    try {
      window.parent.postMessage({ type: 'OPEN_WINDOW', windowId: 'questlearn' }, '*')
    } catch {
      window.open('/learn', '_blank')
    }
  }

  // Placeholder quiz cards when no active quest
  const PLACEHOLDER_QUIZZES = [
    { topic: 'Year 10 Biology', format: 'Quiz', teacher_name: 'Coming Soon', created_at: '' },
    { topic: 'Mathematics', format: 'Challenge', teacher_name: 'Coming Soon', created_at: '' },
  ]

  const today = new Date().toLocaleDateString('en-AU', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#0f172a', color: 'white', fontFamily: 'system-ui, sans-serif' }}
    >
      {/* === LEFT SIDEBAR === */}
      <aside
        className="flex flex-col gap-1 py-6 px-3"
        style={{
          width: '200px',
          minWidth: '200px',
          background: '#1e2d45',
          borderRight: '1px solid rgba(245,158,11,0.1)',
        }}
      >
        {/* Logo */}
        <div className="px-3 mb-6">
          <span className="text-xl font-bold" style={{ color: '#f59e0b' }}>🎓 QuestLearn</span>
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = 'tab' in item && item.tab !== undefined
            ? activeTab === item.tab
            : false
          return (
            <div key={item.label} className="relative group">
              <button
                disabled={item.comingSoon}
                onClick={
                  item.comingSoon
                    ? undefined
                    : item.action === 'learn'
                    ? handleLearnClick
                    : 'tab' in item && item.tab !== undefined
                    ? () => setActiveTab(item.tab!)
                    : undefined
                }
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors"
                style={{
                  background: isActive ? 'rgba(245,158,11,0.15)' : 'transparent',
                  color: isActive ? '#f59e0b' : item.comingSoon ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                  border: isActive ? '1px solid rgba(245,158,11,0.3)' : '1px solid transparent',
                  cursor: item.comingSoon ? 'not-allowed' : 'pointer',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.comingSoon && (
                  <span
                    className="ml-auto text-xs px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontSize: '9px' }}
                  >
                    Soon
                  </span>
                )}
              </button>
            </div>
          )
        })}

        {/* Bottom: student info */}
        <div className="mt-auto px-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Signed in as</p>
          <p className="text-sm font-medium text-white truncate">{name || '...'}</p>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top greeting bar */}
        <header
          className="flex items-center justify-between px-6 py-4"
          style={{
            background: 'rgba(30, 45, 69, 0.6)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(245,158,11,0.1)',
          }}
        >
          <div>
            <h1 className="text-xl font-semibold text-white">
              Hello {name || 'there'} 👋 <span style={{ color: '#f59e0b' }}>Welcome back</span>
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{today}</p>
          </div>
          {/* Progress indicator */}
          {stats && (
            <div className="flex items-center gap-2">
              <div
                className="rounded-full overflow-hidden"
                style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${stats.progressPct}%`, background: '#f59e0b' }}
                />
              </div>
              <span className="text-xs" style={{ color: '#f59e0b' }}>{stats.progressPct}%</span>
            </div>
          )}
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
        {activeTab === 'topics' ? (
          <TopicsView name={name} />
        ) : (<div className="p-6">

          {/* === STATS ROW === */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              {
                label: 'Active Quests',
                value: loading ? '…' : String(stats?.activeQuests ?? 0),
                icon: '⚡',
                color: '#f59e0b',
              },
              {
                label: 'Upcoming Quizzes',
                value: quest ? '1' : '0',
                icon: '📋',
                color: '#60a5fa',
              },
              {
                label: 'Completed',
                value: loading ? '…' : String(stats?.completedSessions ?? 0),
                icon: '✅',
                color: '#34d399',
              },
              {
                label: 'Progress',
                value: loading ? '…' : `${stats?.progressPct ?? 0}%`,
                icon: '📈',
                color: '#a78bfa',
              },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-xl p-4"
                style={{
                  background: 'rgba(30, 45, 69, 0.8)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {card.label}
                  </span>
                  <span className="text-lg">{card.icon}</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* === TWO-COLUMN CONTENT === */}
          <div className="grid grid-cols-2 gap-6">

            {/* LEFT: Upcoming Quizzes */}
            <section>
              <h2 className="text-sm font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                📋 Upcoming Quizzes
              </h2>
              <div className="flex flex-col gap-3">
                {(quest ? [quest] : PLACEHOLDER_QUIZZES).map((q, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4"
                    style={{
                      background: 'rgba(30, 45, 69, 0.8)',
                      border: '1px solid rgba(245,158,11,0.15)',
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-white">{q.topic}</p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b' }}
                      >
                        {q.format}
                      </span>
                    </div>
                    <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {q.teacher_name === 'Coming Soon' ? '🔒 Coming soon' : `By ${q.teacher_name}`}
                    </p>
                    <button
                      disabled={q.teacher_name === 'Coming Soon'}
                      onClick={() => {
                        try {
                          window.parent.postMessage({ type: 'OPEN_WINDOW', windowId: 'questlearn' }, '*')
                        } catch { /* ignore */ }
                      }}
                      className="w-full py-1.5 rounded-lg text-sm font-medium transition-opacity"
                      style={{
                        background: q.teacher_name === 'Coming Soon'
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(245,158,11,0.9)',
                        color: q.teacher_name === 'Coming Soon' ? 'rgba(255,255,255,0.3)' : '#0f172a',
                        cursor: q.teacher_name === 'Coming Soon' ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {q.teacher_name === 'Coming Soon' ? 'Coming Soon' : 'Join Now →'}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* RIGHT: Ongoing Issues (learning sessions) */}
            <section>
              <h2 className="text-sm font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                🗂️ Ongoing Issues
              </h2>
              {loading ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-xl p-4 animate-pulse"
                      style={{ background: 'rgba(30,45,69,0.6)', height: '80px' }}
                    />
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <div
                  className="rounded-xl p-8 text-center"
                  style={{ background: 'rgba(30,45,69,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <p className="text-2xl mb-2">📚</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    No learning sessions yet.<br />
                    <span style={{ color: '#f59e0b' }}>Open QuestLearn to start!</span>
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="rounded-xl p-4"
                      style={{
                        background: 'rgba(30, 45, 69, 0.8)',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm font-medium text-white truncate mr-2">{session.topic}</p>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full shrink-0"
                          style={{
                            background: session.priority === 'High'
                              ? 'rgba(239,68,68,0.2)'
                              : 'rgba(245,158,11,0.2)',
                            color: session.priority === 'High' ? '#f87171' : '#f59e0b',
                          }}
                        >
                          {session.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: session.status === 'In Progress'
                              ? 'rgba(52,211,153,0.15)'
                              : 'rgba(148,163,184,0.15)',
                            color: session.status === 'In Progress' ? '#34d399' : '#94a3b8',
                          }}
                        >
                          {session.status}
                        </span>
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          {session.format}
                        </span>
                        <span className="text-xs ml-auto" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          {session.last_active_at
                            ? new Date(session.last_active_at).toLocaleDateString('en-AU', {
                                day: 'numeric', month: 'short',
                              })
                            : '—'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        </div>)}
        </div>
      </main>
    </div>
  )
}
