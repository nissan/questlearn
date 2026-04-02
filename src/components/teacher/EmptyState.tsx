export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="text-5xl">📊</div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold">No learning sessions yet</h3>
        <p className="text-muted-foreground max-w-sm">
          When students start using QuestLearn, you&apos;ll see their engagement here — which topics they&apos;re exploring and which formats resonate.
        </p>
      </div>
      <div className="bg-muted rounded-lg p-4 text-sm text-left max-w-sm space-y-2">
        <p className="font-medium">Share QuestLearn with your class:</p>
        <code className="block bg-background rounded px-3 py-2 text-xs break-all">
          {typeof window !== 'undefined' ? window.location.origin : 'https://questlearn.vercel.app'}/auth
        </code>
      </div>
    </div>
  );
}
