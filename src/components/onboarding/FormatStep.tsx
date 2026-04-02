import { Button } from '@/components/ui/button';
import { FORMATS, FormatId } from '@/lib/formats';

export function FormatStep({ format, onFormatChange, onNext, onBack }: {
  format: FormatId | '';
  onFormatChange: (f: FormatId) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">How do you want to learn it?</h2>
        <p className="text-muted-foreground">Pick the format that sounds most fun right now.</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {FORMATS.map(f => (
          <button
            key={f.id}
            onClick={() => onFormatChange(f.id)}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
              format === f.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
          >
            <span className="text-3xl">{f.icon}</span>
            <div>
              <div className="font-semibold">{f.label}</div>
              <div className="text-sm text-muted-foreground">{f.description}</div>
            </div>
            {format === f.id && <span className="ml-auto text-primary">✓</span>}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">← Back</Button>
        <Button onClick={onNext} disabled={!format} className="flex-1">Next →</Button>
      </div>
    </div>
  );
}
