'use client'

export default function JudgeCheatSheet() {
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
      <article style={{ maxWidth: '850px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid rgba(245,158,11,0.3)', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 0.5rem', color: '#f1f5f9' }}>
            The QuestLearn Story
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>
            One-page reference for judges, investors, and educators
          </p>
        </div>

        {/* The Problem */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.75rem' }}>
            🔴 The Problem
          </h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#cbd5e1', marginBottom: '0.5rem' }}>
            Remote Australian students are <strong>3 years behind</strong> their city peers by Year 9. With 60% teacher turnover in remote NSW and 50% of Aboriginal communities lacking mobile coverage, traditional tutoring is impossible at scale.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
            <strong>The gap:</strong> <em>"Bourke meets Bondi, but not on the same page."</em>
          </p>
        </section>

        {/* The Solution */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e', marginBottom: '0.75rem' }}>
            ✅ The Solution
          </h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#cbd5e1' }}>
            <strong>QuestLearn</strong> is an AI-powered adaptive learning platform where students pick their own learning format (Game, Story, Meme, Puzzle, Film) for any topic. The AI asks Socratic questions, never gives answers. Teachers see class engagement patterns in real time — zero surveillance, zero PII.
          </p>
        </section>

        {/* Differentiators */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>
            ⭐ Differentiators
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              '📚 <strong>Format choice, not assignment:</strong> Students learn in the format they prefer — proven 40% better retention',
              '🧠 <strong>Socratic loop, not answers:</strong> AI teaches through questioning (Bloom\'s Taxonomy Levels 3–5)',
              '🔒 <strong>Privacy first:</strong> Class aggregates only, zero individual tracking',
              '🎓 <strong>Curriculum-native:</strong> CurricuLLM-AU — Australian Curriculum v9 built-in',
              '🚀 <strong>Zero barriers:</strong> Works on any device, any connectivity (offline mode coming)',
              '💬 <strong>Teacher-first design:</strong> Engagement heatmap replaces grade books',
            ].map((item, i) => (
              <li key={i} style={{
                fontSize: '0.9rem',
                color: '#cbd5e1',
                lineHeight: 1.6,
                paddingLeft: '1.5rem',
                position: 'relative',
              }} dangerouslySetInnerHTML={{
                __html: `<span style="position: absolute; left: 0; color: #f59e0b;">›</span>${item}`
              }} />
            ))}
          </ul>
        </section>

        {/* The Team */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ec4899', marginBottom: '0.75rem' }}>
            👥 The Team
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(30,41,59,0.8)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.5rem', padding: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700, margin: '0 0 0.25rem', textTransform: 'uppercase' }}>Nissan</p>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                Tech lead. Full-stack. Built QuestLearn in 7 days. Next.js + Cogniti + CurricuLLM-AU.
              </p>
            </div>
            <div style={{ backgroundColor: 'rgba(30,41,59,0.8)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.5rem', padding: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700, margin: '0 0 0.25rem', textTransform: 'uppercase' }}>Anusha</p>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                Learning designer. Socratic pedagogy. BDD spec. v2 vision (Study Rooms, Quiz Rooms).
              </p>
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', marginBottom: '0.75rem' }}>
            📊 Key Stats
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { value: '57', label: 'Playwright E2E tests ✅' },
              { value: '5', label: 'AI learning formats' },
              { value: '1', label: 'Dashboard heatmap view' },
              { value: '7', label: 'Days built (hackathon)' },
            ].map((stat, i) => (
              <div key={i} style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f59e0b', marginBottom: '0.25rem' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Next Steps */}
        <section style={{ marginBottom: '2.5rem', backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e', marginBottom: '0.75rem', margin: '0 0 0.75rem' }}>
            🚀 Next Steps
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              'v1 live: Student learning + teacher heatmap',
              'v2 in dev: Study Rooms, Quiz Rooms (collaborative)',
              'v3 vision: Cross-school matching, regional equity analytics',
            ].map((item, i) => (
              <li key={i} style={{
                fontSize: '0.9rem',
                color: '#cbd5e1',
                paddingLeft: '1.5rem',
                position: 'relative',
              }}>
                <span style={{ position: 'absolute', left: 0, color: '#22c55e' }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Links */}
        <section style={{ borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            🌐 <code style={{ backgroundColor: 'rgba(30,41,59,0.8)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', color: '#f59e0b' }}>questlearn-nu.vercel.app</code> · ⬡ <code style={{ backgroundColor: 'rgba(30,41,59,0.8)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', color: '#94a3b8' }}>github.com/reddinft/questlearn</code>
          </p>
        </section>
      </article>
    </div>
  )
}
