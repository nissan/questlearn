'use client';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FORMATS } from '@/lib/formats';

interface Activity {
  user_name: string;
  topic: string;
  format: string;
  turn_count: number;
  last_active_at: string;
}

const FORMAT_MAP = Object.fromEntries(FORMATS.map(f => [f.id, f]));

function relativeTime(isoStr: string): string {
  const diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (diff < 60) return 'just now';
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export function LiveActivity() {
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState(false);

  const fetchActivity = useCallback(async () => {
    try {
      const res = await fetch('/api/teacher/activity');
      if (!res.ok) return;
      const data = await res.json() as { activities: Activity[] };
      setActivities(data.activities);
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 20_000);
    return () => clearInterval(interval);
  }, [fetchActivity]);

  const displayed = activities?.slice(0, 10) ?? [];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">🟢 Live Activity</CardTitle>
          <span className={`text-xs text-muted-foreground transition-opacity duration-300 ${pulse ? 'opacity-100' : 'opacity-50'}`}>
            ↻ auto-refreshing
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No activity yet — students will appear here when they start learning
          </p>
        ) : (
          <ul className="space-y-2">
            {displayed.map((a, i) => {
              const fmtInfo = FORMAT_MAP[a.format];
              const fmtLabel = fmtInfo ? `${fmtInfo.icon} ${fmtInfo.label}` : a.format;
              return (
                <li key={i} className="flex items-center gap-1.5 text-sm flex-wrap">
                  <span className="font-medium">{a.user_name}</span>
                  <span className="text-muted-foreground">is studying</span>
                  <span className="font-medium truncate max-w-[140px]">{a.topic}</span>
                  <span className="text-muted-foreground">via</span>
                  <span>{fmtLabel}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{a.turn_count} turns</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground text-xs">{relativeTime(a.last_active_at)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
