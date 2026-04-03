import { jwtVerify } from 'jose';
import { getDb } from './db';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE_NAME = 'ql_session';

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
  const result = await db.execute({ sql: 'SELECT * FROM ql_users WHERE id = ?', args: [userId] });
  return result.rows[0] ?? null;
}
