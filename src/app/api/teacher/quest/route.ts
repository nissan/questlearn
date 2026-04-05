import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

async function ensureTable() {
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS teacher_quests (
      id TEXT PRIMARY KEY,
      teacher_name TEXT NOT NULL,
      topic TEXT NOT NULL,
      format TEXT NOT NULL,
      message TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      active INTEGER NOT NULL DEFAULT 1
    )
  `);
  // Migration: add grade_level column if it doesn't exist yet
  try {
    await db.execute(`ALTER TABLE teacher_quests ADD COLUMN grade_level TEXT`);
  } catch {
    // Column already exists — ignore
  }
}

export async function GET(req: NextRequest) {
  await ensureTable();
  const db = getDb();
  const grade = req.nextUrl.searchParams.get('grade');
  let result;
  if (grade) {
    result = await db.execute({
      sql: `SELECT * FROM teacher_quests WHERE active=1 AND (grade_level IS NULL OR grade_level=?) ORDER BY created_at DESC LIMIT 1`,
      args: [grade],
    });
  } else {
    result = await db.execute(
      `SELECT * FROM teacher_quests WHERE active=1 ORDER BY created_at DESC LIMIT 1`
    );
  }
  const quest = result.rows[0] ?? null;
  return NextResponse.json({ quest });
}

export async function POST(req: NextRequest) {
  await ensureTable();
  const db = getDb();
  const body = await req.json() as {
    teacher_name: string;
    topic: string;
    format: string;
    message?: string;
  };

  const { teacher_name, topic, format, message, grade_level } = body as {
    teacher_name: string;
    topic: string;
    format: string;
    message?: string;
    grade_level?: string;
  };
  if (!teacher_name || !topic || !format) {
    return NextResponse.json({ error: 'teacher_name, topic and format are required' }, { status: 400 });
  }

  // Deactivate all current quests
  await db.execute(`UPDATE teacher_quests SET active=0`);

  // Insert new quest
  const id = randomUUID();
  await db.execute({
    sql: `INSERT INTO teacher_quests (id, teacher_name, topic, format, message, grade_level, active)
          VALUES (?, ?, ?, ?, ?, ?, 1)`,
    args: [id, teacher_name, topic, format, message ?? null, grade_level ?? null],
  });

  const result = await db.execute({
    sql: `SELECT * FROM teacher_quests WHERE id = ?`,
    args: [id],
  });

  return NextResponse.json({ quest: result.rows[0] });
}

export async function DELETE() {
  await ensureTable();
  const db = getDb();
  await db.execute(`UPDATE teacher_quests SET active=0 WHERE active=1`);
  return NextResponse.json({ ok: true });
}
