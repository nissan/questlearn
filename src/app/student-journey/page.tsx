'use client'

export default function StudentJourney() {
  const journey = [
    {
      step: 1,
      title: 'Topic Input',
      icon: '🎯',
      description: 'Student types what they\'re stuck on: "Photosynthesis", "Fractions", "WW1 causes"',
      bloom: 'Remember',
    },
    {
      step: 2,
      title: 'Format Selection',
      icon: '🎨',
      description: 'Student picks their learning format: Game, Story, Meme, Puzzle, or Film',
      bloom: 'Understand',
    },
    {
      step: 3,
      title: 'AI Generation',
      icon: '⚡',
      description: 'CurricuLLM-AU generates curriculum-aligned content in the chosen format',
      bloom: 'Understand',
    },
    {
      step: 4,
      title: 'Socratic Loop',
      icon: '💬',
      description: 'Student interacts with AI tutor. AI asks questions, never gives answers.',
      bloom: 'Apply',
    },
    {
      step: 5,
      title: 'Reflection',
      icon: '🔍',
      description: 'Student rates their confidence (1-3). AI provides formative feedback.',
      bloom: 'Analyse',
    },
    {
      step: 6,
      title: 'Mastery',
      icon: '⭐',
      description: 'Student progresses or tries another format. No pass/fail, just learning.',
      bloom: 'Evaluate',
    },
  ]

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
            The Student Journey
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>
            From topic input to mastery, aligned with Bloom's Taxonomy
          </p>
        </div>

        {/* Journey flow */}
        <div style={{ marginBottom: '3rem' }}>
          {journey.map((item, idx) => (
            <div key={idx}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr',
                gap: '1.5rem',
                marginBottom: idx < journey.length - 1 ? '2rem' : 0,
                alignItems: 'start',
              }}>
                {/* Step circle */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(245,158,11,0.15)',
                    border: '2px solid rgba(245,158,11,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}>
                    {item.icon}
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#f59e0b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Step {item.step}
                  </span>
                </div>

                {/* Content */}
                <div style={{
                  backgroundColor: 'rgba(30,41,59,0.8)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  paddingTop: '1rem',
                }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 0.5rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0 0 0.75rem', lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(99,102,241,0.15)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: '0.35rem',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    color: '#6366f1',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}>
                    Bloom's: {item.bloom}
                  </div>
                </div>
              </div>

              {/* Connector line */}
              {idx < journey.length - 1 && (
                <div style={{
                  marginLeft: '29px',
                  marginBottom: '2rem',
                  width: '2px',
                  height: '1rem',
                  background: 'linear-gradient(to bottom, rgba(245,158,11,0.4), transparent)',
                }}/>
              )}
            </div>
          ))}
        </div>

        {/* Bloom's Taxonomy reference */}
        <section style={{
          backgroundColor: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#6366f1', marginBottom: '1rem', margin: '0 0 1rem' }}>
            📐 Bloom's Taxonomy Alignment
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '1rem', lineHeight: 1.6 }}>
            QuestLearn intentionally scaffolds students through Bloom's levels. Each step in the journey pushes deeper:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              '<strong>Remember</strong> — Topic input: "What am I trying to learn?"',
              '<strong>Understand</strong> — Format choice + initial content generation: "How do I want to learn it?"',
              '<strong>Apply</strong> — Socratic interaction: "Can I use this knowledge?"',
              '<strong>Analyse</strong> — Reflection: "Why does this work? What am I missing?"',
              '<strong>Evaluate</strong> — Choosing next steps: "Is there a better format? Have I mastered this?"',
            ].map((item, i) => (
              <li key={i} style={{
                fontSize: '0.85rem',
                color: '#cbd5e1',
                paddingLeft: '1.5rem',
                position: 'relative',
                lineHeight: 1.6,
              }}>
                <span style={{ position: 'absolute', left: 0, color: '#6366f1' }}>›</span>
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        </section>

        {/* Key insight */}
        <section style={{
          backgroundColor: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginTop: '1.5rem',
        }}>
          <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>
            <span style={{ color: '#22c55e', fontWeight: 700 }}>🔑 Key Insight:</span> The journey is never linear. A student might try Puzzle, realize Story works better, then move to Film. The AI recommends, but the student chooses. This autonomy drives engagement and deepens metacognition.
          </p>
        </section>
      </div>
    </div>
  )
}
