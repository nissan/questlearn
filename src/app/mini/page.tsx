export default function MiniAppsIndexPage() {
  const links = [
    { href: '/mini/flashcards?topic=Photosynthesis', label: 'Flashcards' },
    { href: '/mini/concept-map?topic=Photosynthesis', label: 'Concept Map' },
    { href: '/mini/debate?topic=Photosynthesis', label: 'Debate' },
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', padding: '2rem 1rem', fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <h1 style={{ marginTop: 0 }}>Mini Apps Standalone Paths</h1>
        <p style={{ color: 'rgba(226,232,240,0.75)' }}>Use these direct routes for isolated testing and debugging outside the desktop shell.</p>
        <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} style={{ color: '#f59e0b', textDecoration: 'none', border: '1px solid rgba(148,163,184,0.25)', borderRadius: '0.6rem', padding: '0.8rem 1rem', background: 'rgba(15,23,42,0.72)' }}>
              {l.label} → <span style={{ color: '#94a3b8' }}>{l.href}</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
