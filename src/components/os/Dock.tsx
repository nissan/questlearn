'use client'
import { WindowId, useWindowManager } from './WindowManager'

const DOCK_APPS = [
  { id: 'questlearn' as const, icon: '🎓', label: 'QuestLearn', color: '#f59e0b' },
  { id: 'teacher' as const, icon: '📊', label: 'Teacher Hub', color: '#60a5fa' },
  { id: 'showcase' as const, icon: '🎬', label: 'Showcase', color: '#a78bfa' },
  { id: 'student-dashboard' as const, icon: '🏠', label: 'My Dashboard', color: '#34d399' },
  { id: 'mini-apps' as const, icon: '🧩', label: 'Mini Apps', color: '#ec4899' },
  { id: 'pitch' as const, icon: '📋', label: 'Pitch Deck', color: '#f59e0b' },
  { id: 'student-help' as const, icon: '🎒', label: 'Student Guide', color: '#34d399' },
  { id: 'teacher-help' as const, icon: '📖', label: 'Teacher Guide', color: '#60a5fa' },
]

export function Dock() {
  const windows = useWindowManager((s) => s.windows)
  const openWindow = useWindowManager((s) => s.openWindow)
  const restoreWindow = useWindowManager((s) => s.restoreWindow)
  const setLauncher = useWindowManager((s) => s.setLauncher)
  const activeWindow = useWindowManager((s) => s.activeWindow)

  const handleAppClick = (id: WindowId) => {
    const win = windows.find((w) => w.id === id)
    if (!win) return
    if (win.open && win.minimised) {
      restoreWindow(id)
    } else if (win.open) {
      restoreWindow(id)
    } else {
      openWindow(id)
    }
  }

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9998] flex items-end gap-3 px-4 py-2"
      style={{
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(245, 158, 11, 0.15)',
        borderRadius: '20px',
      }}
    >
      {DOCK_APPS.map((app) => {
        const win = windows.find((w) => w.id === app.id)
        const isOpen = win?.open && !win?.minimised
        const isActive = activeWindow === app.id

        return (
          <div key={app.id} className="flex flex-col items-center gap-1">
            <button
              onClick={() => handleAppClick(app.id)}
              className="dock-icon flex items-center justify-center rounded-[14px] text-2xl transition-transform hover:scale-125 duration-200 ease-out"
              style={{
                width: '60px',
                height: '60px',
                background: `linear-gradient(135deg, #1e2d45, #0f172a)`,
                boxShadow: isActive
                  ? `0 0 0 2px ${app.color}`
                  : '0 4px 12px rgba(0,0,0,0.4)',
              }}
              title={app.label}
            >
              {app.icon}
            </button>
            {/* Running indicator */}
            <div
              className="rounded-full transition-opacity"
              style={{
                width: '4px',
                height: '4px',
                background: '#f59e0b',
                opacity: isOpen ? 1 : 0,
              }}
            />
          </div>
        )
      })}

      {/* Separator */}
      <div
        style={{
          width: '1px',
          height: '40px',
          background: 'rgba(255,255,255,0.1)',
          margin: '0 4px',
          alignSelf: 'center',
        }}
      />

      {/* Launchpad */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => setLauncher(true)}
          className="dock-icon flex items-center justify-center rounded-[14px] text-2xl transition-transform hover:scale-125 duration-200 ease-out"
          style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #2d3f5e, #1e2d45)',
          }}
          title="App Launcher"
        >
          🔍
        </button>
        <div style={{ width: '4px', height: '4px', opacity: 0 }} />
      </div>

      {/* Trash (decorative) */}
      <div className="flex flex-col items-center gap-1">
        <button
          className="dock-icon flex items-center justify-center rounded-[14px] text-2xl transition-transform hover:scale-125 duration-200 ease-out cursor-default"
          style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #2d3f5e, #1e2d45)',
          }}
          title="Trash"
        >
          🗑️
        </button>
        <div style={{ width: '4px', height: '4px', opacity: 0 }} />
      </div>
    </div>
  )
}
