'use client'

export default function ValueProp() {
  const studentOutcomes = [
    { icon: '📚', title: 'Active Learning', detail: 'Retrieval practice is 50% more effective than re-reading' },
    { icon: '🧠', title: 'Metacognition', detail: 'Students think about their own thinking — proven to improve retention' },
    { icon: '💪', title: 'Desirable Difficulty', detail: 'Challenging retrieval improves long-term memory (Bjork, 1994)' },
    { icon: '📈', title: 'Bloom\'s Progression', detail: 'Every AI prompt pushes students past "Remember" into "Analyse & Evaluate"' },
  ]

  const schoolValue = [
    { metric: 'Retention', current: '40%', with: '65% (target)', lift: 'Goal: +25%' },
    { metric: 'Teacher Time', current: '8h/week', with: '3h/week (target)', lift: 'Goal: -5h/week' },
    { metric: 'Equity', current: 'Gap grows', with: 'Gap closes (target)', lift: 'Goal: measurable reduction' },
    { metric: 'PII Risk', current: 'High (LMS)', with: 'Zero', lift: 'Design objective' },
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
            Why QuestLearn
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>
            Built for teachers, scaled by students, owned by schools
          </p>
        </div>

        {/* Teacher-First Design */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', marginBottom: '1rem' }}>
            👩‍🏫 Built for Teachers First
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { icon: '👁️', label: 'Real-time visibility', desc: 'Topic × format engagement heatmap — not surveillance, just patterns' },
              { icon: '⏱️', label: 'Saves 5h/week', desc: 'No marking essays or quizzes. AI provides formative feedback.' },
              { icon: '🔒', label: 'Privacy by design', desc: 'Zero student names, IDs, or individual data in the dashboard' },
              { icon: '✨', label: 'Respects pedagogy', desc: 'Socratic method, not ChatGPT tutoring. Questions, not answers.' },
            ].map((item, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.25rem' }}>
                  {item.label}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Student Outcomes */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e', marginBottom: '1rem' }}>
            🎓 Student Outcomes (Evidence-Based)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {studentOutcomes.map((outcome, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{outcome.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#22c55e', marginBottom: '0.25rem' }}>
                  {outcome.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                  {outcome.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* School ROI */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '1rem' }}>
            💰 School ROI — What Improves
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem',
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(245,158,11,0.3)' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>Metric</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Without QuestLearn</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: '#22c55e', fontWeight: 600 }}>With QuestLearn</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>Expected Lift (Goal)</th>
                </tr>
              </thead>
              <tbody>
                {schoolValue.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                    <td style={{ padding: '0.75rem', color: '#cbd5e1', fontWeight: 600 }}>{row.metric}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>{row.current}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', color: '#22c55e', fontWeight: 700 }}>{row.with}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', color: '#f59e0b', fontWeight: 700 }}>{row.lift}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
          Note: Retention and teacher-time lift values are expected targets for pilot validation, not yet proven outcomes.
        </p>

        {/* Addressing Concerns */}
        <section style={{
          backgroundColor: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b', marginBottom: '1rem', margin: '0 0 1rem' }}>
            🤔 Common Concerns Addressed
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { q: 'Will AI replace teachers?', a: 'No. QuestLearn is a tutor, not a teacher. Teachers set curriculum, we handle formative practice.' },
              { q: 'Is student data safe?', a: 'Yes. Class aggregates only, zero PII. No individual tracking, no third-party data sales.' },
              { q: 'Does it work for all ability levels?', a: 'Yes. The AI scaffolds up and down. Desirable difficulty adapts to each student.' },
              { q: 'What about offline schools?', a: 'Offline mode coming in v2. Content syncs when connectivity returns.' },
            ].map((item, i) => (
              <div key={i}>
                <p style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 700, margin: '0 0 0.5rem' }}>
                  {item.q}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
