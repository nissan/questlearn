import { Button } from '@/components/ui/button';

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center space-y-6 animate-in fade-in duration-500">
      <div className="text-6xl">🎯</div>
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Welcome to QuestLearn</h1>
        <p className="text-muted-foreground text-lg max-w-sm mx-auto">
          Learn anything. Your way. Pick a topic you&apos;re stuck on and choose how you want to understand it.
        </p>
      </div>
      <div className="grid grid-cols-5 gap-2 text-2xl py-2">
        {['🎮','📖','😂','🧩','🎬'].map(e => (
          <div key={e} className="flex items-center justify-center p-3 bg-muted rounded-lg">{e}</div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">Game · Story · Meme · Puzzle · Short Film</p>
      <Button className="w-full max-w-xs" onClick={onNext} size="lg">Let&apos;s go →</Button>
    </div>
  );
}
