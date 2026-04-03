'use client'
import { Rnd } from 'react-rnd'
import { useWindowManager, WindowId } from './WindowManager'

interface WindowProps {
  id: WindowId
  title: string
  src: string
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
}

export function Window({ id, title, src, zIndex, position, size }: WindowProps) {
  const closeWindow = useWindowManager((s) => s.closeWindow)
  const minimiseWindow = useWindowManager((s) => s.minimiseWindow)
  const focusWindow = useWindowManager((s) => s.focusWindow)
  const setPosition = useWindowManager((s) => s.setPosition)
  const activeWindow = useWindowManager((s) => s.activeWindow)
  const isActive = activeWindow === id

  return (
    <Rnd
      default={{ x: position.x, y: position.y, width: size.width, height: size.height }}
      dragHandleClassName="title-bar"
      bounds="window"
      enableResizing={false}
      style={{ zIndex }}
      onDragStop={(_e, d) => setPosition(id, { x: d.x, y: d.y })}
      onMouseDown={() => focusWindow(id)}
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
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5 mr-4">
            <TrafficLight
              color="#ef4444"
              hoverSymbol="×"
              isActive={isActive}
              onClick={() => closeWindow(id)}
            />
            <TrafficLight
              color="#f59e0b"
              hoverSymbol="–"
              isActive={isActive}
              onClick={() => minimiseWindow(id)}
            />
            <TrafficLight
              color="#22c55e"
              hoverSymbol="⤢"
              isActive={isActive}
              onClick={() => {}}
            />
          </div>

          {/* Title */}
          <span
            className="flex-1 text-center text-xs"
            style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px' }}
          >
            {title}
          </span>

          {/* Spacer to balance traffic lights */}
          <div style={{ width: '60px' }} />
        </div>

        {/* Content: iframe */}
        <iframe
          src={src}
          className="flex-1 w-full border-0"
          title={title}
          style={{ background: '#0f172a' }}
        />
      </div>
    </Rnd>
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
