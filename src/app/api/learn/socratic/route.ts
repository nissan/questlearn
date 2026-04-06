import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { generateSocratic } from '@/lib/curricullm-client';
import { posthogServer } from '@/lib/posthog';
import { withLangfuseTrace } from '@/lib/langfuse';
import { v4 as uuidv4 } from 'uuid';

async function ensureEngagementEventsFormat() {
  const db = getDb();
  try {
    await db.execute(`ALTER TABLE engagement_events ADD COLUMN format TEXT`);
  } catch {
    // Column already exists — ignore
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { learningSessionId, studentResponse, turnIndex, topic, format, yearLevel, history } = await req.json();
  const db = getDb();
  await ensureEngagementEventsFormat();

  // Map frontend history format (role: 'ai'|'student', text: string)
  // to OpenAI format (role: 'user'|'assistant', content: string)
  const mappedHistory = (history ?? []).map((m: { role: string; text?: string; content?: string }) => ({
    role: m.role === 'ai' ? 'assistant' : m.role === 'student' ? 'user' : m.role,
    content: m.text ?? m.content ?? '',
  })) as Array<{ role: 'user' | 'assistant'; content: string }>;

  const followUp = await withLangfuseTrace({
    name: 'socratic-followup',
    userId: session.userId,
    sessionId: learningSessionId,
    input: { topic, format, yearLevel, turnIndex, studentResponse },
    metadata: { route: '/api/learn/socratic' },
    fn: async () => generateSocratic(
      topic ?? 'this topic',
      format ?? 'story',
      yearLevel ?? 'Year 9',
      mappedHistory,
      turnIndex ?? 0
    ),
  });

  await db.execute({
    sql: `INSERT INTO engagement_events (id, learning_session_id, user_id, turn_index, student_response, ai_followup, format, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    args: [uuidv4(), learningSessionId, session.userId, turnIndex, studentResponse, followUp.followUp, format ?? null],
  });
  await db.execute({
    sql: `UPDATE learning_sessions SET turn_count = turn_count + 1, last_active_at = CURRENT_TIMESTAMP WHERE id = ?`,
    args: [learningSessionId],
  });

  // PostHog: track Socratic engagement
  posthogServer.capture({
    distinctId: session.userId,
    event: 'socratic_turn_completed',
    properties: {
      topic,
      format,
      year_level: yearLevel ?? 'Year 9',
      turn_index: turnIndex,
      learning_session_id: learningSessionId,
    },
  });

  return NextResponse.json(followUp);
}
