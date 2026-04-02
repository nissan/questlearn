import { getDb } from './db';
import { v4 as uuidv4 } from 'uuid';

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOTC(email: string): Promise<{ code: string; cooldownRemaining: number }> {
  const db = getDb();
  const now = new Date();

  // Check resend cooldown (60s)
  const existing = await db.execute({
    sql: 'SELECT last_sent_at FROM ql_otc_tokens WHERE email = ? AND used = 0 ORDER BY last_sent_at DESC LIMIT 1',
    args: [email],
  });
  if (existing.rows.length > 0) {
    const lastSent = new Date(existing.rows[0].last_sent_at as string);
    const secondsAgo = (now.getTime() - lastSent.getTime()) / 1000;
    if (secondsAgo < 60) {
      return { code: '', cooldownRemaining: Math.ceil(60 - secondsAgo) };
    }
  }

  // Invalidate old unused tokens for this email
  await db.execute({ sql: 'UPDATE ql_otc_tokens SET used = 1 WHERE email = ? AND used = 0', args: [email] });

  const code = generateCode();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000).toISOString();

  await db.execute({
    sql: 'INSERT INTO ql_otc_tokens (id, email, code, expires_at, attempts, last_sent_at, used) VALUES (?, ?, ?, ?, 0, ?, 0)',
    args: [uuidv4(), email, code, expiresAt, now.toISOString()],
  });

  return { code, cooldownRemaining: 0 };
}

export async function validateOTC(email: string, code: string): Promise<{ valid: boolean; reason?: string }> {
  const db = getDb();
  const now = new Date().toISOString();

  const result = await db.execute({
    sql: 'SELECT id, code, expires_at, attempts, used FROM ql_otc_tokens WHERE email = ? AND used = 0 ORDER BY last_sent_at DESC LIMIT 1',
    args: [email],
  });

  if (result.rows.length === 0) return { valid: false, reason: 'no_token' };

  const row = result.rows[0];
  const tokenId = row.id as string;
  const attempts = (row.attempts as number) + 1;

  if ((row.expires_at as string) < now) {
    await db.execute({ sql: 'UPDATE ql_otc_tokens SET used = 1 WHERE id = ?', args: [tokenId] });
    return { valid: false, reason: 'expired' };
  }

  if (attempts >= 3 && row.code !== code) {
    await db.execute({ sql: 'UPDATE ql_otc_tokens SET used = 1, attempts = ? WHERE id = ?', args: [attempts, tokenId] });
    return { valid: false, reason: 'max_attempts' };
  }

  await db.execute({ sql: 'UPDATE ql_otc_tokens SET attempts = ? WHERE id = ?', args: [attempts, tokenId] });

  if (row.code !== code) return { valid: false, reason: 'invalid_code' };

  await db.execute({ sql: 'UPDATE ql_otc_tokens SET used = 1 WHERE id = ?', args: [tokenId] });
  return { valid: true };
}
