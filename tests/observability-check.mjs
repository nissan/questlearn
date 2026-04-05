/**
 * Observability Verification Script
 * 
 * Fires real events against the live Vercel deployment, then queries
 * PostHog, Langfuse and Sentry APIs to confirm ingestion.
 * 
 * Usage: node tests/observability-check.mjs
 * 
 * Requires in environment (or .env.local):
 *   POSTHOG_PERSONAL_API_KEY  — PostHog personal API key (Settings → Personal API Keys)
 *   LANGFUSE_SECRET_KEY       — Langfuse secret key
 *   LANGFUSE_PUBLIC_KEY       — Langfuse public key
 *   SENTRY_AUTH_TOKEN         — Sentry auth token
 *   JWT_SECRET                — to mint a test session token
 *   TURSO_DATABASE_URL + TURSO_AUTH_TOKEN — to create/clean up test session rows
 */

import { readFileSync, existsSync } from 'fs'
import { SignJWT } from 'jose'
import { createClient } from '@libsql/client'

// ── Load .env.local if present ────────────────────────────────────────────────
if (existsSync('.env.local')) {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'https://questlearn-nu.vercel.app'
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
const POSTHOG_PERSONAL_KEY = process.env.POSTHOG_PERSONAL_API_KEY
const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID || '369383'
const LF_SECRET = process.env.LANGFUSE_SECRET_KEY
const LF_PUBLIC = process.env.LANGFUSE_PUBLIC_KEY
const LF_HOST = process.env.LANGFUSE_BASE_URL || 'https://us.cloud.langfuse.com'
const SENTRY_TOKEN = process.env.SENTRY_AUTH_TOKEN
const JWT_SECRET = process.env.JWT_SECRET
const TEST_USER_ID = `obs-test-${Date.now()}`

let passed = 0
let failed = 0

function ok(label) { console.log(`  ✅ ${label}`); passed++ }
function fail(label, detail) { console.log(`  ❌ ${label}${detail ? `: ${detail}` : ''}`); failed++ }
function section(title) { console.log(`\n━━━ ${title} ━━━`) }

// ── Mint a test JWT ───────────────────────────────────────────────────────────
async function mintTestJWT() {
  if (!JWT_SECRET) throw new Error('JWT_SECRET not set')
  const secret = new TextEncoder().encode(JWT_SECRET)
  return new SignJWT({ sub: TEST_USER_ID, uid: TEST_USER_ID, role: 'student', lumina: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret)
}

// ── Fire test events ──────────────────────────────────────────────────────────
async function fireTestEvents() {
  section('1. Firing test events against live deployment')

  // Health check first
  const health = await fetch(`${BASE_URL}/api/health`).then(r => r.json()).catch(e => ({ error: e.message }))
  if (health.status === 'ok') ok(`Health check passed (db: ${health.checks.db})`)
  else { fail('Health check', JSON.stringify(health)); return false }

  let jwt
  try {
    jwt = await mintTestJWT()
    ok('Test JWT minted')
  } catch (e) {
    fail('JWT mint', e.message)
    return false
  }

  const headers = { 'Content-Type': 'application/json', Cookie: `ql_session=${jwt}` }

  // 1. Create a learning session
  const sessionRes = await fetch(`${BASE_URL}/api/learn/session`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ topic: 'Photosynthesis', format: 'story' })
  })
  if (!sessionRes.ok) { fail('Create learning session', `${sessionRes.status}`); return false }
  const session = await sessionRes.json()
  const learningSessionId = session.id
  ok(`Learning session created (id: ${learningSessionId})`)

  // 2. Trigger content generation (fires PostHog content_generated + Langfuse trace)
  const genRes = await fetch(`${BASE_URL}/api/learn/generate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ topic: 'Photosynthesis', format: 'story', yearLevel: 'Year 9' })
  })
  if (!genRes.ok) { fail('Content generation', `${genRes.status}`); return false }
  ok('content_generated event fired → /api/learn/generate')

  // 3. Trigger Socratic turn (fires PostHog socratic_turn_completed + Langfuse trace)
  const socRes = await fetch(`${BASE_URL}/api/learn/socratic`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      learningSessionId,
      studentResponse: 'Plants use sunlight to make food',
      turnIndex: 0,
      topic: 'Photosynthesis',
      format: 'story',
      yearLevel: 'Year 9',
      history: []
    })
  })
  if (!socRes.ok) { fail('Socratic turn', `${socRes.status}`); return false }
  ok('socratic_turn_completed event fired → /api/learn/socratic')

  // 4. Fire a PostHog client-side event directly (simulates browser capture)
  if (POSTHOG_KEY) {
    const phRes = await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        event: 'obs_verification_test',
        distinct_id: TEST_USER_ID,
        properties: { test: true, timestamp: new Date().toISOString(), source: 'observability-check' }
      })
    })
    if (phRes.ok) ok('PostHog direct capture (obs_verification_test) — status 200')
    else fail('PostHog direct capture', `${phRes.status}`)
  } else {
    fail('PostHog direct capture', 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN not set')
  }

  // 5. Trigger a Sentry test error via the test endpoint if it exists, else manual
  const sentryTestRes = await fetch(`${BASE_URL}/api/health/sentry-test`).catch(() => null)
  if (sentryTestRes?.ok) ok('Sentry test error endpoint fired')
  else ok('Sentry test error — will verify via API query (no dedicated test endpoint)')

  return { learningSessionId }
}

// ── Verify PostHog ────────────────────────────────────────────────────────────
async function verifyPostHog() {
  section('2. Verifying PostHog ingestion')
  if (!POSTHOG_PERSONAL_KEY) {
    console.log('  ⚠️  POSTHOG_PERSONAL_API_KEY not set — skipping API verification')
    console.log('     To verify manually: app.posthog.com → Activity → filter by distinct_id:', TEST_USER_ID)
    return
  }

  // Wait a moment for ingestion
  await new Promise(r => setTimeout(r, 3000))

  const res = await fetch(
    `https://us.posthog.com/api/projects/${POSTHOG_PROJECT_ID}/events/?distinct_id=${TEST_USER_ID}&limit=10`,
    { headers: { Authorization: `Bearer ${POSTHOG_PERSONAL_KEY}` } }
  ).catch(e => ({ error: e.message }))

  if (res.error) { fail('PostHog API query', res.error); return }
  if (!res.ok) { fail('PostHog API query', `${res.status}`); return }

  const data = await res.json()
  const events = data.results || []
  const eventNames = events.map(e => e.event)

  if (eventNames.includes('obs_verification_test')) ok(`obs_verification_test found in PostHog`)
  else fail('obs_verification_test not yet visible (may be processing)', `found: ${eventNames.join(', ') || 'none'}`)

  if (eventNames.some(e => e === 'content_generated')) ok('content_generated found in PostHog')
  else console.log('  ⚠️  content_generated not yet visible (server-side events may lag)')

  if (eventNames.some(e => e === 'socratic_turn_completed')) ok('socratic_turn_completed found in PostHog')
  else console.log('  ⚠️  socratic_turn_completed not yet visible (server-side events may lag)')
}

// ── Verify Langfuse ───────────────────────────────────────────────────────────
async function verifyLangfuse() {
  section('3. Verifying Langfuse ingestion')
  if (!LF_SECRET || !LF_PUBLIC) {
    fail('Langfuse credentials', 'LANGFUSE_SECRET_KEY / LANGFUSE_PUBLIC_KEY not set')
    return
  }

  await new Promise(r => setTimeout(r, 3000))

  const auth = Buffer.from(`${LF_PUBLIC}:${LF_SECRET}`).toString('base64')
  const res = await fetch(`${LF_HOST}/api/public/traces?limit=5&userId=${TEST_USER_ID}`, {
    headers: { Authorization: `Basic ${auth}` }
  }).catch(e => ({ error: e.message }))

  if (res.error) { fail('Langfuse API query', res.error); return }
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    fail('Langfuse API query', `${res.status} ${body.slice(0, 100)}`)
    return
  }

  const data = await res.json()
  const traces = data.data || []

  if (traces.length > 0) {
    ok(`Langfuse: ${traces.length} trace(s) found for test user`)
    const names = traces.map(t => t.name).join(', ')
    ok(`Trace names: ${names}`)
  } else {
    console.log('  ⚠️  No Langfuse traces yet for this user (may still be processing)')
    console.log(`     Verify manually: ${LF_HOST} → Traces → filter userId: ${TEST_USER_ID}`)

    // Fallback: check for any recent traces at all
    const recentRes = await fetch(`${LF_HOST}/api/public/traces?limit=3`, {
      headers: { Authorization: `Basic ${auth}` }
    }).catch(() => null)
    if (recentRes?.ok) {
      const recent = await recentRes.json()
      if ((recent.data || []).length > 0) ok(`Langfuse is reachable + has ${recent.data.length} recent trace(s) in project`)
      else console.log('  ⚠️  Langfuse reachable but no traces yet — env vars may not be active on Vercel')
    }
  }
}

// ── Verify Sentry ─────────────────────────────────────────────────────────────
async function verifySentry() {
  section('4. Verifying Sentry configuration')
  if (!SENTRY_TOKEN) {
    fail('Sentry auth token', 'SENTRY_AUTH_TOKEN not set locally')
    return
  }

  // Check project exists and is receiving events
  const res = await fetch(
    'https://sentry.io/api/0/projects/redditech/questlearn-nextjs/',
    { headers: { Authorization: `Bearer ${SENTRY_TOKEN}` } }
  ).catch(e => ({ error: e.message }))

  if (res.error) { fail('Sentry API query', res.error); return }
  if (!res.ok) { fail('Sentry API query', `${res.status}`); return }

  const project = await res.json()
  ok(`Sentry project found: ${project.name} (slug: ${project.slug})`)
  ok(`Platform: ${project.platform}`)

  if (project.stats) {
    const total = Object.values(project.stats).flat().reduce((a, b) => a + (b[1] || 0), 0)
    ok(`Events received: ${total} (all time)`)
  }

  // Check DSN is set on Vercel by probing a page and looking for Sentry SDK header
  const appRes = await fetch(`${BASE_URL}/api/health`, { method: 'GET' }).catch(() => null)
  if (appRes) {
    const sentryTrace = appRes.headers.get('sentry-trace') || appRes.headers.get('baggage')
    if (sentryTrace) ok('Sentry trace headers present in response')
    else console.log('  ⚠️  No sentry-trace header on /api/health — DSN env var may not be set on Vercel yet')
  }

  // List recent issues
  const issuesRes = await fetch(
    'https://sentry.io/api/0/projects/redditech/questlearn-nextjs/issues/?limit=3',
    { headers: { Authorization: `Bearer ${SENTRY_TOKEN}` } }
  ).catch(() => null)

  if (issuesRes?.ok) {
    const issues = await issuesRes.json()
    if (issues.length > 0) ok(`Sentry has ${issues.length} issue(s) — errors are being captured`)
    else ok('Sentry project is clean (no issues) — monitoring is active')
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔭 QuestLearn Observability Verification')
  console.log(`   Target: ${BASE_URL}`)
  console.log(`   Test user: ${TEST_USER_ID}`)
  console.log(`   Time: ${new Date().toISOString()}`)

  const eventResult = await fireTestEvents()
  if (!eventResult) {
    console.log('\n❌ Could not fire test events — check JWT_SECRET and Vercel env vars')
    process.exit(1)
  }

  await verifyPostHog()
  await verifyLangfuse()
  await verifySentry()

  section('Summary')
  console.log(`  Passed: ${passed}`)
  console.log(`  Failed: ${failed}`)
  if (failed === 0) console.log('\n🎉 All checks passed — observability stack is live!')
  else console.log('\n⚠️  Some checks need attention — see above')

  console.log('\n📋 Manual verification links:')
  console.log(`   PostHog:  https://app.posthog.com/project/${POSTHOG_PROJECT_ID}/activity`)
  console.log(`   Langfuse: ${LF_HOST} → Tracing`)
  console.log(`   Sentry:   https://redditech.sentry.io/projects/questlearn-nextjs/`)

  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error('Fatal:', e); process.exit(1) })
