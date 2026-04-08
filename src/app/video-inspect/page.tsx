'use client'
// Video Inspection Page — direct links + inline thumbnails for every showcase video
// Access at /video-inspect

const VIDEOS = [
  {
    slug: 'S1-narrated-v20260408',
    label: 'S1 — Zara Osei (Student)',
    expected: 'Login → Meme (Photosynthesis) → Flashcards → Dashboard',
    frames: [2, 15, 30],
  },
  {
    slug: 'S2-narrated-v20260408',
    label: 'S2 — Kai Nguyen (Student)',
    expected: 'Login → Debate (Newton\'s Laws) → Concept Map → Flashcards',
    frames: [2, 15, 30],
  },
  {
    slug: 'S3-narrated-v20260408',
    label: 'S3 — Priya Sharma (Student)',
    expected: 'Login → Meme (Water Cycle) → Concept Map → Flashcards',
    frames: [2, 15, 30],
  },
  {
    slug: 'T1-narrated-v20260408',
    label: 'T1 — Ms Rachel Chen (Teacher)',
    expected: 'Login → Teacher Dashboard → Heatmap → Quest creation',
    frames: [2, 15, 30],
  },
  {
    slug: 'T2-narrated-v20260408',
    label: 'T2 — Mr David Okafor (Teacher)',
    expected: 'Login → Teacher Dashboard → Heatmap → Quest creation',
    frames: [2, 15, 30],
  },
  {
    slug: 'D-mini-apps-v20260408',
    label: 'D — Mini Apps Demo',
    expected: 'Login (Zara) → /mini landing → Flashcards → Concept Map → Debate → Meme',
    frames: [2, 15, 30, 45],
  },
  {
    slug: 'A-cinematic',
    label: 'A — Cinematic (Full Demo)',
    expected: 'Cinematic showcase cut',
    frames: [2, 15, 30],
  },
  {
    slug: 'B-walkthrough',
    label: 'B — Walkthrough (Full Demo)',
    expected: 'General audience walkthrough',
    frames: [2, 15, 30],
  },
  {
    slug: 'C-explainer',
    label: 'C — Explainer (Technical)',
    expected: 'Technical explainer for judges panel',
    frames: [2, 15, 30],
  },
]

export default function VideoInspectPage() {
  return (
    <div style={{ background: '#0f172a', color: '#e2e8f0', minHeight: '100vh', padding: '2rem', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          🔍 Showcase Video Inspection
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Direct links + frame grabs for every showcase video. Use this to verify the correct content is being served.
        </p>

        {VIDEOS.map((v) => (
          <div
            key={v.slug}
            style={{
              background: 'rgba(30,41,59,0.8)',
              border: '1px solid rgba(148,163,184,0.15)',
              borderRadius: 12,
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{v.label}</h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Expected: <span style={{ color: '#94a3b8' }}>{v.expected}</span>
                </p>
              </div>
              <a
                href={`/showcase/${v.slug}.mp4`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'rgba(245,158,11,0.15)',
                  border: '1px solid rgba(245,158,11,0.4)',
                  color: '#f59e0b',
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                ▶ Open direct video URL
              </a>
            </div>

            {/* Inline player */}
            <video
              src={`/showcase/${v.slug}.mp4`}
              controls
              preload="metadata"
              style={{ width: '100%', maxHeight: 260, background: '#000', borderRadius: 8, marginBottom: '0.75rem' }}
            />

            {/* Frame grabs */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {v.frames.map((t) => (
                <div key={t} style={{ flex: '1 1 180px', minWidth: 160 }}>
                  <p style={{ margin: '0 0 4px', fontSize: '0.7rem', color: '#64748b' }}>t={t}s</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/showcase/inspect/${v.slug}-t${t}.jpg`}
                    alt={`${v.slug} at ${t}s`}
                    style={{ width: '100%', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', display: 'block' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.2' }}
                  />
                </div>
              ))}
            </div>

            {/* Direct URL */}
            <p style={{ margin: '0.75rem 0 0', fontSize: '0.75rem', color: '#475569', wordBreak: 'break-all' }}>
              <span style={{ color: '#64748b' }}>URL: </span>
              <code style={{ color: '#94a3b8' }}>{`https://questlearn-nu.vercel.app/showcase/${v.slug}.mp4`}</code>
            </p>
          </div>
        ))}

        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, fontSize: '0.8rem', color: '#94a3b8' }}>
          <strong style={{ color: '#818cf8' }}>Re-render instructions:</strong> To regenerate a video, update the manifest in{' '}
          <code>overnight-production/manifests/</code>, run <code>node capture-video.mjs --manifest manifests/&lt;name&gt;.json</code>,
          then <code>python3 render-video.py --manifest manifests/&lt;name&gt;.json</code>.
          Bump the version suffix in <code>ShowcaseWindow.tsx</code> const V to bust CDN cache.
        </div>
      </div>
    </div>
  )
}
