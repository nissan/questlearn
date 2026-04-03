'use client'
import { useEffect, useState } from 'react'
import { useWindowManager } from './WindowManager'

export function MenuBar() {
  const [time, setTime] = useState('')
  const activeWindow = useWindowManager((s) => s.activeWindow)
  const windows = useWindowManager((s) => s.windows)
  const setLauncher = useWindowManager((s) => s.setLauncher)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(
        now.toLocaleString('en-AU', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const activeTitle = windows.find((w) => w.id === activeWindow)?.title ?? 'Lumina OS'

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-4"
      style={{
        height: '28px',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Left: Logo + active app */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setLauncher(true)}
          className="text-amber-400 font-semibold text-sm hover:text-amber-300 transition-colors"
        >
          🌟 Lumina
        </button>
        <span className="text-white text-sm font-medium">{activeTitle}</span>
        <span className="text-white/40 text-sm hidden md:inline">File</span>
        <span className="text-white/40 text-sm hidden md:inline">View</span>
        <span className="text-white/40 text-sm hidden md:inline">Help</span>
      </div>

      {/* Right: clock + avatar */}
      <div className="flex items-center gap-3">
        <span className="text-white text-xs font-mono hidden sm:inline">{time}</span>
        <span className="text-white/60 text-xs">◉</span>
        <div
          className="flex items-center justify-center rounded-full text-xs font-bold"
          style={{ width: '20px', height: '20px', background: '#f59e0b', color: '#0f172a' }}
        >
          LO
        </div>
      </div>
    </div>
  )
}
