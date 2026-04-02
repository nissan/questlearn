import { NextResponse } from 'next/server';
import { getSession, getUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await getUser(session.userId);
  if (!user || user.role !== 'teacher') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const db = getDb();

  // Aggregate: topic × format × engagement depth
  const result = await db.execute(`
    SELECT
      ls.topic,
      ls.format,
      COUNT(DISTINCT ls.user_id) as student_count,
      SUM(ls.turn_count) as total_turns,
      AVG(ls.turn_count) as avg_turns
    FROM learning_sessions ls
    GROUP BY ls.topic, ls.format
    ORDER BY total_turns DESC
  `);

  // Also get unique topics and formats for axes
  const topics = [...new Set(result.rows.map(r => r.topic as string))];
  const formats = ['game', 'story', 'meme', 'puzzle', 'short_film'];

  return NextResponse.json({ rows: result.rows, topics, formats });
}
