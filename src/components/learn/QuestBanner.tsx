'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FORMATS } from '@/lib/formats';

interface Quest {
  id: string;
  teacher_name: string;
  topic: string;
  format: string;
  message: string | null;
}

const FORMAT_MAP = Object.fromEntries(FORMATS.map(f => [f.id, f]));

export function QuestBanner() {
  const [quest, setQuest] = useState<Quest | null>(null);
  const router = useRouter();

  useEffect(() => {
    let yearLevel = '';
    try {
      const stored = localStorage.getItem('lumina_user');
      if (stored) {
        const parsed = JSON.parse(stored) as { year_level?: string };
        yearLevel = parsed.year_level ?? '';
      }
    } catch { /* ignore */ }
    const url = yearLevel
      ? `/api/teacher/quest?grade=${encodeURIComponent(yearLevel)}`
      : '/api/teacher/quest';
    fetch(url)
      .then(r => r.json())
      .then((data: { quest: Quest | null }) => setQuest(data.quest))
      .catch(() => {});
  }, []);

  if (!quest) return null;

  const fmtInfo = FORMAT_MAP[quest.format];
  const fmtLabel = fmtInfo ? `${fmtInfo.icon} ${fmtInfo.label}` : quest.format;

  function handleStart() {
    if (!quest) return;
    router.push(`/learn?topic=${encodeURIComponent(quest.topic)}&format=${quest.format}`);
  }

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between gap-2 text-sm">
      <p className="text-amber-800 flex-1 truncate">
        <span className="font-semibold">📌 Today&apos;s Quest:</span>{' '}
        {quest.topic} as {fmtLabel}
        {quest.message ? ` — ${quest.message}` : ''}
      </p>
      <button
        onClick={handleStart}
        className="shrink-0 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded px-2 py-0.5 transition-colors"
      >
        Start this quest →
      </button>
    </div>
  );
}
