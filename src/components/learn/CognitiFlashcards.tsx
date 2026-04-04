'use client'
import { useState } from 'react'

const COGNITI_URL = process.env.NEXT_PUBLIC_COGNITI_MINIAPP_URL ??
  'https://app.cogniti.ai/interactives/69d0575fbd12b7d70d8c1a2d/run'

export function CognitiFlashcards({ topic }: { topic: string }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const src = `${COGNITI_URL}?topic=${encodeURIComponent(topic)}`

  // postMessage context to Cogniti once iframe loads
  const handleLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    setLoaded(true)
    try {
      e.currentTarget.contentWindow?.postMessage(
        { type: 'cogniti:context', topic },
        'https://app.cogniti.ai'
      )
    } catch {}
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cogniti Flashcards</span>
        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">AI-Powered</span>
      </div>
      {!loaded && !error && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground animate-pulse">Loading flashcards…</p>
        </div>
      )}
      {error && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <p className="text-sm text-muted-foreground">Couldn&apos;t load flashcards.</p>
          <button onClick={() => setError(false)} className="text-xs underline">Retry</button>
        </div>
      )}
      <iframe
        src={src}
        title="Cogniti Flashcards"
        allow="microphone"
        className={`flex-1 w-full border-0 ${loaded ? 'block' : 'hidden'}`}
        onLoad={handleLoad}
        onError={() => setError(true)}
      />
    </div>
  )
}
