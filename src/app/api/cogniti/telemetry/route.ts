import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

const COGNITI_TOKEN = process.env.COGNITI_API_TOKEN
const MINI_APP_ID = process.env.COGNITI_MINIAPP_ID ?? '69d0575fbd12b7d70d8c1a2d'

export async function GET(req: NextRequest) {
  void req
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!COGNITI_TOKEN) {
    // Return empty data gracefully if token not configured
    return NextResponse.json({ topTopics: [], avgConfidence: [], answerAccuracy: [], fetchedAt: new Date().toISOString() })
  }

  try {
    const res = await fetch(
      `https://app.cogniti.ai/api/v1/interactives/${MINI_APP_ID}/telemetry/`,
      { headers: { Authorization: `Bearer ${COGNITI_TOKEN}` }, next: { revalidate: 0 } }
    )
    if (!res.ok) throw new Error(`Cogniti ${res.status}`)
    const raw = await res.json()

    // Aggregate raw events
    const byTopic: Record<string, { flips: number; sessions: Set<string>; confidence: number[]; correct: number; total: number }> = {}

    for (const event of (raw.results ?? raw ?? [])) {
      const topic = event.data?.topic ?? 'Unknown'
      if (!byTopic[topic]) byTopic[topic] = { flips: 0, sessions: new Set(), confidence: [], correct: 0, total: 0 }
      const t = byTopic[topic]
      if (event.event_name === 'card_flipped') { t.flips++; if (event.session_id) t.sessions.add(event.session_id) }
      if (event.event_name === 'confidence_rated') t.confidence.push(Number(event.data?.rating ?? 0))
      if (event.event_name === 'answer_submitted') {
        t.total++
        if (event.data?.correct) t.correct++
      }
    }

    const topTopics = Object.entries(byTopic)
      .map(([topic, d]) => ({ topic, cardFlips: d.flips, sessions: d.sessions.size }))
      .sort((a, b) => b.cardFlips - a.cardFlips).slice(0, 10)

    const avgConfidence = Object.entries(byTopic)
      .filter(([, d]) => d.confidence.length > 0)
      .map(([topic, d]) => ({ topic, avgRating: Math.round(d.confidence.reduce((a, b) => a + b, 0) / d.confidence.length * 10) / 10 }))

    const answerAccuracy = Object.entries(byTopic)
      .filter(([, d]) => d.total > 0)
      .map(([topic, d]) => ({ topic, correctCount: d.correct, totalCount: d.total, pct: Math.round(d.correct / d.total * 100) }))
      .sort((a, b) => a.pct - b.pct)

    return NextResponse.json({ topTopics, avgConfidence, answerAccuracy, fetchedAt: new Date().toISOString() })
  } catch {
    return NextResponse.json({ error: 'Cogniti API unavailable' }, { status: 503 })
  }
}
