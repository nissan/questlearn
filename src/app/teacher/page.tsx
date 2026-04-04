'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { HeatmapCell } from '@/components/teacher/HeatmapCell';
import { EmptyState } from '@/components/teacher/EmptyState';
import { Separator } from '@/components/ui/separator';
import { CognitiEngagement } from '@/components/teacher/CognitiEngagement';
import { TodaysQuest } from '@/components/teacher/TodaysQuest';
import { LiveActivity } from '@/components/teacher/LiveActivity';

const FORMAT_LABELS: Record<string, string> = {
  game: '🎮 Game', story: '📖 Story', meme: '😂 Meme',
  puzzle: '🧩 Puzzle', short_film: '🎬 Short Film'
};

interface HeatmapRow {
  topic: string;
  format: string;
  student_count: number;
  total_turns: number;
  avg_turns: number;
}

interface HeatmapData {
  rows: HeatmapRow[];
  topics: string[];
  formats: string[];
}

export default function TeacherDashboard() {
  const [data, setData] = useState<HeatmapData | null>(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/teacher/heatmap')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);

  const filteredTopics = data?.topics.filter(t =>
    !filter || t.toLowerCase().includes(filter.toLowerCase())
  ) ?? [];

  const getCell = (topic: string, format: string) => {
    const row = data?.rows.find(r => r.topic === topic && r.format === format);
    const r = row ?? { topic, format, student_count: 0, total_turns: 0, avg_turns: 0 };
    return {
      topic: r.topic,
      format: r.format,
      studentCount: Number(r.student_count),
      totalTurns: Number(r.total_turns),
      avgTurns: Number(r.avg_turns),
    };
  };

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Loading dashboard…</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Class Dashboard</h1>
          <p className="text-muted-foreground text-sm">Engagement heatmap — topic × format</p>
        </div>
        <Badge variant="outline">Year 9</Badge>
      </div>

      <TodaysQuest />
      <LiveActivity />

      {(!data || data.topics.length === 0) ? <EmptyState /> : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <CardTitle className="text-base">Engagement Heatmap</CardTitle>
              <Input
                placeholder="Filter topics…"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="max-w-xs h-8 text-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left font-medium text-muted-foreground pb-3 pr-4 min-w-[160px]">Topic</th>
                    {data.formats.map(f => (
                      <th key={f} className="text-center font-medium text-muted-foreground pb-3 px-1 min-w-[80px] text-xs">
                        {FORMAT_LABELS[f] ?? f}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  {filteredTopics.map(topic => (
                    <tr key={topic}>
                      <td className="pr-4 py-1 text-sm font-medium truncate max-w-[160px]">{topic}</td>
                      {data.formats.map(format => (
                        <td key={format} className="px-1 py-1">
                          <HeatmapCell {...getCell(topic, format)} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <span>Engagement depth:</span>
              {[
                { label: 'None', className: 'bg-muted' },
                { label: 'Low', className: 'bg-emerald-100' },
                { label: 'Medium', className: 'bg-emerald-300' },
                { label: 'High', className: 'bg-emerald-500' },
                { label: 'Deep', className: 'bg-emerald-700' },
              ].map(({ label, className }) => (
                <div key={label} className="flex items-center gap-1">
                  <div className={`w-4 h-4 rounded ${className}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Separator className="my-6" />
      <h2 className="text-lg font-semibold mb-4">🃏 Cogniti Flashcard Engagement</h2>
      <CognitiEngagement />
    </main>
  );
}
