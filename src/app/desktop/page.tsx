'use client'
import { useEffect, useState } from 'react'
import { Desktop } from '@/components/os/Desktop'
import { MenuBar } from '@/components/os/MenuBar'
import { Dock } from '@/components/os/Dock'
import { AppLauncher } from '@/components/os/AppLauncher'
import { Window } from '@/components/os/Window'
import { ShowcaseWindow } from '@/components/os/ShowcaseWindow'
import { MiniAppsWindow } from '@/components/os/MiniAppsWindow'
import { BootScreen } from '@/components/os/BootScreen'
import { LoginScreen } from '@/components/os/LoginScreen'
import { MobileLauncher } from '@/components/os/MobileLauncher'
import { WindowId, useWindowManager } from '@/components/os/WindowManager'

type OSPhase = 'boot' | 'login' | 'desktop'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

function WindowLayer() {
  const windows = useWindowManager((s) => s.windows)
  return (
    <>
      {windows
        .filter((w) => w.open && !w.minimised)
        .map((w) => (
          w.id === 'mini-apps' ? (
            <MiniAppsWindow
              key={w.id}
              zIndex={w.zIndex}
              position={w.position}
              size={w.size}
            />
          ) : w.id === 'showcase' ? (
            <ShowcaseWindow
              key={w.id}
              zIndex={w.zIndex}
              position={w.position}
              size={w.size}
            />
          ) : (
            <Window
              key={w.id}
              id={w.id}
              title={w.title}
              src={w.src}
              zIndex={w.zIndex}
              position={w.position}
              size={w.size}
            />
          )
        ))}
    </>
  )
}

export default function DesktopPage() {
  const isMobile = useIsMobile()
  const [phase, setPhase] = useState<OSPhase>('boot')
  const openWindow = useWindowManager((s) => s.openWindow)
  const openWindowWithSrc = useWindowManager((s) => s.openWindowWithSrc)

  useEffect(() => {
    // Skip boot + login if returning user
    try {
      const stored = localStorage.getItem('lumina_user')
      if (stored) {
        setPhase('desktop')
      }
    } catch {
      // localStorage unavailable
    }
  }, [])

  // Auto-open student dashboard when desktop phase begins
  useEffect(() => {
    if (phase === 'desktop') {
      openWindow('student-dashboard')
    }
  }, [phase, openWindow])

  // Listen for OPEN_WINDOW postMessage from iframes
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'OPEN_WINDOW') {
        const id = e.data.windowId as WindowId
        const { topic, format } = e.data
        if (id === 'questlearn' && topic && format) {
          openWindowWithSrc(id, `/learn?topic=${encodeURIComponent(topic)}&format=${encodeURIComponent(format)}`)
        } else {
          openWindow(id)
        }
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [openWindow, openWindowWithSrc])

  if (phase === 'boot') {
    return <BootScreen onComplete={() => setPhase('login')} />
  }

  if (phase === 'login') {
    return (
      <LoginScreen onLogin={() => setPhase('desktop')} />
    )
  }

  // Mobile gets its own shell
  if (isMobile) {
    return <MobileLauncher />
  }

  // Desktop OS
  return (
    <>
      <MenuBar />
      <Desktop>
        <WindowLayer />
      </Desktop>
      <Dock />
      <AppLauncher />
    </>
  )
}
