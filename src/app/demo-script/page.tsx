'use client'

import { useState } from 'react'

const cues = [
  {
    time: '0:00',
    speaker: 'Nissan',
    title: 'Hook (30s)',
    content: '"A student in Bourke gets the same AI tutor as a student in Bondi."',
    notes: 'Open the live demo. Show login → student role.',
  },
  {
    time: '0:30',
    speaker: 'Both',
    title: 'The Problem (1:00)',
    content: '3-year learning gap by Year 9. 60% teacher turnover. 50% remote communities offline.',
    notes: 'Point to problem slide in pitch deck. Emphasize equity gap.',
  },
  {
    time: '1:30',
    speaker: 'Nissan',
    title: 'The Solution (1:30)',
    content: 'Student picks format (Game/Story/Meme/Puzzle/Film) → AI asks Socratic questions → teacher sees heatmap.',
    notes: 'Show QuestLearn main page. Click into a topic. Show format selection.',
  },
  {
    time: '3:00',
    speaker: 'Anusha',
    title: 'The Loop (1:00)',
    content: 'This isn\'t ChatGPT tutoring. The AI asks questions, never gives answers. It\'s Socratic.',
    notes: 'Show a live interaction (Game or Story format). Let an answer be wrong, show how AI responds.',
  },
  {
    time: '4:00',
    speaker: 'Nissan',
    title: 'Teacher Dashboard (1:00)',
    content: 'Teachers see topic × format × engagement heatmap. Class aggregate only. Zero PII.',
    notes: 'Switch to teacher role. Show heatmap. Explain what each cell means.',
  },
  {
    time: '5:00',
    speaker: 'Anusha',
    title: 'Tech Stack (0:45)',
    content: 'Next.js 16.2 + CurricuLLM-AU + Cogniti + 57/57 Playwright tests. Curriculum-native.',
    notes: 'Optional: show GitHub repo. Emphasize AC v9 alignment.',
  },
  {
    time: '5:45',
    speaker: 'Both',
    title: 'What\'s Next (1:15)',
    content: 'v1 live. v2: Study Rooms + Quiz Rooms. v3: Cross-school matching.',
    notes: 'Show roadmap slide. Invite questions. QR code to GitHub.',
  },
]

export default function DemoScript() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0)

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
      padding: '2rem',
      boxSizing: 'border-box',
      overflowY: 'auto',
      maxHeight: '100vh',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid rgba(245,158,11,0.3)', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 0.5rem', color: '#f1f5f9' }}>
            Demo Guide
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>
            7-minute timed walkthrough for Nissan + Anusha · Cambridge EduX Demo Day
          </p>
        </div>

        {/* Total time badge */}
        <div style={{
          backgroundColor: 'rgba(245,158,11,0.1)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          marginBottom: '2rem',
          display: 'inline-block',
        }}>
          <span style={{ color: '#f59e0b', fontWeight: 700 }}>⏱️ Total Duration:</span>
          <span style={{ color: '#cbd5e1', marginLeft: '0.5rem' }}>7 minutes</span>
        </div>

        {/* Cues */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cues.map((cue, idx) => (
            <button
              key={idx}
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              style={{
                backgroundColor: 'rgba(30,41,59,0.8)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(30,41,59,1)'
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(30,41,59,0.8)'
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b', minWidth: '60px' }}>
                  {cue.time}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  {cue.speaker}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', flex: 1 }}>
                  {cue.title}
                </div>
              </div>

              {/* Expanded content */}
              {expandedIdx === idx && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                  <p style={{ fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '0.75rem', fontWeight: 600 }}>
                    💬 {cue.content}
                  </p>
                  <div style={{
                    backgroundColor: 'rgba(34,197,94,0.08)',
                    border: '1px solid rgba(34,197,94,0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    fontSize: '0.85rem',
                    color: '#cbd5e1',
                  }}>
                    <span style={{ color: '#22c55e', fontWeight: 700 }}>📌 Cue:</span> {cue.notes}
                  </div>
                </div>
              )}

              {/* Chevron */}
              <div style={{
                position: 'absolute',
                right: '1.25rem',
                top: '50%',
                transform: `translateY(-50%) rotate(${expandedIdx === idx ? 180 : 0}deg)`,
                transition: 'transform 0.2s',
                color: '#f59e0b',
              }}>
                ▼
              </div>
            </button>
          ))}
        </div>

        {/* Footer notes */}
        <div style={{
          backgroundColor: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginTop: '2rem',
        }}>
          <h3 style={{ fontSize: '0.9rem', color: '#6366f1', fontWeight: 700, marginBottom: '0.5rem' }}>
            💡 Demo Tips
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              'Keep to ~7 minutes. Judges have short attention spans.',
              'Have a backup demo video ready (see Backup Demo asset).',
              'Always start with the problem. The equity gap is what sells it.',
              'Let students be wrong in the Socratic loop — don\'t jump in.',
              'End with the roadmap. Show where this is going.',
            ].map((tip, i) => (
              <li key={i} style={{
                fontSize: '0.85rem',
                color: '#cbd5e1',
                paddingLeft: '1.5rem',
                position: 'relative',
                lineHeight: 1.6,
              }}>
                <span style={{ position: 'absolute', left: 0, color: '#6366f1' }}>›</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
