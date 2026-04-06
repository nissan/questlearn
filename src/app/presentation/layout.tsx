import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QuestLearn — Presentation',
  description: 'EduX Hackathon 2026 — Socratic dialogue powered by AI',
}

export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
