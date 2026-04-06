'use client'

import { useWindowManager } from '@/components/os/WindowManager'

const assets = [
  {
    id: 'judge-cheatsheet',
    icon: '📖',
    title: 'The QuestLearn Story',
    description: 'One-pager: problem, solution, differentiators, team, stats',
  },
  {
    id: 'demo-script',
    icon: '🎬',
    title: 'Demo Guide',
    description: '7-min walkthrough with time markers and talking points',
  },
  {
    id: 'value-prop',
    icon: '💡',
    title: 'Why QuestLearn',
    description: 'Teacher-first value prop, student outcomes, school ROI',
  },
  {
    id: 'student-journey',
    icon: '🚀',
    title: 'Student Journey',
    description: 'Topic input → format → AI generation → mastery (Bloom\'s aligned)',
  },
  {
    id: 'judge-faq',
    icon: '❓',
    title: 'Judge FAQ',
    description: 'Pre-armed answers: AI bias, outcomes, monetization, tech stack',
  },
  {
    id: 'backup-demo',
    icon: '🆘',
    title: 'Backup Demo',
    description: 'Fallback instructions + pre-recorded video if live demo breaks',
  },
]

export default function DemoAssets() {
  const openWindow = useWindowManager((s) => s.openWindow)

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
      padding: '2rem',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    }}>
      {/* Header */}
      <div>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 800,
          margin: '0 0 0.5rem',
          color: '#f1f5f9',
        }}>
          Demo Assets
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: '#94a3b8',
          margin: 0,
        }}>
          Everything you need for the pitch, explained and ready to show
        </p>
      </div>

      {/* Grid of asset cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
        flex: 1,
      }}>
        {assets.map((asset) => (
          <button
            key={asset.id}
            onClick={() => openWindow(asset.id as any)}
            style={{
              backgroundColor: 'rgba(30,41,59,0.8)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(30,41,59,1)'
              e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,158,11,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(30,41,59,0.8)'
              e.currentTarget.style.borderColor = 'rgba(245,158,11,0.2)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{ fontSize: '2rem' }}>{asset.icon}</div>
            <h2 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              margin: 0,
              color: '#f1f5f9',
            }}>
              {asset.title}
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: '#94a3b8',
              margin: 0,
              lineHeight: 1.5,
            }}>
              {asset.description}
            </p>
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <div style={{
        fontSize: '0.75rem',
        color: '#475569',
        textAlign: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(148,163,184,0.1)',
      }}>
        Double-click to open an asset. Click or drag the window to move around.
      </div>
    </div>
  )
}
