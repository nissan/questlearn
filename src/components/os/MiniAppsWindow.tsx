'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Rnd } from 'react-rnd'
import { useWindowManager } from './WindowManager'

const MINI_APPS = [
  {
    id: 'socratic-tutor',
    title: 'QuestLearn Socratic Tutor',
    src: 'https://app.cogniti.ai/agents/69d053d9324adcb67e01f97d/chat',
    icon: '🎓',
    color: '#3b82f6',
  },
  {
    id: 'concept-map',
    title: 'Concept Map Mini App',
    src: 'https://app.cogniti.ai/interactives/69d0609388709ae18201f7d4/run',
    icon: '🗺️',
    color: '#10b981',
  },
]

function MiniAppCard({ app }: { app: (typeof MINI_APPS)[0] }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [srcKey, setSrcKey] = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setStatus((prev) => (prev === 'loading' ? 'error' : prev))
    }, 15000)
  }, [])

  useEffect(() => {
    setStatus('loading')
    startTimeout()
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [srcKey, startTimeout])

  const handleLoad = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setStatus('loaded')
  }

  const handleRetry = () => {
    setSrcKey((k) => k + 1)
  }

  const iframeSrc = srcKey === 0 ? app.src : `${app.src}${app.src.includes('?') ? '&' : '?'}t=${Date.now()}`

  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl transition-all group"
      style={{
        minHeight: '320px',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid rgba(255,255,255,0.06)`,
        borderLeft: `3px solid ${app.color}`,
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = `${app.color}4d`
        ;(e.currentTarget as HTMLDivElement).style.borderLeftColor = app.color
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'
        ;(e.currentTarget as HTMLDivElement).style.borderLeftColor = app.color
      }}
    >
      {/* Card title bar */}
      <div
        className="flex items-center gap-2 px-3 py-2 shrink-0"
        style={{
          background: '#0f172a',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span className="text-base">{app.icon}</span>
        <span className="text-xs font-medium text-white flex-1 truncate">{app.title}</span>
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: status === 'loaded' ? '#22c55e' : status === 'error' ? '#ef4444' : '#f59e0b' }}
        />
      </div>

      {/* Content area */}
      <div className="relative flex-1" style={{ minHeight: '280px' }}>
        {/* Loading overlay */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
            style={{ background: '#111827' }}>
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: `${app.color} transparent transparent transparent` }}
            />
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading {app.title}…</p>
          </div>
        )}

        {/* Error fallback */}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
            style={{ background: '#111827' }}>
            <span className="text-4xl">⚠️</span>
            <p className="text-sm text-white font-medium">{app.title}</p>
            <p className="text-xs text-center px-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Unable to load — the app may be unavailable
            </p>
            <button
              onClick={handleRetry}
              className="text-xs px-4 py-1.5 rounded-lg transition-colors"
              style={{
                background: `${app.color}22`,
                border: `1px solid ${app.color}44`,
                color: app.color,
              }}
            >
              ↺ Retry
            </button>
          </div>
        )}

        {/* iframe */}
        <iframe
          key={srcKey}
          src={iframeSrc}
          title={app.title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          loading="lazy"
          onLoad={handleLoad}
          className="w-full h-full border-0 rounded-b-xl"
          style={{
            display: 'block',
            minHeight: '280px',
            opacity: status === 'loaded' ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      </div>
    </div>
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

export function MiniAppsWindow({
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
  const isActive = activeWindow === 'mini-apps'

  return (
    <Rnd
      default={{ x: position.x, y: position.y, width: size.width, height: size.height }}
      dragHandleClassName="title-bar"
      bounds="window"
      enableResizing
      minWidth={420}
      minHeight={400}
      style={{ zIndex }}
      onDragStop={(_e, d) => setPosition('mini-apps', { x: d.x, y: d.y })}
      onMouseDown={() => focusWindow('mini-apps')}
    >
      <div
        className="flex flex-col overflow-hidden"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          background: '#111827',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.05)',
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
            <TrafficLight color="#ef4444" hoverSymbol="×" isActive={isActive} onClick={() => closeWindow('mini-apps')} />
            <TrafficLight color="#f59e0b" hoverSymbol="–" isActive={isActive} onClick={() => minimiseWindow('mini-apps')} />
            <TrafficLight color="#22c55e" hoverSymbol="⤢" isActive={isActive} onClick={() => {}} />
          </div>
          <span className="flex-1 text-center text-xs" style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px' }}>
            🧩 Mini Apps — Cogniti Interactive Modules
          </span>
          <div style={{ width: '60px' }} />
        </div>

        {/* Grid content */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '16px',
            alignContent: 'start',
          }}
        >
          {MINI_APPS.map((app) => (
            <MiniAppCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </Rnd>
  )
}
