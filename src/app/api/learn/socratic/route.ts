import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { generateSocratic } from '@/lib/curricullm-client';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { learningSessionId, studentResponse, turnIndex } = await req.json();
  const db = getDb();
  const followUp = generateSocratic(turnIndex);
  await db.execute({
    sql: `INSERT INTO engagement_events (id, learning_session_id, user_id, turn_index, student_response, ai_followup, timestamp) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
    args: [uuidv4(), learningSessionId, session.userId, turnIndex, studentResponse, followUp.followUp],
  });
  await db.execute({
    sql: `UPDATE learning_sessions SET turn_count = turn_count + 1, last_active_at = datetime('now') WHERE id = ?`,
    args: [learningSessionId],
  });
  return NextResponse.json(followUp);
}
