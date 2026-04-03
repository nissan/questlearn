import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getDb } from '@/lib/db';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Accept any valid ql_session JWT — Lumina OS JWTs have lumina:true and no DB user record.
// We trust the role claim in the token itself for Lumina OS sessions.
async function getSessionRole(req: NextRequest): Promise<{ userId: string; role: string } | null> {
  const token = req.cookies.get('ql_session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    const userId = payload.uid as string;
    const role = payload.role as string | undefined;
    // Lumina OS JWT has role embedded; legacy JWT needs DB lookup
    if (role) return { userId, role };
    // Legacy: look up in ql_users
    const db = getDb();
    const result = await db.execute({ sql: 'SELECT role FROM ql_users WHERE id = ?', args: [userId] });
    const dbRole = result.rows[0]?.role as string ?? 'student';
    return { userId, role: dbRole };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const session = await getSessionRole(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.role !== 'teacher') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const db = getDb();

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

  const topics = [...new Set(result.rows.map(r => r.topic as string))];
  const formats = ['game', 'story', 'meme', 'puzzle', 'short_film'];

  return NextResponse.json({ rows: result.rows, topics, formats });
}
