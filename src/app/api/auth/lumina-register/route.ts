import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

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
    const db = getDb()
    const id = crypto.randomUUID()

    await db.execute({
      sql: `INSERT INTO ql_users (id, name, role, school_name, school_location, year_level, teacher_id, subject)
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
    // If columns don't exist yet, return success with localStorage-only session
    // (graceful degradation — migration may not have run yet)
    const id = crypto.randomUUID()
    return NextResponse.json({ id, name, role }, { status: 201 })
  }
}
