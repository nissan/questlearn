import { Button } from '@/components/ui/button';
import { FORMATS, FormatId } from '@/lib/formats';

export function ReadyStep({ topic, format, onStart, onBack, loading }: {
  topic: string;
  format: FormatId;
  onStart: () => void;
  onBack: () => void;
  loading: boolean;
}) {
  const fmt = FORMATS.find(f => f.id === format)!;
  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-center">
      <div className="text-5xl">{fmt.icon}</div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">You&apos;re ready!</h2>
        <p className="text-muted-foreground">Here&apos;s your quest:</p>
      </div>
      <div className="bg-muted rounded-xl p-6 space-y-3 text-left">
        <div className="flex items-start gap-3">
          <span className="text-muted-foreground text-sm w-16 pt-0.5 shrink-0">Topic</span>
          <span className="font-semibold">{topic}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm w-16 shrink-0">Format</span>
          <span className="font-semibold">{fmt.icon} {fmt.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm w-16 shrink-0">Year</span>
          <span className="font-semibold">Year 9</span>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">← Change</Button>
        <Button onClick={onStart} disabled={loading} className="flex-1" size="lg">
          {loading ? 'Starting…' : '🚀 Start Learning'}
        </Button>
      </div>
    </div>
  );
}
