'use client'
import { useEffect, useState } from 'react'
import { DesktopIcon } from './DesktopIcon'

function getUserRole(): 'student' | 'teacher' | null {
  try {
    const stored = localStorage.getItem('lumina_user')
    if (stored) {
      const user = JSON.parse(stored)
      return user.role ?? null
    }
  } catch {
    return null
  }
  return null
}

export function Desktop({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<'student' | 'teacher' | null>(null)

  useEffect(() => {
    setRole(getUserRole())
  }, [])

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 40% 40%, #1e2d45 0%, #0f172a 60%, #07101f 100%)',
      }}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.6,
        }}
      />

      {/* Amber grid accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,158,11,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Warm amber glow at center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.04) 0%, transparent 60%)',
        }}
      />

      {/* Desktop icons — role-based
          Column 1 (x=0):   primary apps for the role
          Column 2 (x=104): secondary apps (Pitch Deck, Showcase) for all roles
      */}
      <div className="absolute top-12 left-6">

        {/* ── STUDENT ── */}
        {(role === 'student' || role === null) && (
          <>
            {/* Col 1 — primary */}
            <DesktopIcon id="questlearn"       icon="🎓" label="QuestLearn"    defaultPosition={{ x: 0,   y: 0   }} accentColor="#f59e0b" />
            <DesktopIcon id="student-dashboard" icon="🏠" label="My Dashboard" defaultPosition={{ x: 0,   y: 104 }} accentColor="#34d399" />
            <DesktopIcon id="student-help"      icon="🎒" label="Student Guide" defaultPosition={{ x: 0,   y: 208 }} accentColor="#34d399" />
            <DesktopIcon id="mini-apps"         icon="🧩" label="Mini Apps"     defaultPosition={{ x: 0,   y: 312 }} accentColor="#a78bfa" />
            {/* Col 2 — secondary */}
            <DesktopIcon id="pitch"             icon="📋" label="Pitch Deck"   defaultPosition={{ x: 104, y: 0   }} accentColor="#f59e0b" />
            <DesktopIcon id="showcase"          icon="🎬" label="Showcase"     defaultPosition={{ x: 104, y: 104 }} accentColor="#a78bfa" />
          </>
        )}

        {/* ── TEACHER ── */}
        {role === 'teacher' && (
          <>
            {/* Col 1 — primary */}
            <DesktopIcon id="teacher"      icon="📊" label="Teacher Hub"   defaultPosition={{ x: 0,   y: 0   }} accentColor="#60a5fa" />
            <DesktopIcon id="teacher-help" icon="📖" label="Teacher Guide" defaultPosition={{ x: 0,   y: 104 }} accentColor="#60a5fa" />
            {/* Col 2 — secondary */}
            <DesktopIcon id="pitch"        icon="📋" label="Pitch Deck"    defaultPosition={{ x: 104, y: 0   }} accentColor="#f59e0b" />
            <DesktopIcon id="showcase"     icon="🎬" label="Showcase"      defaultPosition={{ x: 104, y: 104 }} accentColor="#a78bfa" />
          </>
        )}

      </div>

      {/* Windows layer */}
      {children}
    </div>
  )
}
