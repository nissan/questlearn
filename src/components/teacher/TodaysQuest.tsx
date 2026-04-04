'use client';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FORMATS } from '@/lib/formats';
import type { FormatId } from '@/lib/formats';

interface Quest {
  id: string;
  teacher_name: string;
  topic: string;
  format: string;
  message: string | null;
  created_at: string;
  active: number;
}

const FORMAT_MAP = Object.fromEntries(FORMATS.map(f => [f.id, f]));

export function TodaysQuest() {
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [teacherName, setTeacherName] = useState('');
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState<FormatId>('story');
  const [message, setMessage] = useState('');

  const fetchQuest = useCallback(async () => {
    try {
      const res = await fetch('/api/teacher/quest');
      const data = await res.json() as { quest: Quest | null };
      setQuest(data.quest);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuest();
    const interval = setInterval(fetchQuest, 30_000);
    return () => clearInterval(interval);
  }, [fetchQuest]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!teacherName.trim() || !topic.trim()) return;
    setSubmitting(true);
    try {
      await fetch('/api/teacher/quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacher_name: teacherName, topic, format, message }),
      });
      setShowForm(false);
      setTopic('');
      setMessage('');
      await fetchQuest();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleClear() {
    await fetch('/api/teacher/quest', { method: 'DELETE' });
    await fetchQuest();
  }

  const fmtInfo = quest ? FORMAT_MAP[quest.format] : null;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">📌 Today&apos;s Quest</CardTitle>
          {!showForm && (
            <Button
              size="sm"
              onClick={() => setShowForm(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs h-7 px-3"
            >
              Set Quest
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
        ) : showForm ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="ql-teacher-name" className="text-xs">Your name</Label>
              <Input
                id="ql-teacher-name"
                placeholder="e.g. Ms Johnson"
                value={teacherName}
                onChange={e => setTeacherName(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ql-quest-topic" className="text-xs">Topic</Label>
              <Input
                id="ql-quest-topic"
                placeholder="e.g. The water cycle"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ql-quest-format" className="text-xs">Format</Label>
              <select
                id="ql-quest-format"
                value={format}
                onChange={e => setFormat(e.target.value as FormatId)}
                className="w-full h-8 rounded-md border border-input bg-background px-2 text-sm"
              >
                {FORMATS.map(f => (
                  <option key={f.id} value={f.id}>{f.icon} {f.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="ql-quest-message" className="text-xs">Message (optional)</Label>
              <Textarea
                id="ql-quest-message"
                placeholder="Any extra context for students…"
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="text-sm resize-none h-16"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={submitting || !teacherName.trim() || !topic.trim()}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                {submitting ? 'Saving…' : 'Pin Quest'}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : quest ? (
          <div className="space-y-2">
            <p className="text-xl font-bold">{quest.topic}</p>
            <div className="flex items-center gap-2">
              {fmtInfo && (
                <Badge variant="secondary" className="text-xs">
                  {fmtInfo.icon} {fmtInfo.label}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">pinned by {quest.teacher_name}</span>
            </div>
            {quest.message && (
              <p className="text-sm text-muted-foreground italic">&ldquo;{quest.message}&rdquo;</p>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={handleClear}
              className="text-xs h-7 px-3 mt-1"
            >
              Clear
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No quest set — pin a topic for your class
          </p>
        )}
      </CardContent>
    </Card>
  );
}
