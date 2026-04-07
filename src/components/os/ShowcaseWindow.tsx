'use client'
import { useState } from 'react'
import { Rnd } from 'react-rnd'
import { useWindowManager } from './WindowManager'

const VIDEOS = [
  // ── Full Demos ──
  {
    id: 'a1',
    label: 'QuestLearn — Cinematic',
    subtitle: 'Full demo · 77s · Judges cut',
    icon: '🎬',
    color: '#f59e0b',
    src: '/showcase/A-cinematic.mp4',
  },
  {
    id: 'b1',
    label: 'QuestLearn — Walkthrough',
    subtitle: 'Full demo · 71s · General audience',
    icon: '🎓',
    color: '#34d399',
    src: '/showcase/B-walkthrough.mp4',
  },
  {
    id: 'c1',
    label: 'QuestLearn — Explainer',
    subtitle: 'Technical · 108s · Judges panel',
    icon: '🔬',
    color: '#60a5fa',
    src: '/showcase/C-explainer.mp4',
  },
  {
    id: 'd1',
    label: 'QuestLearn — Backup Submission Cut',
    subtitle: 'Backup · 4m09s · Demo-day fallback',
    icon: '🛟',
    color: '#38bdf8',
    src: '/showcase/questlearn-pitch-backup-2026-04-08.mp4',
  },
  {
    id: 'd2',
    label: 'QuestLearn — Mini Apps Demo',
    subtitle: 'Flashcards · Concept Map · Debate · Meme · real app',
    icon: '🧩',
    color: '#22c55e',
    src: '/showcase/D-mini-apps.mp4',
  },
  {
    id: 'd3',
    label: 'QuestLearn — CurricuLLM vs Cogniti',
    subtitle: 'Technical comparison · AI tutor modes',
    icon: '⚙️',
    color: '#a78bfa',
    src: '/showcase/questlearn-curricullm-vs-cogniti-demo.mp4',
  },
  // ── Student Personas ──
  {
    id: 's1',
    label: 'Zara Osei',
    subtitle: 'Year 10 · Photosynthesis · Story',
    icon: '📖',
    color: '#f59e0b',
    src: '/showcase/S1-narrated.mp4',
  },
  {
    id: 's2',
    label: 'Kai Nguyen',
    subtitle: "Year 9 · Newton's Laws · Game",
    icon: '🎮',
    color: '#60a5fa',
    src: '/showcase/S2-narrated.mp4',
  },
  {
    id: 's3',
    label: 'Priya Sharma',
    subtitle: 'Year 8 · Water Cycle · Meme',
    icon: '😂',
    color: '#a78bfa',
    src: '/showcase/S3-narrated.mp4',
  },
  {
    id: 't1',
    label: 'Ms. Rachel Chen',
    subtitle: 'Teacher · Science · Dashboard',
    icon: '🔬',
    color: '#34d399',
    src: '/showcase/T1-narrated.mp4',
  },
  {
    id: 't2',
    label: 'Mr. David Okafor',
    subtitle: 'Teacher · Mathematics · Dashboard',
    icon: '📐',
    color: '#f472b6',
    src: '/showcase/T2-narrated.mp4',
  },
]

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

  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const currentVideo = VIDEOS.find((v) => v.id === activeVideo)

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
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          background: '#1e2d45',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,158,11,0.05)',
        }}
      >
        {/* Title bar */}
        <div
          className="title-bar flex items-center px-3 shrink-0 select-none cursor-move"
          style={{
            height: '36px',
            background: '#0f172a',
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
            {currentVideo ? `▶ ${currentVideo.label} — ${currentVideo.subtitle}` : '📁 Showcase'}
          </span>
          <div style={{ width: '60px' }} />
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar — video list */}
          <div
            className="flex flex-col shrink-0 overflow-y-auto"
            style={{
              width: '220px',
              background: '#0f172a',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              padding: '12px 8px',
              gap: '4px',
            }}
          >
            <p className="text-xs font-semibold px-2 pb-2" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.8px' }}>
              DEMO RECORDINGS
            </p>

            {/* Full Demos */}
            <p className="text-xs px-2 py-1" style={{ color: 'rgba(255,255,255,0.2)' }}>📽️ Full Demos</p>
            {VIDEOS.filter(v => !v.id.startsWith('s') && !v.id.startsWith('t')).map((v) => (
              <VideoListItem
                key={v.id}
                video={v}
                isActive={activeVideo === v.id}
                onClick={() => setActiveVideo(v.id)}
              />
            ))}

            {/* Students */}
            <p className="text-xs px-2 py-1 mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>Students</p>
            {VIDEOS.filter(v => v.id.startsWith('s')).map((v) => (
              <VideoListItem
                key={v.id}
                video={v}
                isActive={activeVideo === v.id}
                onClick={() => setActiveVideo(v.id)}
              />
            ))}

            {/* Teachers */}
            <p className="text-xs px-2 py-1 mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>Teachers</p>
            {VIDEOS.filter(v => v.id.startsWith('t')).map((v) => (
              <VideoListItem
                key={v.id}
                video={v}
                isActive={activeVideo === v.id}
                onClick={() => setActiveVideo(v.id)}
              />
            ))}
          </div>

          {/* Main — video player or folder grid */}
          <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#111827' }}>
            {currentVideo ? (
              // Video player
              <div className="flex-1 flex flex-col">
                <video
                  key={currentVideo.src}
                  src={currentVideo.src}
                  controls
                  autoPlay
                  className="flex-1 w-full"
                  style={{ background: '#000', maxHeight: 'calc(100% - 48px)' }}
                />
                <div
                  className="shrink-0 flex items-center justify-between px-4 py-2"
                  style={{ background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div>
                    <p className="text-sm font-medium text-white">{currentVideo.label}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{currentVideo.subtitle}</p>
                  </div>
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="text-xs px-3 py-1 rounded-md"
                    style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
                  >
                    ← Back to folder
                  </button>
                </div>
              </div>
            ) : (
              // Folder grid view
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-3 gap-4">
                  {VIDEOS.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setActiveVideo(v.id)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-105 group"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid rgba(255,255,255,0.06)`,
                      }}
                    >
                      {/* Thumbnail placeholder */}
                      <div
                        className="w-full aspect-video rounded-lg flex items-center justify-center text-3xl"
                        style={{
                          background: `linear-gradient(135deg, ${v.color}22, ${v.color}11)`,
                          border: `1px solid ${v.color}33`,
                        }}
                      >
                        {v.icon}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-white">{v.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{v.subtitle}</p>
                      </div>
                      {/* Play hint */}
                      <div
                        className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: v.color }}
                      >
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

function VideoListItem({
  video,
  isActive,
  onClick,
}: {
  video: (typeof VIDEOS)[0]
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-left w-full transition-colors"
      style={{
        background: isActive ? `${video.color}22` : 'transparent',
        border: isActive ? `1px solid ${video.color}44` : '1px solid transparent',
      }}
    >
      <span className="text-base shrink-0">{video.icon}</span>
      <div className="overflow-hidden">
        <p className="text-xs font-medium text-white truncate">{video.label}</p>
        <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{video.subtitle}</p>
      </div>
    </button>
  )
}

function TrafficLight({
  color,
  hoverSymbol,
  isActive,
  onClick,
}: {
  color: string
  hoverSymbol: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center justify-center rounded-full text-transparent hover:text-black transition-colors text-[9px] font-bold leading-none"
      style={{
        width: '12px',
        height: '12px',
        background: isActive ? color : '#374151',
        flexShrink: 0,
      }}
    >
      <span className="hidden group-hover:inline">{hoverSymbol}</span>
    </button>
  )
}
