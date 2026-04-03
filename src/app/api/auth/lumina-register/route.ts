import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

// Ensure lumina_users table exists (idempotent)
async function ensureTable() {
  const db = getDb()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS lumina_users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      school_name TEXT,
      school_location TEXT,
      year_level TEXT,
      teacher_id TEXT,
      subject TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, role, school_name, school_location, year_level, teacher_id, subject } = body

  if (!name || !role) {
    return NextResponse.json({ error: 'name and role are required' }, { status: 400 })
  }

  if (role !== 'student' && role !== 'teacher') {
    return NextResponse.json({ error: 'role must be student or teacher' }, { status: 400 })
  }

  try {
    await ensureTable()
    const db = getDb()
    const id = crypto.randomUUID()

    await db.execute({
      sql: `INSERT INTO lumina_users (id, name, role, school_name, school_location, year_level, teacher_id, subject)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        name,
        role,
        school_name ?? null,
        school_location ?? null,
        year_level ?? null,
        teacher_id ?? null,
        subject ?? null,
      ],
    })

    return NextResponse.json({ id, name, role }, { status: 201 })
  } catch (err) {
    console.error('[lumina-register] DB error:', err)
    // Graceful degradation — still return success for localStorage session
    const id = crypto.randomUUID()
    return NextResponse.json({ id, name, role }, { status: 201 })
  }
}
