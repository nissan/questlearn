import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const checks: Record<string, string> = {};

  // Check DB
  try {
    const db = getDb();
    await db.execute('SELECT 1');
    checks.db = 'ok';
  } catch (e) {
    checks.db = 'error';
  }

  // Check env vars
  checks.resend = process.env.RESEND_API_KEY ? 'configured' : 'missing';
  checks.jwt = process.env.JWT_SECRET ? 'configured' : 'missing';
  checks.turso = process.env.TURSO_DATABASE_URL ? 'configured' : 'missing';

  const allOk = Object.values(checks).every(v => v === 'ok' || v === 'configured');

  return NextResponse.json({
    status: allOk ? 'ok' : 'degraded',
    checks,
    timestamp: new Date().toISOString(),
  }, { status: allOk ? 200 : 503 });
}
