import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateContent } from '@/lib/curricullm-client';
import { getDb } from '@/lib/db';
import { posthogServer } from '@/lib/posthog';
import { withLangfuseTrace } from '@/lib/langfuse';
import { v4 as uuidv4 } from 'uuid';

// Max cached variants per topic+format before we start reusing
const MAX_VARIANTS = 5;
// Reuse cache once we have at least this many variants
const REUSE_THRESHOLD = 2;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { topic, format, yearLevel, bypassCache } = await req.json();
  if (!topic || !format) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const db = getDb();

  // ── Cache lookup ──────────────────────────────────────────────────────────
  // Ensure cache table exists (idempotent)
  await db.execute(`CREATE TABLE IF NOT EXISTS content_cache (
    id TEXT PRIMARY KEY,
    topic TEXT NOT NULL,
    format TEXT NOT NULL,
    variant INTEGER NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    socratic_prompt TEXT NOT NULL,
    curriculum_ref TEXT NOT NULL,
    use_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_used_at TEXT
  )`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_cache_topic_format ON content_cache(topic, format)`);

  const topicKey = topic.toLowerCase().trim();

  // Count existing variants
  const countResult = await db.execute({
    sql: `SELECT COUNT(*) as count FROM content_cache WHERE topic = ? AND format = ?`,
    args: [topicKey, format],
  });
  const variantCount = Number(countResult.rows[0]?.count ?? 0);

  let cached = false;
  let content;

  // Serve from cache if: enough variants exist AND not bypassed AND under max
  if (!bypassCache && variantCount >= REUSE_THRESHOLD) {
    // Pick the least-recently-used cached variant (round-robin feel)
    const cacheResult = await db.execute({
      sql: `SELECT * FROM content_cache WHERE topic = ? AND format = ?
            ORDER BY last_used_at ASC NULLS FIRST, use_count ASC LIMIT 1`,
      args: [topicKey, format],
    });
    const row = cacheResult.rows[0];
    if (row) {
      cached = true;
      content = {
        title: row.title as string,
        body: row.body as string,
        socraticPrompt: row.socratic_prompt as string,
        curriculumRef: row.curriculum_ref as string,
        _stub: false,
        _cached: true,
        _variant: row.variant,
      };
      // Increment use count
      await db.execute({
        sql: `UPDATE content_cache SET use_count = use_count + 1, last_used_at = datetime('now') WHERE id = ?`,
        args: [row.id as string],
      });
    }
  }

  // ── Generate fresh content ────────────────────────────────────────────────
  if (!cached) {
    content = await withLangfuseTrace({
      name: 'content-generation',
      userId: session.userId,
      input: { topic, format, yearLevel },
      metadata: { route: '/api/learn/generate', cached: false },
      fn: async () => generateContent(topic, format, yearLevel ?? 'Year 9'),
    });

    // Store in cache if under MAX_VARIANTS
    if (variantCount < MAX_VARIANTS && content && !content._stub) {
      await db.execute({
        sql: `INSERT INTO content_cache (id, topic, format, variant, title, body, socratic_prompt, curriculum_ref)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          uuidv4(),
          topicKey,
          format,
          variantCount + 1,
          content.title,
          content.body,
          content.socraticPrompt,
          content.curriculumRef,
        ],
      });
    }
  }

  // PostHog: track generation event
  posthogServer.capture({
    distinctId: session.userId,
    event: 'content_generated',
    properties: {
      topic,
      format,
      year_level: yearLevel ?? 'Year 9',
      cached,
      variant_count: variantCount,
    },
  });

  return NextResponse.json({ ...content, _cached: cached });
}
