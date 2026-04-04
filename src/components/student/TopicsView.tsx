'use client'

import { useEffect, useState } from 'react'

// --- Types ---
interface TrendingTopic {
  topic: string
  format: string
  student_count: number
  total_turns: number
}

interface SubjectTopic {
  topic: string
  student_count: number
}

interface SubjectGroup {
  subject: string
  topics: SubjectTopic[]
}

// Format display labels
const FORMAT_OPTIONS = [
  { key: 'story', label: '📖 Story' },
  { key: 'puzzle', label: '🧩 Puzzle' },
  { key: 'meme', label: '😂 Meme' },
  { key: 'game', label: '🎮 Game' },
  { key: 'short_film', label: '🎬 Short Film' },
]

function formatLabel(fmt: string): string {
  const found = FORMAT_OPTIONS.find((f) => f.key === fmt)
  if (found) return found.label
  // Fallback: capitalise
  return fmt.charAt(0).toUpperCase() + fmt.slice(1)
}

// --- Launch handler ---
function handleLaunch(topic: string, format: string) {
  try {
    localStorage.setItem('questlearn_launch', JSON.stringify({ topic, format }))
  } catch { /* ignore */ }
  try {
    window.parent.postMessage(
      { type: 'OPEN_WINDOW', windowId: 'questlearn', topic, format },
      '*'
    )
  } catch { /* ignore */ }
}

// --- Trending skeleton ---
function TrendingSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl animate-pulse shrink-0"
          style={{
            width: '200px',
            minWidth: '200px',
            height: '140px',
            background: 'rgba(255,255,255,0.06)',
          }}
        />
      ))}
    </>
  )
}

// --- Trending card ---
function TrendingCard({ item }: { item: TrendingTopic }) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2 shrink-0"
      style={{
        width: '200px',
        minWidth: '200px',
        background: 'rgba(30, 45, 69, 0.9)',
        border: '1px solid rgba(245,158,11,0.2)',
      }}
    >
      <p className="text-sm font-bold text-white leading-tight">{item.topic}</p>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
        👥 {item.student_count} student{item.student_count !== 1 ? 's' : ''}
      </p>
      <span
        className="text-xs px-2 py-0.5 rounded-full self-start"
        style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b' }}
      >
        {formatLabel(item.format)}
      </span>
      <button
        onClick={() => handleLaunch(item.topic, item.format)}
        className="mt-auto w-full py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-90"
        style={{ background: 'rgba(245,158,11,0.9)', color: '#0f172a' }}
      >
        Start →
      </button>
    </div>
  )
}

// --- Topic card with inline format picker ---
function TopicCard({ item, subject }: { item: SubjectTopic; subject: string }) {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)

  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-2"
      style={{
        background: 'rgba(30, 45, 69, 0.8)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Topic name + subject tag */}
      <div className="flex items-start justify-between gap-1">
        <p className="text-sm font-medium text-white leading-tight">{item.topic}</p>
        <span
          className="text-xs px-1.5 py-0.5 rounded-full shrink-0"
          style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontSize: '9px' }}
        >
          {subject}
        </span>
      </div>

      {/* Student count */}
      {item.student_count > 0 && (
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          👥 {item.student_count} exploring
        </p>
      )}

      {/* Format picker */}
      <div className="flex flex-wrap gap-1">
        {FORMAT_OPTIONS.map((fmt) => (
          <button
            key={fmt.key}
            onClick={() => setSelectedFormat(selectedFormat === fmt.key ? null : fmt.key)}
            className="px-2 py-1 rounded-lg text-xs transition-all"
            style={{
              background:
                selectedFormat === fmt.key
                  ? 'rgba(245,158,11,0.9)'
                  : 'rgba(255,255,255,0.08)',
              color: selectedFormat === fmt.key ? '#0f172a' : 'rgba(255,255,255,0.7)',
            }}
          >
            {fmt.label}
          </button>
        ))}
      </div>

      {/* Start button */}
      <button
        disabled={!selectedFormat}
        onClick={() => selectedFormat && handleLaunch(item.topic, selectedFormat)}
        className="w-full py-1.5 rounded-lg text-xs font-medium transition-all"
        style={{
          background: selectedFormat ? 'rgba(245,158,11,0.9)' : 'rgba(255,255,255,0.05)',
          color: selectedFormat ? '#0f172a' : 'rgba(255,255,255,0.25)',
          cursor: selectedFormat ? 'pointer' : 'not-allowed',
        }}
      >
        Start Learning →
      </button>
    </div>
  )
}

// --- Subject skeleton (3 cards inside) ---
function SubjectSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl animate-pulse"
          style={{ height: '140px', background: 'rgba(255,255,255,0.06)' }}
        />
      ))}
    </div>
  )
}

// --- Main TopicsView ---
export default function TopicsView({ name }: { name: string }) {
  const [trending, setTrending] = useState<TrendingTopic[]>([])
  const [trendingLoading, setTrendingLoading] = useState(true)

  const [subjects, setSubjects] = useState<SubjectGroup[]>([])
  const [subjectsLoading, setSubjectsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/topics/trending')
      .then((r) => r.json())
      .then((data) => {
        setTrending(data.topics ?? [])
        setTrendingLoading(false)
      })
      .catch(() => setTrendingLoading(false))
  }, [])

  useEffect(() => {
    fetch('/api/topics/by-subject')
      .then((r) => r.json())
      .then((data) => {
        setSubjects(data.subjects ?? [])
        setSubjectsLoading(false)
      })
      .catch(() => setSubjectsLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">

      {/* === TRENDING NOW === */}
      <section>
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
          🔥 Trending Now
        </h2>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
            {trendingLoading ? (
              <TrendingSkeleton />
            ) : trending.length === 0 ? (
              <p className="text-sm py-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
                No trending topics yet — be the first to explore!
              </p>
            ) : (
              trending.map((item) => <TrendingCard key={item.topic} item={item} />)
            )}
          </div>
        </div>
      </section>

      {/* === BY SUBJECT === */}
      <section>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
          📚 Browse by Subject
        </h2>

        <div className="flex flex-col gap-8">
          {subjectsLoading ? (
            // Show static subject headers with skeletons while loading
            ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Technology'].map((subj) => (
              <div key={subj}>
                <p
                  className="text-xs uppercase tracking-wider mb-3"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {subj}
                </p>
                <SubjectSkeleton />
              </div>
            ))
          ) : (
            subjects.map((group) => (
              <div key={group.subject}>
                <p
                  className="text-xs uppercase tracking-wider mb-3"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {group.subject}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {group.topics.map((topic) => (
                    <TopicCard key={topic.topic} item={topic} subject={group.subject} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  )
}
