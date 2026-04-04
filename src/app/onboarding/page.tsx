'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { TopicStep } from '@/components/onboarding/TopicStep';
import { FormatStep } from '@/components/onboarding/FormatStep';
import { ReadyStep } from '@/components/onboarding/ReadyStep';
import type { FormatId } from '@/lib/formats';

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const router = useRouter();
  // Skip WelcomeStep if they've been here before
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState<FormatId | ''>('');

  useEffect(() => {
    try {
      if (localStorage.getItem('ql_seen_welcome')) {
        setStep(2)
      }
    } catch { /* ignore */ }
  }, [])
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    setLoading(true);
    try { localStorage.setItem('ql_seen_welcome', '1') } catch { /* ignore */ }
    await fetch('/api/onboarding/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, format }),
    });
    router.push(`/learn?topic=${encodeURIComponent(topic)}&format=${format}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Step {step} of {TOTAL_STEPS}</span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <Progress value={(step / TOTAL_STEPS) * 100} className="h-1.5" />
        </div>
        <Card>
          <CardContent className="pt-6 pb-6">
            {step === 1 && <WelcomeStep onNext={() => { try { localStorage.setItem('ql_seen_welcome', '1') } catch { /* ignore */ } setStep(2) }} />}
            {step === 2 && <TopicStep topic={topic} onTopicChange={setTopic} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
            {step === 3 && <FormatStep format={format} onFormatChange={setFormat} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
            {step === 4 && format && <ReadyStep topic={topic} format={format as FormatId} onStart={handleStart} onBack={() => setStep(3)} loading={loading} />}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
