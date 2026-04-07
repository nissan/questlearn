import type { CSSProperties } from 'react';

export default function PitchBackupPackagePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <h1 style={{ marginTop: 0, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>Pitch Backup Package · 2026-04-08</h1>
        <p style={{ color: 'rgba(226,232,240,0.78)', lineHeight: 1.7 }}>
          Take-based package prepared for Demo Day technical backup, with replaceable scene takes and stitched final cut.
        </p>

        <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1.2rem' }}>
          <a href="/showcase/questlearn-pitch-backup-2026-04-08.mp4" style={linkStyle}>▶ Final backup cut (MP4)</a>
          <a href="/pitch-backup/2026-04-08/TAKE-SHEET.md" style={linkStyle}>🧾 Take sheet (Markdown)</a>
          <a href="/pitch-backup/2026-04-08/takes_manifest.json" style={linkStyle}>🧩 Takes manifest (JSON)</a>
          <a href="/pitch/v2-social-engagement" style={linkStyle}>📊 Deck used for capture (v2-social-engagement)</a>
          <a href="/pitch" style={linkStyle}>← Back to Pitch Folder</a>
        </div>

        <p style={{ marginTop: '1.2rem', color: 'rgba(226,232,240,0.62)' }}>
          Note: This package is designed so any single take can be replaced without re-recording the full demo.
        </p>
      </div>
    </main>
  );
}

const linkStyle: CSSProperties = {
  display: 'inline-block',
  color: '#f59e0b',
  textDecoration: 'none',
  border: '1px solid rgba(245,158,11,0.35)',
  borderRadius: '0.6rem',
  padding: '0.7rem 0.9rem',
  background: 'rgba(15,23,42,0.6)',
  fontWeight: 600,
};
