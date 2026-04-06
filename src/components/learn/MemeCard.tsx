'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { MemeTemplate } from '@/lib/meme-templates';

interface MemeCardProps {
  topText: string;
  bottomText: string;
  template: MemeTemplate | null;
  topic: string;
  isLoading?: boolean;
  imageUrl?: string;
}

export function MemeCard({ topText, bottomText, template, topic, isLoading, imageUrl }: MemeCardProps) {
  const [copied, setCopied] = useState(false);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const memeTextStyle: React.CSSProperties = {
    fontFamily: "'Impact', 'Arial Black', sans-serif",
    textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
    letterSpacing: '0.03em',
  };

  if (isLoading) {
    return (
      <div className="relative w-full aspect-square bg-gray-800 rounded-xl flex items-center justify-center animate-pulse">
        <span className="text-white text-sm opacity-60">Loading meme…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full rounded-xl overflow-hidden bg-gray-900 shadow-2xl" style={{ maxHeight: '280px', aspectRatio: '1/1' }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Meme about ${topic}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : template ? (
          <img
            src={template.file}
            alt={`${template.name} — meme about ${topic}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950" />
        )}
        {/* Top text */}
        <div className="absolute top-3 left-0 right-0 px-4 text-center">
          <p className="text-white text-xl font-black uppercase leading-tight" style={memeTextStyle}>
            {topText}
          </p>
        </div>
        {/* Bottom text */}
        <div className="absolute bottom-3 left-0 right-0 px-4 text-center">
          <p className="text-white text-xl font-black uppercase leading-tight" style={memeTextStyle}>
            {bottomText}
          </p>
        </div>
      </div>
      {(template || imageUrl) && (
        <Button variant="outline" size="sm" onClick={handleShare}>
          {copied ? '✅ Copied!' : '🔗 Share meme'}
        </Button>
      )}
    </div>
  );
}
