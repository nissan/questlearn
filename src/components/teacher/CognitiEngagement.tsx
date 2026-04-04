'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TopTopic {
  topic: string
  cardFlips: number
  sessions: number
}

interface ConfidenceEntry {
  topic: string
  avgRating: number
}

interface AccuracyEntry {
  topic: string
  correctCount: number
  totalCount: number
  pct: number
}

interface TelemetryData {
  topTopics: TopTopic[]
  avgConfidence: ConfidenceEntry[]
  answerAccuracy: AccuracyEntry[]
  fetchedAt: string
}

function ConfidenceDot({ rating }: { rating: number }) {
  const colour =
    rating < 1.5 ? 'bg-red-500' :
    rating < 2.5 ? 'bg-yellow-400' :
    'bg-green-500'
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colour} mr-2`} />
}

export function CognitiEngagement() {
  const [data, setData] = useState<TelemetryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/cogniti/telemetry')
      .then(r => {
        if (!r.ok) throw new Error('fetch failed')
        return r.json()
      })
      .then((d: TelemetryData) => { setData(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  if (loading) {
    return <p className="text-sm text-muted-foreground animate-pulse">Loading flashcard engagement…</p>
  }

  const hasData = data && (data.topTopics.length > 0 || data.avgConfidence.length > 0 || data.answerAccuracy.length > 0)

  if (error || !hasData) {
    return (
      <p className="text-sm text-muted-foreground">
        No flashcard activity yet — encourage students to try the Flashcards format!
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Top Topics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Top Topics</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topTopics.length === 0 ? (
            <p className="text-xs text-muted-foreground">No data</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left font-medium text-muted-foreground pb-2">Topic</th>
                  <th className="text-right font-medium text-muted-foreground pb-2">Flips</th>
                </tr>
              </thead>
              <tbody>
                {data.topTopics.map(t => (
                  <tr key={t.topic}>
                    <td className="py-1 truncate max-w-[120px]">{t.topic}</td>
                    <td className="py-1 text-right font-mono">{t.cardFlips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Avg Confidence */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Avg Confidence</CardTitle>
        </CardHeader>
        <CardContent>
          {data.avgConfidence.length === 0 ? (
            <p className="text-xs text-muted-foreground">No data</p>
          ) : (
            <ul className="space-y-1.5">
              {data.avgConfidence.map(c => (
                <li key={c.topic} className="flex items-center text-xs">
                  <ConfidenceDot rating={c.avgRating} />
                  <span className="flex-1 truncate">{c.topic}</span>
                  <span className="font-mono ml-2">{c.avgRating.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Answer Accuracy */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Answer Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          {data.answerAccuracy.length === 0 ? (
            <p className="text-xs text-muted-foreground">No data</p>
          ) : (
            <ul className="space-y-1.5">
              {data.answerAccuracy.map(a => (
                <li key={a.topic} className="flex items-center text-xs gap-1">
                  {a.pct < 50 && <span title="Low accuracy">⚠️</span>}
                  <span className="flex-1 truncate">{a.topic}</span>
                  <span className="font-mono">{a.pct}%</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
