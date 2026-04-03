'use client'
import Draggable from 'react-draggable'
import { useRef, useState } from 'react'
import { WindowId, useWindowManager } from './WindowManager'

interface DesktopIconProps {
  id: WindowId
  icon: string
  label: string
  defaultPosition: { x: number; y: number }
  accentColor?: string
}

export function DesktopIcon({
  id,
  icon,
  label,
  defaultPosition,
  accentColor = '#f59e0b',
}: DesktopIconProps) {
  const openWindow = useWindowManager((s) => s.openWindow)
  const [selected, setSelected] = useState(false)
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nodeRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    setSelected(true)
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
      openWindow(id)
    } else {
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null
      }, 280)
    }
  }

  return (
    <Draggable
      defaultPosition={defaultPosition}
      handle=".icon-handle"
      nodeRef={nodeRef as React.RefObject<HTMLElement>}
    >
      <div ref={nodeRef} className="icon-handle absolute select-none" style={{ width: '80px' }}>
        <div
          onClick={handleClick}
          onBlur={() => setSelected(false)}
          tabIndex={0}
          className="flex flex-col items-center gap-1 cursor-default"
        >
          {/* Icon box */}
          <div
            className="flex items-center justify-center rounded-[14px] text-3xl"
            style={{
              width: '76px',
              height: '76px',
              background: 'linear-gradient(135deg, #1e2d45, #0f172a)',
              boxShadow: selected
                ? `0 0 0 2px ${accentColor}, 0 8px 24px rgba(0,0,0,0.4)`
                : '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            {icon}
          </div>

          {/* Label */}
          <span
            className="text-center text-xs leading-tight px-1 py-0.5 rounded max-w-full break-words"
            style={{
              color: 'white',
              textShadow: '0 1px 3px rgba(0,0,0,0.6)',
              background: selected ? 'rgba(245,158,11,0.2)' : 'transparent',
              border: selected ? `1px solid rgba(245,158,11,0.4)` : '1px solid transparent',
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </Draggable>
  )
}
