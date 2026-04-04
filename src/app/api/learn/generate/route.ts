import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateContent } from '@/lib/curricullm-client';
import { posthogServer } from '@/lib/posthog';
import { withLangfuseTrace } from '@/lib/langfuse';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { topic, format, yearLevel } = await req.json();
  if (!topic || !format) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const content = await withLangfuseTrace({
    name: 'content-generation',
    userId: session.userId,
    input: { topic, format, yearLevel },
    metadata: { route: '/api/learn/generate' },
    fn: async () => generateContent(topic, format, yearLevel ?? 'Year 9'),
  });

  // PostHog: track content generation event
  posthogServer.capture({
    distinctId: session.userId,
    event: 'content_generated',
    properties: {
      topic,
      format,
      year_level: yearLevel ?? 'Year 9',
    },
  });

  return NextResponse.json(content);
}
