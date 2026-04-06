import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QuestLearn — Demo',
  description: 'Watch QuestLearn in action',
}

export default function DemoLayout({
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
