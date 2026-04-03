import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { getDb } from '@/lib/db'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

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

async function createLuminaJWT(userId: string, role: string): Promise<string> {
  return new SignJWT({ sub: userId, uid: userId, role, lumina: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET)
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

  const id = crypto.randomUUID()

  try {
    await ensureTable()
    const db = getDb()

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
  } catch (err) {
    console.error('[lumina-register] DB error (graceful degradation):', err)
    // Continue — localStorage session still works even if DB write fails
  }

  // Issue a ql_session JWT so the middleware lets Lumina OS users
  // navigate directly to /learn and /teacher without hitting /auth
  let token: string | null = null
  try {
    token = await createLuminaJWT(id, role)
  } catch (err) {
    console.error('[lumina-register] JWT error:', err)
  }

  const res = NextResponse.json({ id, name, role }, { status: 201 })

  if (token) {
    res.cookies.set('ql_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })
  }

  return res
}
