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

  try {
    const { data, error: sendError } = await resend.emails.send({
      from: 'QuestLearn <noreply@mail.alphaglow.app>',
      to: email,
      subject: `Your QuestLearn code: ${code}`,
      text: `Your QuestLearn sign-in code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, you can ignore this email.`,
      html: `<p>Your QuestLearn sign-in code is: <strong>${code}</strong></p><p>This code expires in 10 minutes.</p><p>If you didn't request this, you can ignore this email.</p>`,
    });
    if (sendError) {
      console.error('Resend send error:', sendError);
      return NextResponse.json({ error: 'Failed to send email. Please try again.', detail: sendError.message }, { status: 500 });
    }
    console.log('Email sent successfully, id:', data?.id);
  } catch (err) {
    console.error('Resend exception:', err);
    return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
