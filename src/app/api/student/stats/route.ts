import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name') ?? '';
  const db = getDb();

  // Active quests (global — not user-specific)
  const questResult = await db.execute(
    `SELECT COUNT(*) as count FROM teacher_quests WHERE active=1`
  );
  const activeQuests = Number(questResult.rows[0]?.count ?? 0);

  // Find user in lumina_users by name
  const userResult = await db.execute({
    sql: `SELECT id FROM lumina_users WHERE name = ? LIMIT 1`,
    args: [name],
  });
  const userId = userResult.rows[0]?.id ?? null;

  let completedSessions = 0;
  let totalTurns = 0;

  if (userId) {
    const sessionStats = await db.execute({
      sql: `SELECT COUNT(*) as count, COALESCE(SUM(turn_count), 0) as turns
            FROM learning_sessions WHERE user_id = ?`,
      args: [userId],
    });
    completedSessions = Number(sessionStats.rows[0]?.count ?? 0);
    totalTurns = Number(sessionStats.rows[0]?.turns ?? 0);
  }

  const progressPct = Math.min(Math.round((totalTurns / 100) * 100), 100);

  return NextResponse.json({
    name,
    activeQuests,
    completedSessions,
    totalTurns,
    progressPct,
  });
}
