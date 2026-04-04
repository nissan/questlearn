import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();

    const result = await db.execute(`
      SELECT topic, format, COUNT(DISTINCT user_id) as student_count, SUM(turn_count) as total_turns
      FROM learning_sessions
      GROUP BY topic, format
      ORDER BY total_turns DESC
      LIMIT 20
    `);

    // Group by topic, pick the most-used format per topic
    const topicMap = new Map<string, { topic: string; format: string; student_count: number; total_turns: number }>();

    for (const row of result.rows) {
      const topic = row.topic as string;
      const format = row.format as string;
      const student_count = Number(row.student_count ?? 0);
      const total_turns = Number(row.total_turns ?? 0);

      if (!topicMap.has(topic)) {
        topicMap.set(topic, { topic, format, student_count, total_turns });
      }
      // Already have the most-used format (rows are ordered by total_turns DESC)
    }

    const topics = Array.from(topicMap.values()).slice(0, 6);

    return NextResponse.json({ topics });
  } catch (err) {
    console.error('[trending] error:', err);
    return NextResponse.json({ topics: [] });
  }
}
