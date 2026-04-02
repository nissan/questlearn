import { NextRequest, NextResponse } from 'next/server';
import { validateOTC } from '@/lib/otc';
import { upsertUser, createSession, getUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  if (!email || !code) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const { valid, reason } = await validateOTC(email.toLowerCase(), code);
  if (!valid) {
    const messages: Record<string, string> = {
      expired: 'Code expired. Please request a new one.',
      max_attempts: 'Too many attempts. Please request a new code.',
      invalid_code: 'Incorrect code. Please try again.',
      no_token: 'No active code found. Please request a new one.',
    };
    return NextResponse.json({ error: messages[reason!] ?? 'Invalid code', reason }, { status: 401 });
  }

  const userId = await upsertUser(email.toLowerCase());
  const token = await createSession(userId);
  const user = await getUser(userId);

  const res = NextResponse.json({
    success: true,
    onboardingComplete: Boolean(user?.onboarding_complete),
  });

  res.cookies.set('ql_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return res;
}
