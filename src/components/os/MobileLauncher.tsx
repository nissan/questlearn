'use client'
import { useState, useEffect } from 'react'

type MobileView = 'home' | 'learn' | 'teacher'

const MOBILE_APPS = [
  { id: 'questlearn', icon: '🎓', label: 'QuestLearn', view: 'learn' as MobileView },
  { id: 'teacher', icon: '📊', label: 'Teacher Hub', view: 'teacher' as MobileView },
]

export function MobileLauncher() {
  const [activeView, setActiveView] = useState<MobileView>('home')
  const [currentTime, setCurrentTime] = useState('')

  // Route directly based on role — skip the home grid
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lumina_user')
      if (stored) {
        const user = JSON.parse(stored)
        if (user?.role === 'teacher') {
          setActiveView('teacher')
        } else {
          setActiveView('learn')
        }
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    const tick = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (activeView === 'learn') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#0f172a' }}>
        <div
          className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          <button
            onClick={() => setActiveView('home')}
            className="text-amber-400 text-sm font-medium"
          >
            ← Home
          </button>
          <span className="text-white font-medium">QuestLearn</span>
        </div>
        <iframe
          src="/learn"
          className="flex-1 w-full border-0"
          title="QuestLearn"
          style={{ minHeight: 0 }}
        />
      </div>
    )
  }

  if (activeView === 'teacher') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#0f172a' }}>
        <div
          className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          <button
            onClick={() => setActiveView('home')}
            className="text-amber-400 text-sm font-medium"
          >
            ← Home
          </button>
          <span className="text-white font-medium">Teacher Hub</span>
        </div>
        <iframe
          src="/teacher"
          className="flex-1 w-full border-0"
          title="Teacher Hub"
          style={{ minHeight: 0 }}
        />
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        background: 'radial-gradient(ellipse at center, #1e2d45 0%, #0f172a 100%)',
      }}
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-amber-400 font-semibold text-xs">🎓 QuestLearn</span>
        <span className="text-white text-xs font-mono">{currentTime}</span>
      </div>

      {/* Welcome text */}
      <div className="px-6 pt-4 pb-2">
        <h1 className="text-white text-xl font-semibold">Good day, learner! 👋</h1>
        <p className="text-white/50 text-sm mt-1">What do you want to explore today?</p>
      </div>

      {/* App grid — 2 columns */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="grid grid-cols-2 gap-6 w-full max-w-xs">
          {MOBILE_APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => setActiveView(app.view)}
              className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div
                className="flex items-center justify-center rounded-[18px] text-4xl"
                style={{
                  width: '76px',
                  height: '76px',
                  background: 'linear-gradient(135deg, #1e2d45, #0f172a)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                {app.icon}
              </div>
              <span
                className="text-xs font-medium text-center"
                style={{ color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
              >
                {app.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* v2/v3 teaser */}
      <div className="px-6 pb-4 text-center">
        <p className="text-white/30 text-xs">
          Study Rooms · Quiz Rooms · Regional Insights — coming soon
        </p>
      </div>

      {/* Bottom nav */}
      <div
        className="flex items-center justify-around px-4"
        style={{
          height: '68px',
          background: 'rgba(15, 23, 42, 0.9)',
          borderTop: '1px solid rgba(245, 158, 11, 0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {(
          [
            { label: 'Home', icon: '🏠', view: 'home' as MobileView },
            { label: 'Learn', icon: '🎓', view: 'learn' as MobileView },
            { label: 'Teacher', icon: '📊', view: 'teacher' as MobileView },
          ] as const
        ).map((tab) => (
          <button
            key={tab.view}
            onClick={() => setActiveView(tab.view)}
            className="flex flex-col items-center gap-0.5 min-w-[44px]"
          >
            <span className="text-xl">{tab.icon}</span>
            <span
              className="text-xs"
              style={{
                color: activeView === tab.view ? '#f59e0b' : 'rgba(255,255,255,0.5)',
              }}
            >
              {tab.label}
            </span>
            {activeView === tab.view && (
              <div
                className="rounded-full"
                style={{
                  width: '16px',
                  height: '2px',
                  background: '#f59e0b',
                  marginTop: '2px',
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
