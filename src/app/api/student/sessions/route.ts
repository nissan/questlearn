import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name') ?? '';
  const db = getDb();

  const result = await db.execute({
    sql: `SELECT ls.id, ls.topic, ls.format, ls.turn_count, ls.last_active_at
          FROM learning_sessions ls
          LEFT JOIN lumina_users lu ON ls.user_id = lu.id
          WHERE lu.name = ?
          ORDER BY ls.last_active_at DESC
          LIMIT 5`,
    args: [name],
  });

  const sessions = result.rows.map((row) => ({
    id: row.id,
    topic: row.topic,
    format: row.format,
    turn_count: Number(row.turn_count ?? 0),
    last_active_at: row.last_active_at,
    status: Number(row.turn_count ?? 0) > 3 ? 'In Progress' : 'Pending',
    priority: Number(row.turn_count ?? 0) >= 5 ? 'High' : 'Medium',
  }));

  return NextResponse.json({ sessions });
}
