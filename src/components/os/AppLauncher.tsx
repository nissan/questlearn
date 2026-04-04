'use client'
import { useEffect, useState } from 'react'
import { WindowId, useWindowManager } from './WindowManager'

const LAUNCHER_APPS = [
  // Live
  {
    id: 'questlearn',
    icon: '🎓',
    label: 'QuestLearn',
    desc: 'Your learning journey',
    status: 'live' as const,
  },
  {
    id: 'teacher',
    icon: '📊',
    label: 'Teacher Hub',
    desc: 'Class comprehension insights',
    status: 'live' as const,
  },
  {
    id: 'student-dashboard',
    icon: '🏠',
    label: 'My Dashboard',
    desc: 'Your learning overview',
    status: 'live' as const,
  },
  {
    id: 'pitch',
    icon: '📋',
    label: 'Pitch Deck',
    desc: 'Project pitch and overview',
    status: 'live' as const,
  },
  {
    id: 'student-help',
    icon: '🎒',
    label: 'Student Guide',
    desc: 'How to use QuestLearn',
    status: 'live' as const,
  },
  {
    id: 'teacher-help',
    icon: '📖',
    label: 'Teacher Guide',
    desc: 'Pedagogy and classroom tips',
    status: 'live' as const,
  },
  // v2
  {
    id: 'study-rooms',
    icon: '💬',
    label: 'Study Rooms',
    desc: 'Collaborative study sessions',
    status: 'v2' as const,
  },
  {
    id: 'quiz-rooms',
    icon: '🧩',
    label: 'Quiz Rooms',
    desc: 'Real-time quiz battles',
    status: 'v2' as const,
  },
  {
    id: 'open-threads',
    icon: '🗂️',
    label: 'Open Threads',
    desc: 'Topic discussion threads',
    status: 'v2' as const,
  },
  {
    id: 'syllabus',
    icon: '📚',
    label: 'Syllabus Browser',
    desc: 'AC v9 curriculum tree',
    status: 'v2' as const,
  },
  // v3
  {
    id: 'cross-school',
    icon: '🌏',
    label: 'Cross-School Match',
    desc: 'Study with students nationally',
    status: 'v3' as const,
  },
  {
    id: 'regional',
    icon: '📍',
    label: 'Regional Insights',
    desc: 'Geographic learning analytics',
    status: 'v3' as const,
  },
]

export function AppLauncher() {
  const launcherOpen = useWindowManager((s) => s.launcherOpen)
  const setLauncher = useWindowManager((s) => s.setLauncher)
  const openWindow = useWindowManager((s) => s.openWindow)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLauncher(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setLauncher])

  if (!launcherOpen) return null

  const filteredApps = LAUNCHER_APPS.filter(
    (app) =>
      app.label.toLowerCase().includes(query.toLowerCase()) ||
      app.desc.toLowerCase().includes(query.toLowerCase())
  )

  const liveApps = filteredApps.filter((a) => a.status === 'live')
  const v2Apps = filteredApps.filter((a) => a.status === 'v2')
  const v3Apps = filteredApps.filter((a) => a.status === 'v3')

  const AppItem = ({
    app,
  }: {
    app: (typeof LAUNCHER_APPS)[number]
  }) => {
    const isLive = app.status === 'live'
    const badge =
      app.status === 'v2' ? 'Coming soon' : app.status === 'v3' ? 'Future' : null

    return (
      <button
        key={app.id}
        disabled={!isLive}
        onClick={() => {
          if (isLive) {
            openWindow(app.id as WindowId)
            setLauncher(false)
          }
        }}
        className={`flex items-center gap-3 rounded-xl p-3 text-left transition-colors ${
          isLive ? 'hover:bg-white/5 cursor-pointer' : 'cursor-not-allowed opacity-40'
        }`}
        style={{ border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span className="text-2xl">{app.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium">{app.label}</span>
            {badge && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  background: 'rgba(245,158,11,0.2)',
                  color: '#f59e0b',
                  fontSize: '10px',
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <span className="text-white/40 text-xs">{app.desc}</span>
        </div>
      </button>
    )
  }

  return (
    <div
      className="fixed inset-0 z-[9997] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={() => setLauncher(false)}
    >
      <div
        className="p-6"
        style={{
          width: '580px',
          maxHeight: '80vh',
          overflowY: 'auto',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '16px',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 48px 96px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white font-semibold text-lg mb-3">🎓 QuestLearn Apps</h2>

        {/* Search input */}
        <input
          autoFocus
          type="text"
          placeholder="Search apps, topics, questions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-lg text-sm text-white outline-none placeholder-white/30"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
        />

        {/* Live apps */}
        {liveApps.length > 0 && (
          <>
            <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">Available Now</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {liveApps.map((app) => (
                <AppItem key={app.id} app={app} />
              ))}
            </div>
          </>
        )}

        {/* v2 apps */}
        {v2Apps.length > 0 && (
          <>
            <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">Coming in v2</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {v2Apps.map((app) => (
                <AppItem key={app.id} app={app} />
              ))}
            </div>
          </>
        )}

        {/* v3 apps */}
        {v3Apps.length > 0 && (
          <>
            <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">Future Vision</p>
            <div className="grid grid-cols-2 gap-2">
              {v3Apps.map((app) => (
                <AppItem key={app.id} app={app} />
              ))}
            </div>
          </>
        )}

        {filteredApps.length === 0 && (
          <p className="text-white/40 text-sm text-center py-8">No apps found for &quot;{query}&quot;</p>
        )}
      </div>
    </div>
  )
}
