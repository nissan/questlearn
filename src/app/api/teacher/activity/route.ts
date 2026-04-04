import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getDb } from '@/lib/db';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getSessionRole(req: NextRequest): Promise<{ userId: string; role: string } | null> {
  const token = req.cookies.get('ql_session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    const userId = payload.uid as string;
    const role = payload.role as string | undefined;
    if (role) return { userId, role };
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
      COALESCE(lu.name, 'Student') as user_name,
      ls.topic,
      ls.format,
      ls.turn_count,
      ls.last_active_at
    FROM learning_sessions ls
    LEFT JOIN lumina_users lu ON ls.user_id = lu.id
    ORDER BY ls.last_active_at DESC
    LIMIT 15
  `);

  const activities = result.rows.map(r => ({
    user_name: r.user_name as string,
    topic: r.topic as string,
    format: r.format as string,
    turn_count: Number(r.turn_count),
    last_active_at: r.last_active_at as string,
  }));

  return NextResponse.json({ activities });
}
