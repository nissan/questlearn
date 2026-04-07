'use client';

import { useEffect, useMemo, useState } from 'react';
import { MemeCard } from '@/components/learn/MemeCard';
import { pickMemeTemplate } from '@/lib/pick-meme-template';

function parseMemeBody(body: string) {
  const topMatch = body.match(/^TOP:\s*(.+)/im);
  const bottomMatch = body.match(/^BOTTOM:\s*(.+)/im);
  return {
    topText: topMatch?.[1]?.trim() ?? 'Did you know...',
    bottomText: bottomMatch?.[1]?.trim() ?? '...it was actually this simple.',
  };
}

export function MemeStandaloneClient({ topic }: { topic: string }) {
  const [loading, setLoading] = useState(true);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const fallbackBody = useMemo(
    () => `TOP: ${topic} when the sunlight hits\nBOTTOM: Time to turn light into learning`,
    [topic]
  );

  useEffect(() => {
    let mounted = true;

    async function loadMeme() {
      setLoading(true);
      try {
        const res = await fetch('/api/generate/meme-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic }),
        });

        if (!res.ok) throw new Error('Failed meme API');
        const data = await res.json();

        if (!mounted) return;
        if (data.topText && data.bottomText) {
          setTopText(data.topText);
          setBottomText(data.bottomText);
          setImageUrl(data.imageUrl ?? null);
          return;
        }

        throw new Error('Missing fields');
      } catch {
        if (!mounted) return;
        const parsed = parseMemeBody(fallbackBody);
        setTopText(parsed.topText);
        setBottomText(parsed.bottomText);
        setImageUrl(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMeme();
    return () => {
      mounted = false;
    };
  }, [topic, fallbackBody]);

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 text-xs text-muted-foreground uppercase tracking-wide">Standalone Mini App</div>
        <h1 className="text-xl font-semibold mb-4">Meme · {topic}</h1>
        <div className="rounded-xl border bg-card overflow-hidden p-4">
          <MemeCard
            topText={topText}
            bottomText={bottomText}
            template={pickMemeTemplate(topic, topText, bottomText)}
            topic={topic}
            isLoading={loading}
            imageUrl={imageUrl ?? undefined}
          />
        </div>
      </div>
    </main>
  );
}
