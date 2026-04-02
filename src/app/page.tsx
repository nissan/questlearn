export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight">QuestLearn</h1>
        <p className="text-muted-foreground text-lg">AI-powered learning that meets students where their curiosity lives.</p>
        <a href="/auth" className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition">
          Get Started →
        </a>
      </div>
    </main>
  );
}
