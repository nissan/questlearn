import { Flashcards } from '@/components/interactive/Flashcards';

export default async function FlashcardsStandalonePage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const params = await searchParams;
  const topic = params.topic || 'Photosynthesis';

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 text-xs text-muted-foreground uppercase tracking-wide">Standalone Mini App</div>
        <h1 className="text-xl font-semibold mb-4">Flashcards · {topic}</h1>
        <div className="h-[78vh] rounded-xl border bg-card overflow-hidden">
          <Flashcards topic={topic} />
        </div>
      </div>
    </main>
  );
}
