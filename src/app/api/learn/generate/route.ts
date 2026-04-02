import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateContent } from '@/lib/curricullm-client';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { topic, format } = await req.json();
  if (!topic || !format) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  return NextResponse.json(generateContent(topic, format));
}
