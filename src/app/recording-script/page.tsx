import Link from 'next/link'

const items = [
  { video: 'A-cinematic', manifest: '01-cinematic.json' },
  { video: 'B-walkthrough', manifest: '02-walkthrough.json' },
  { video: 'C-explainer', manifest: '03-explainer.json' },
  { video: 'D-mini-apps', manifest: '04-mini-apps.json' },
  { video: 'S1-narrated', manifest: 'S1-zara.json' },
  { video: 'S2-narrated', manifest: 'S2-kai.json' },
  { video: 'S3-narrated', manifest: 'S3-priya.json' },
  { video: 'T1-narrated', manifest: 'T1-rachel.json' },
  { video: 'T2-narrated', manifest: 'T2-david.json' },
]

export default function RecordingScriptPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', padding: '2rem' }}>
      <div style={{ maxWidth: 920, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Showcase Re-record Script</h1>
        <p style={{ color: '#94a3b8', marginBottom: '1.25rem' }}>
          Use this to regenerate showcase recordings or run a live demo with the same flow.
        </p>

        <div style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <p style={{ margin: 0, marginBottom: 8, color: '#fbbf24', fontWeight: 700 }}>Re-record command</p>
          <pre style={{ margin: 0, fontSize: 13, whiteSpace: 'pre-wrap' }}>{`cd overnight-production\nCAPTURE_BASE_URL="https://questlearn-nu.vercel.app" bash produce_all_v3.sh`}</pre>
        </div>

        <div style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <p style={{ margin: 0, marginBottom: 10, color: '#fbbf24', fontWeight: 700 }}>Manifest map</p>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {items.map((item) => (
              <li key={item.video} style={{ marginBottom: 6 }}>
                <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{item.video}</span>
                <span style={{ color: '#94a3b8' }}> → overnight-production/manifests/{item.manifest}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/demo-script" style={{ color: '#fbbf24', textDecoration: 'none', border: '1px solid rgba(251,191,36,0.4)', borderRadius: 8, padding: '8px 12px' }}>
            Open live demo script
          </Link>
          <Link href="/backup-demo" style={{ color: '#93c5fd', textDecoration: 'none', border: '1px solid rgba(147,197,253,0.4)', borderRadius: 8, padding: '8px 12px' }}>
            Open backup demo script
          </Link>
          <Link href="/showcase" style={{ color: '#cbd5e1', textDecoration: 'none', border: '1px solid rgba(203,213,225,0.3)', borderRadius: 8, padding: '8px 12px' }}>
            Back to showcase
          </Link>
        </div>
      </div>
    </div>
  )
}
