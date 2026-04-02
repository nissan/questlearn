import { NextRequest, NextResponse } from 'next/server';
import { createOTC } from '@/lib/otc';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { email } = await req.json();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const { code, cooldownRemaining } = await createOTC(email.toLowerCase());
  if (cooldownRemaining > 0) {
    return NextResponse.json({ error: 'cooldown', cooldownRemaining }, { status: 429 });
  }

  await resend.emails.send({
    from: 'QuestLearn <onboarding@resend.dev>',
    to: email,
    subject: `Your QuestLearn code: ${code}`,
    text: `Your QuestLearn sign-in code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, you can ignore this email.`,
  });

  return NextResponse.json({ success: true });
}
