import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Student Guide — QuestLearn',
  robots: { index: false, follow: false },
}

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '1rem 1.25rem',
  marginBottom: '0.75rem',
}

const screenshotStyle = {
  width: '100%',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.08)',
  marginTop: '0.75rem',
}

export default function StudentHelpPage() {
  return (
    <div
      style={{
        background: '#0f172a',
        minHeight: '100vh',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ maxWidth: '52rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.5rem' }}>
          Student Guide (Current App Version)
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '0.92rem', marginBottom: '1.75rem' }}>
          Updated for the latest QuestLearn flow with native formats: Meme, Flashcards, Concept Map, and Debate.
        </p>

        <div
          style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.22)',
            borderRadius: '12px',
            padding: '1rem 1.1rem',
            marginBottom: '2rem',
          }}
        >
          <p style={{ margin: 0, lineHeight: 1.65, color: 'rgba(255,255,255,0.9)', fontSize: '0.92rem' }}>
            <strong style={{ color: '#f59e0b' }}>Important:</strong> The separate “Mini Apps” folder is now marked
            <strong> Coming Soon</strong>. For now, students should use the direct native experiences inside QuestLearn.
          </p>
        </div>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.75rem' }}>1) Start a Quest</h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.86)' }}>
            Open QuestLearn, enter your topic, and pick how you want to learn it. The app is built for active learning,
            not passive reading.
          </p>
          <img src="/guides/student-guide-format-picker.png" alt="QuestLearn topic and format selection" style={screenshotStyle} />
        </section>

        <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '2rem 0' }} />

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b', marginBottom: '1rem' }}>2) Use the Four Core Learning Modes</h2>

          <div style={cardStyle}>
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.7 }}>
              <strong style={{ color: '#f59e0b' }}>😂 Meme:</strong> Turn the concept into compressed humour. If you can explain it
              simply and sharply, you understand it.
            </p>
            <img src="/guides/student-guide-meme.png" alt="Meme mode in QuestLearn" style={screenshotStyle} />
          </div>

          <div style={cardStyle}>
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.7 }}>
              <strong style={{ color: '#f59e0b' }}>🃏 Flashcards:</strong> Practice retrieval quickly, build confidence, and repeat weak spots.
              This is for memory strength and speed.
            </p>
            <img src="/guides/student-guide-format-picker.png" alt="Flashcards mode available in format selector" style={screenshotStyle} />
          </div>

          <div style={cardStyle}>
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.7 }}>
              <strong style={{ color: '#f59e0b' }}>🗺️ Concept Map:</strong> Build links between ideas and test whether your understanding is
              structural, not just memorised.
            </p>
            <img src="/guides/student-guide-concept-map.png" alt="Concept Map mode in QuestLearn" style={screenshotStyle} />
          </div>

          <div style={cardStyle}>
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.7 }}>
              <strong style={{ color: '#f59e0b' }}>⚖️ Debate:</strong> Argue a position, defend it, and refine your reasoning under pressure.
              This pushes deeper understanding.
            </p>
            <img src="/guides/student-guide-debate.png" alt="Debate mode in QuestLearn" style={screenshotStyle} />
          </div>
        </section>

        <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '2rem 0' }} />

        <section style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.75rem' }}>3) How to Get Better Results</h2>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.86)', fontSize: '0.95rem' }}>
            <li>Choose specific topics (not broad chapters).</li>
            <li>Switch modes for the same topic to strengthen understanding.</li>
            <li>Treat mistakes as signal, not failure.</li>
            <li>Use confidence checks honestly so teachers can adapt support.</li>
          </ul>
        </section>

        <div
          style={{
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.22)',
            borderRadius: '12px',
            padding: '1rem 1.1rem',
            marginTop: '2rem',
          }}
        >
          <p style={{ margin: 0, lineHeight: 1.65, color: 'rgba(255,255,255,0.9)', fontSize: '0.93rem' }}>
            Learning sticks when you work for it. QuestLearn is designed to make that effort meaningful.
          </p>
        </div>
      </div>
    </div>
  )
}
