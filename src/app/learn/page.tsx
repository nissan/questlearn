import { Suspense } from 'react';
import { LearnContent } from '@/components/learn/LearnContent';

export default function LearnPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading your quest…</p>
      </main>
    }>
      <LearnContent />
    </Suspense>
  );
}
