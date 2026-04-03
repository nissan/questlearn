'use client'
import { useEffect, useState } from 'react'

interface BootScreenProps {
  onComplete: () => void
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 600

    const tick = (now: number) => {
      const elapsed = now - start
      const pct = Math.min((elapsed / duration) * 100, 100)
      setProgress(pct)
      if (pct < 100) {
        requestAnimationFrame(tick)
      } else {
        setTimeout(onComplete, 150)
      }
    }
    requestAnimationFrame(tick)
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-[10000]"
      style={{ background: '#000' }}
    >
      <div className="animate-pulse text-4xl mb-2">🌟</div>
      <h1 className="text-amber-400 font-semibold text-2xl mb-1">Lumina OS</h1>
      <p className="text-white/60 text-sm mb-8">Powering up your learning space...</p>

      {/* Progress bar */}
      <div
        className="rounded-full overflow-hidden"
        style={{ width: '200px', height: '2px', background: 'rgba(245,158,11,0.2)' }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${progress}%`, background: '#f59e0b', transition: 'none' }}
        />
      </div>
    </div>
  )
}
