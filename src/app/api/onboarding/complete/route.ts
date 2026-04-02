import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { topic, format } = await req.json();
  const db = getDb();

  // Mark onboarding complete
  await db.execute({
    sql: 'UPDATE users SET onboarding_complete = 1 WHERE id = ?',
    args: [session.userId],
  });

  // Create initial learning session
  await db.execute({
    sql: 'INSERT INTO learning_sessions (id, user_id, topic, format) VALUES (?, ?, ?, ?)',
    args: [uuidv4(), session.userId, topic, format],
  });

  return NextResponse.json({ success: true });
}
