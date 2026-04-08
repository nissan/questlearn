'use client'
import { useState } from 'react'
import { Rnd } from 'react-rnd'
import { useWindowManager } from './WindowManager'

// ─── Video registry ────────────────────────────────────────────────────────────
// IMPORTANT: use versioned filenames so Vercel CDN never serves stale cached
// copies. When you re-render videos, update the filename version suffix here.
const V = 'v20260408'

const VIDEOS = [
  // ── Full Demos ──
  {
    id: 'a1',
    label: 'QuestLearn — Cinematic',
    subtitle: `Full demo · 57s · Judges cut`,
    icon: '🎬',
    color: '#f59e0b',
    src: `/showcase/A-cinematic.mp4`,
    scriptHref: '/recording-script',
  },
  {
    id: 'b1',
    label: 'QuestLearn — Walkthrough',
    subtitle: `Full demo · 60s · General audience`,
    icon: '🎓',
    color: '#34d399',
    src: `/showcase/B-walkthrough.mp4`,
    scriptHref: '/recording-script',
  },
  {
    id: 'c1',
    label: 'QuestLearn — Explainer',
    subtitle: `Technical · 98s · Judges panel`,
    icon: '🔬',
    color: '#60a5fa',
    src: `/showcase/C-explainer.mp4`,
    scriptHref: '/recording-script',
  },
  {
    id: 'd1',
    label: 'QuestLearn — Backup Submission Cut',
    subtitle: `Backup · 4m09s · Demo-day fallback`,
    icon: '🛟',
    color: '#38bdf8',
    src: `/showcase/questlearn-pitch-backup-2026-04-08.mp4`,
    scriptHref: '/backup-demo',
  },
  {
    id: 'd2',
    label: 'QuestLearn — Mini Apps Demo',
    subtitle: `Flashcards · Concept Map · Debate · Meme`,
    icon: '🧩',
    color: '#22c55e',
    src: `/showcase/D-mini-apps-${V}.mp4`,
    scriptHref: '/recording-script',
  },
  {
    id: 'd3',
    label: 'QuestLearn — CurricuLLM vs Cogniti',
    subtitle: `Technical comparison · AI tutor modes`,
    icon: '⚙️',
    color: '#a78bfa',
    src: `/showcase/questlearn-curricullm-vs-cogniti-demo.mp4`,
    scriptHref: '/demo-script',
  },
  // ── Student Personas ──
  {
    id: 's1',
    label: 'Zara Osei',
    subtitle: `Year 10 · Photosynthesis · Meme + Flashcards`,
    icon: '📖',
    color: '#f59e0b',
    src: `/showcase/S1-narrated-${V}.mp4`,
    scriptHref: '/recording-script',
  },
  {
    id: 's2',
    label: 'Kai Nguyen',
    subtitle: `Year 9 · Newton's Laws · Debate + Concept Map`,
    icon: '🎮',
    color: '#60a5fa',
    src: `/showcase/S2-narrated-${V}.mp4`,
    scriptHref: '/recording-script',
  },
  {
    id: 's3',
    label: 'Priya Sharma',
    subtitle: `Year 8 · Water Cycle · Meme + Concept Map`,
    icon: '😂',
    color: '#a78bfa',
    src: `/showcase/S3-narrated-${V}.mp4`,
    scriptHref: '/recording-script',
  },
  // ── Teacher Personas ──
  {
    id: 't1',
    label: 'Ms. Rachel Chen',
    subtitle: `Teacher · Science · Dashboard`,
    icon: '🔬',
    color: '#34d399',
    src: `/showcase/T1-narrated-${V}.mp4`,
    scriptHref: '/recording-script',
  },
  {
    id: 't2',
    label: 'Mr. David Okafor',
    subtitle: `Teacher · Mathematics · Dashboard`,
    icon: '📐',
    color: '#f472b6',
    src: `/showcase/T2-narrated-${V}.mp4`,
    scriptHref: '/recording-script',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────
export function ShowcaseWindow({
  zIndex,
  position,
  size,
}: {
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
}) {
  const closeWindow = useWindowManager((s) => s.closeWindow)
  const minimiseWindow = useWindowManager((s) => s.minimiseWindow)
  const focusWindow = useWindowManager((s) => s.focusWindow)
  const setPosition = useWindowManager((s) => s.setPosition)
  const activeWindow = useWindowManager((s) => s.activeWindow)
  const isActive = activeWindow === 'showcase'

  const [activeId, setActiveId] = useState<string | null>(null)
  const current = VIDEOS.find((v) => v.id === activeId) ?? null

  return (
    <Rnd
      default={{ x: position.x, y: position.y, width: size.width, height: size.height }}
      dragHandleClassName="title-bar"
      bounds="window"
      enableResizing={false}
      style={{ zIndex }}
      onDragStop={(_e, d) => setPosition('showcase', { x: d.x, y: d.y })}
      onMouseDown={() => focusWindow('showcase')}
    >
      <div
        className="flex flex-col overflow-hidden"
        style={{
          width: '100%', height: '100%',
          borderRadius: '12px',
          background: '#1e2d45',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
        }}
      >
        {/* Title bar */}
        <div
          className="title-bar flex items-center px-3 shrink-0 select-none cursor-move"
          style={{
            height: '36px', background: '#0f172a',
            borderRadius: '12px 12px 0 0',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-1.5 mr-4">
            <TrafficLight color="#ef4444" hoverSymbol="×" isActive={isActive} onClick={() => closeWindow('showcase')} />
            <TrafficLight color="#f59e0b" hoverSymbol="–" isActive={isActive} onClick={() => minimiseWindow('showcase')} />
            <TrafficLight color="#22c55e" hoverSymbol="⤢" isActive={isActive} onClick={() => {}} />
          </div>
          <span className="flex-1 text-center text-xs" style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px' }}>
            {current ? `▶ ${current.label} — ${current.subtitle}` : '📁 Showcase'}
          </span>
          <div style={{ width: '60px' }} />
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div
            className="flex flex-col shrink-0 overflow-y-auto"
            style={{
              width: '220px', background: '#0f172a',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              padding: '12px 8px', gap: '4px',
            }}
          >
            <p className="text-xs font-semibold px-2 pb-2" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.8px' }}>
              DEMO RECORDINGS
            </p>

            <SidebarGroup label="📽️ Full Demos" videos={VIDEOS.filter(v => ['a1','b1','c1','d1','d2','d3'].includes(v.id))} activeId={activeId} onSelect={setActiveId} />
            <SidebarGroup label="Students" videos={VIDEOS.filter(v => v.id.startsWith('s'))} activeId={activeId} onSelect={setActiveId} />
            <SidebarGroup label="Teachers" videos={VIDEOS.filter(v => v.id.startsWith('t'))} activeId={activeId} onSelect={setActiveId} />
          </div>

          {/* Main */}
          <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#111827' }}>
            {current ? (
              <div className="flex-1 flex flex-col">
                <video
                  key={current.src}
                  src={current.src}
                  controls
                  autoPlay
                  playsInline
                  className="flex-1 w-full"
                  style={{ background: '#000', maxHeight: 'calc(100% - 48px)' }}
                />
                <div
                  className="shrink-0 flex items-center justify-between px-4 py-2"
                  style={{ background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div>
                    <p className="text-sm font-medium text-white">{current.label}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{current.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={current.scriptHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1 rounded-md"
                      style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.35)', textDecoration: 'none' }}
                    >
                      📝 View script
                    </a>
                    <button
                      onClick={() => setActiveId(null)}
                      className="text-xs px-3 py-1 rounded-md"
                      style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
                    >
                      ← Back to folder
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-3 gap-4">
                  {VIDEOS.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setActiveId(v.id)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-105 group"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div
                        className="w-full aspect-video rounded-lg flex items-center justify-center text-3xl"
                        style={{ background: `linear-gradient(135deg, ${v.color}22, ${v.color}11)`, border: `1px solid ${v.color}33` }}
                      >
                        {v.icon}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-white">{v.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{v.subtitle}</p>
                      </div>
                      <div className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: v.color }}>
                        ▶ Play
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Rnd>
  )
}

// ─── Sidebar group ─────────────────────────────────────────────────────────────
function SidebarGroup({ label, videos, activeId, onSelect }: {
  label: string
  videos: typeof VIDEOS
  activeId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <>
      <p className="text-xs px-2 py-1 mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>{label}</p>
      {videos.map((v) => (
        <button
          key={v.id}
          onClick={() => onSelect(v.id)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-left w-full transition-colors"
          style={{
            background: activeId === v.id ? `${v.color}22` : 'transparent',
            border: activeId === v.id ? `1px solid ${v.color}44` : '1px solid transparent',
          }}
        >
          <span className="text-base shrink-0">{v.icon}</span>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-white truncate">{v.label}</p>
            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{v.subtitle}</p>
          </div>
        </button>
      ))}
    </>
  )
}

// ─── Traffic light ─────────────────────────────────────────────────────────────
function TrafficLight({ color, hoverSymbol, isActive, onClick }: {
  color: string; hoverSymbol: string; isActive: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center justify-center rounded-full text-transparent hover:text-black transition-colors text-[9px] font-bold leading-none"
      style={{ width: '12px', height: '12px', background: isActive ? color : '#374151', flexShrink: 0 }}
    >
      <span className="hidden group-hover:inline">{hoverSymbol}</span>
    </button>
  )
}
