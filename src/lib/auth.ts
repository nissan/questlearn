import { SignJWT, jwtVerify } from 'jose';
import { getDb } from './db';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE_NAME = 'ql_session';

export async function createSession(userId: string): Promise<string> {
  const db = getDb();
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await db.execute({
    sql: 'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
    args: [sessionId, userId, expiresAt],
  });

  const token = await new SignJWT({ sub: sessionId, uid: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET);

  return token;
}

export async function getSession(): Promise<{ sessionId: string; userId: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    return { sessionId: payload.sub as string, userId: payload.uid as string };
  } catch {
    return null;
  }
}

export async function getUser(userId: string) {
  const db = getDb();
  const result = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [userId] });
  return result.rows[0] ?? null;
}

export async function upsertUser(email: string): Promise<string> {
  const db = getDb();
  const existing = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [email] });
  if (existing.rows.length > 0) {
    const uid = existing.rows[0].id as string;
    await db.execute({ sql: "UPDATE users SET last_login_at = datetime('now') WHERE id = ?", args: [uid] });
    return uid;
  }
  const id = uuidv4();
  await db.execute({
    sql: "INSERT INTO users (id, email, role, onboarding_complete) VALUES (?, ?, 'student', 0)",
    args: [id, email],
  });
  return id;
}
