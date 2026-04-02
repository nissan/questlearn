'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  async function requestCode() {
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/request-otc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      if (data.error === 'cooldown') setCooldown(data.cooldownRemaining);
      else setError(data.error);
      return;
    }
    setStep('code');
  }

  async function verifyCode() {
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/verify-otc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    router.push(data.onboardingComplete ? '/learn' : '/onboarding');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold">QuestLearn</CardTitle>
          <CardDescription>
            {step === 'email' ? 'Enter your email to get started' : `We sent a code to ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'email' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && requestCode()}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {cooldown > 0 && (
                <p className="text-sm text-muted-foreground">
                  Please wait {cooldown}s before requesting another code.
                </p>
              )}
              <Button
                className="w-full"
                onClick={requestCode}
                disabled={loading || !email || cooldown > 0}
              >
                {loading ? 'Sending…' : 'Send sign-in code'}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="code">6-digit code</Label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && verifyCode()}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                className="w-full"
                onClick={verifyCode}
                disabled={loading || code.length !== 6}
              >
                {loading ? 'Verifying…' : 'Verify code'}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep('email');
                  setCode('');
                  setError('');
                }}
              >
                ← Use a different email
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
