import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT * FROM learning_sessions WHERE user_id = ? ORDER BY last_active_at DESC LIMIT 1`,
    args: [session.userId],
  });
  return NextResponse.json(result.rows[0] ?? null);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { topic, format } = await req.json();
  const db = getDb();
  const id = uuidv4();
  await db.execute({
    sql: `INSERT INTO learning_sessions (id, user_id, topic, format) VALUES (?, ?, ?, ?)`,
    args: [id, session.userId, topic, format],
  });
  return NextResponse.json({ id, topic, format });
}
