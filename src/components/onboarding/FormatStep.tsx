import { Button } from '@/components/ui/button';
import { FORMATS, FormatId } from '@/lib/formats';

export function FormatStep({ format, onFormatChange, onNext, onBack }: {
  format: FormatId | '';
  onFormatChange: (f: FormatId) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const primaryFormats = FORMATS.filter(f => f.tier === 'primary');
  const secondaryFormats = FORMATS.filter(f => f.tier === 'secondary');

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-xl font-bold">How do you want to learn it?</h2>
        <p className="text-sm text-muted-foreground">Pick the format that sounds most fun right now.</p>
      </div>

      {/* Primary formats — compact selectable cards */}
      <div className="grid grid-cols-1 gap-2">
        {primaryFormats.map(f => (
          <button
            key={f.id}
            onClick={() => onFormatChange(f.id)}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
              format === f.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
          >
            <span className="text-2xl">{f.icon}</span>
            <div>
              <div className="font-medium text-sm">{f.label}</div>
              <div className="text-xs text-muted-foreground">{f.description}</div>
            </div>
            {format === f.id && <span className="ml-auto text-primary">✓</span>}
          </button>
        ))}
      </div>

      {/* Secondary formats — compact "Coming Soon" row */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Coming Soon</p>
        <div className="flex flex-wrap gap-2">
          {secondaryFormats.map(f => (
            <div
              key={f.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground opacity-50 text-xs cursor-not-allowed"
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">← Back</Button>
        <Button onClick={onNext} disabled={!format} className="flex-1">Next →</Button>
      </div>
    </div>
  );
}
