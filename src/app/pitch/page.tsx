'use client';

const decks = [
  {
    id: 'v1',
    title: 'Version 1 · Core Hackathon Deck',
    subtitle: 'Current baseline deck used in app',
    href: '/pitch/v1',
    duration: '4-5 min',
    tone: 'Balanced product + impact',
    badge: 'Baseline',
    color: '#f59e0b',
  },
  {
    id: 'v2-social-engagement',
    title: 'Version 2 · Social Engagement Story',
    subtitle: 'Anusha narrative: attention, interactivity, teacher loop, future scope',
    href: '/pitch/v2-social-engagement',
    duration: '3-4 min',
    tone: 'Student engagement first',
    badge: 'New',
    color: '#22c55e',
  },
  {
    id: 'v3-backup-package',
    title: 'Version 3 · Demo-Day Backup Package',
    subtitle: 'Take-based 4–6 min narration pack + final stitched backup cut for technical fallback',
    href: '/pitch/v3-backup-package',
    duration: '4-6 min',
    tone: 'Technical backup / exhibition safe',
    badge: 'Backup',
    color: '#38bdf8',
  },
];

export default function PitchDeckFolder() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
        color: '#e2e8f0',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
        padding: '2.5rem 1.25rem',
      }}
    >
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              color: '#f59e0b',
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            Pitch Deck Folder
          </div>
          <h1 style={{ margin: 0, fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', lineHeight: 1.2 }}>
            Choose a presentation version
          </h1>
          <p style={{ color: 'rgba(226,232,240,0.7)', maxWidth: 760, lineHeight: 1.7 }}>
            Keep the original deck intact, rehearse different storytelling angles, and pick the best version before final cut.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {decks.map((deck) => (
            <a
              key={deck.id}
              href={deck.href}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                background: 'rgba(15,23,42,0.75)',
                border: '1px solid rgba(148,163,184,0.2)',
                borderLeft: `4px solid ${deck.color}`,
                borderRadius: '0.8rem',
                padding: '1rem 1rem 1.1rem',
                display: 'block',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.78rem', color: deck.color, fontWeight: 700, letterSpacing: '0.05em' }}>{deck.badge}</span>
                <span style={{ color: 'rgba(148,163,184,0.85)', fontSize: '0.78rem' }}>{deck.duration}</span>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.45rem' }}>{deck.title}</div>
              <div style={{ color: 'rgba(203,213,225,0.85)', fontSize: '0.9rem', marginBottom: '0.55rem', lineHeight: 1.5 }}>{deck.subtitle}</div>
              <div style={{ color: 'rgba(148,163,184,0.85)', fontSize: '0.82rem' }}>Tone: {deck.tone}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
