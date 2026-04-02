import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function TopicStep({ topic, onTopicChange, onNext, onBack }: {
  topic: string;
  onTopicChange: (t: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">What are you stuck on?</h2>
        <p className="text-muted-foreground">Any topic, any subject. Type exactly what&apos;s confusing you.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="topic">Topic or concept</Label>
        <Input
          id="topic"
          placeholder="e.g. photosynthesis, quadratic equations, World War 1 causes..."
          value={topic}
          onChange={e => onTopicChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && topic.trim() && onNext()}
          className="text-base"
        />
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">← Back</Button>
        <Button onClick={onNext} disabled={!topic.trim()} className="flex-1">Next →</Button>
      </div>
    </div>
  );
}
