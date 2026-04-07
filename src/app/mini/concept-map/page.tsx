import { ConceptMap } from '@/components/interactive/ConceptMap';

export default async function ConceptMapStandalonePage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const params = await searchParams;
  const topic = params.topic || 'Photosynthesis';

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 text-xs text-muted-foreground uppercase tracking-wide">Standalone Mini App</div>
        <h1 className="text-xl font-semibold mb-4">Concept Map · {topic}</h1>
        <div className="h-[78vh] rounded-xl border bg-card overflow-hidden">
          <ConceptMap topic={topic} />
        </div>
      </div>
    </main>
  );
}
