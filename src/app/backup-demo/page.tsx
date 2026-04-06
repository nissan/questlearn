'use client'

export default function BackupDemo() {
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
        {/* Alert banner */}
        <div style={{
          backgroundColor: 'rgba(239,68,68,0.15)',
          border: '2px solid rgba(239,68,68,0.4)',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          marginBottom: '2rem',
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.5rem', color: '#fecaca' }}>
            🆘 Backup Demo — Use If Live Demo Breaks
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#fca5a5', margin: 0 }}>
            Internet down? App crashed? Use this script. Have the pre-recorded video link ready.
          </p>
        </div>

        {/* The Script */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', marginBottom: '1rem' }}>
            📜 What to Say (If Tech Fails)
          </h2>
          <div style={{
            backgroundColor: 'rgba(30,41,59,0.8)',
            border: '2px solid rgba(239,68,68,0.3)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            lineHeight: 1.8,
          }}>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#fecaca', margin: '0 0 1rem' }}>
              START HERE:
            </p>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', margin: '0 0 1.5rem' }}>
              "We've got a connectivity hiccup, so let me walk you through what you'd see:"
            </p>

            <div style={{ backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: '0 0 0.75rem', fontWeight: 700 }}>
                💬 NISSAN speaks:
              </p>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: 0, lineHeight: 1.7 }}>
                "A student logs in, types 'Photosynthesis'. They get offered five formats: Game, Story, Meme, Puzzle, Film. Let's say they pick Game. The AI generates a gamified story where they make choices, and each choice is a learning moment."
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: '0 0 0.75rem', fontWeight: 700 }}>
                💬 ANUSHA speaks:
              </p>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: 0, lineHeight: 1.7 }}>
                "Now here's the pedagogy: the AI doesn't tell them if they're right or wrong. It asks: 'What do you think happens when you increase the CO2? Why?' This Socratic loop forces the student to think, not memorize. And they can be wrong. No shame, just learning."
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: '0 0 0.75rem', fontWeight: 700 }}>
                💬 NISSAN speaks (Teacher side):
              </p>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: 0, lineHeight: 1.7 }}>
                "On the teacher side, they see a heatmap. Topics on the Y-axis, formats on the X-axis. Each cell is engagement: green means students are loving that format for that topic, red means we need to pivot. No individual data, no tracking — just patterns."
              </p>
            </div>


            <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '0.5rem', padding: '1rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: '0 0 0.75rem', fontWeight: 700 }}>
                ✨ CLOSING (ANUSHA):
              </p>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: 0, lineHeight: 1.7 }}>
                "The big idea: a student in Bourke gets the same AI tutor as a student in Bondi. This closes the three-year equity gap we see in remote NSW. And we prove it works in v2 with collaborative study rooms — students teaching each other, with AI in the background."
              </p>
            </div>
          </div>
        </section>

        {/* Video link */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e', marginBottom: '1rem' }}>
            🎬 Pre-Recorded Backup Video
          </h2>
          <div style={{
            backgroundColor: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0 0 1rem', lineHeight: 1.6 }}>
              If internet is completely down, play this video (2:30 demo walkthrough):
            </p>
            <code style={{
              display: 'block',
              backgroundColor: 'rgba(30,41,59,0.8)',
              border: '1px solid rgba(148,163,184,0.1)',
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem',
              color: '#f59e0b',
              fontSize: '0.85rem',
              wordBreak: 'break-all',
              margin: '1rem 0',
            }}>
              https://youtu.be/[PLACEHOLDER-BACKUP-VIDEO-ID]
            </code>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
              (Video shows: login → topic input → format selection → Socratic loop → teacher heatmap → closing)
            </p>
          </div>
        </section>

        {/* Talking points */}
        <section style={{
          backgroundColor: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#6366f1', marginBottom: '1rem', margin: '0 0 1rem' }}>
            💡 Key Talking Points (If Reading Script)
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              'Student choice (format) = 40% better retention (Laurillard)',
              'Socratic loop = no "fail states", just learning',
              'Teacher sees class patterns, not individual kids',
              'Curriculum-native (AC v9), not ChatGPT tutoring',
              'Built in 7 days. Pilot T2 2026.',
            ].map((point, i) => (
              <li key={i} style={{
                fontSize: '0.9rem',
                color: '#cbd5e1',
                paddingLeft: '1.5rem',
                position: 'relative',
                lineHeight: 1.6,
              }}>
                <span style={{ position: 'absolute', left: 0, color: '#6366f1' }}>›</span>
                {point}
              </li>
            ))}
          </ul>
        </section>

        {/* Recovery footer */}
        <div style={{
          borderTop: '1px solid rgba(148,163,184,0.1)',
          paddingTop: '1.5rem',
          marginTop: '2rem',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>
            After the backup script, offer: "Let's jump on a quick call — I can show you live in 10 minutes." Have your laptop on phone tether ready.
          </p>
        </div>
      </div>
    </div>
  )
}
