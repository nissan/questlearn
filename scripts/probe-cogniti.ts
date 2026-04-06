#!/usr/bin/env npx tsx
/**
 * Cogniti Connectivity Probe
 * Run: npx tsx scripts/probe-cogniti.ts
 *
 * Probes Cogniti API outside the web app to diagnose the login screen issue.
 */

const COGNITI_API_KEY = process.env.COGNITI_API_KEY ?? '_dJhhHwkvb2wLQdZAKlCSzp45MjspMhjK9ZCsCNqlh4'
const COGNITI_AGENT_ID = '69d053d9324adcb67e01f97d'
const COGNITI_MINIAPP_ID = process.env.COGNITI_MINIAPP_ID ?? '69d0575fbd12b7d70d8c1a2d'
const BASE = 'https://app.cogniti.ai'

type Result = { label: string; status: number | string; ok: boolean; detail?: string }
const results: Result[] = []

async function probe(label: string, url: string, init?: RequestInit): Promise<Result> {
  try {
    const res = await fetch(url, { ...init, redirect: 'follow' })
    const body = await res.text().catch(() => '')
    const detail = body.slice(0, 300)
    const r: Result = { label, status: res.status, ok: res.ok, detail }
    results.push(r)
    return r
  } catch (e) {
    const r: Result = { label, status: String(e), ok: false }
    results.push(r)
    return r
  }
}

async function run() {
  console.log('\n🔍 Cogniti Connectivity Probe\n' + '─'.repeat(50))
  console.log(`API Key: ${COGNITI_API_KEY.slice(0, 8)}...`)
  console.log(`Agent ID: ${COGNITI_AGENT_ID}`)
  console.log(`MiniApp ID: ${COGNITI_MINIAPP_ID}\n`)

  // ── 1. Basic reachability ──────────────────────────────
  console.log('1️⃣  Basic Reachability')

  const home = await probe('Homepage', BASE)
  console.log(`   ${home.ok ? '✅' : '⚠️'} Homepage: ${home.status}`)

  const chatEmbed = await probe('Agent embed URL (no auth)', `${BASE}/agents/${COGNITI_AGENT_ID}/chat`, {
    headers: { Accept: 'text/html' }
  })
  console.log(`   ${chatEmbed.ok ? '✅' : '⚠️'} Agent embed URL: ${chatEmbed.status}`)
  if (chatEmbed.detail?.toLowerCase().includes('login') || chatEmbed.detail?.toLowerCase().includes('aaf')) {
    console.log('   ❌ DIAGNOSIS: Embed URL shows login screen — agent is NOT set to public embed')
    console.log('   💡 FIX: In Cogniti dashboard → Agent Settings → set "Allow embed without login"')
  } else if (chatEmbed.ok) {
    console.log('   ✅ Embed URL shows chat UI — public embed is working')
  }

  // ── 2. Authentication ──────────────────────────────────
  console.log('\n2️⃣  API Key Authentication')

  const telemetry = await probe('Telemetry (with Bearer)', `${BASE}/api/v1/interactives/${COGNITI_MINIAPP_ID}/telemetry/`, {
    headers: { Authorization: `Bearer ${COGNITI_API_KEY}` }
  })
  console.log(`   ${telemetry.ok ? '✅' : '⚠️'} Telemetry endpoint: ${telemetry.status}`)
  if (telemetry.status === 401) console.log('   ❌ API key is invalid or expired')
  if (telemetry.status === 404) console.log('   ❌ MiniApp ID is wrong — check COGNITI_MINIAPP_ID')
  if (telemetry.ok) console.log('   ✅ API key is valid and telemetry is accessible')

  // ── 3. Agent messaging ────────────────────────────────
  console.log('\n3️⃣  Agent Messaging')

  const messagePayload = JSON.stringify({
    message: 'Hello! Can you explain photosynthesis in one sentence?',
  })

  // Try different endpoint patterns
  const msgEndpoints = [
    `${BASE}/api/v1/agents/${COGNITI_AGENT_ID}/chat`,
    `${BASE}/api/v1/agents/${COGNITI_AGENT_ID}/messages`,
    `${BASE}/api/v1/chat`,
    `${BASE}/api/chat`,
  ]

  for (const ep of msgEndpoints) {
    const r = await probe(`POST ${ep.replace(BASE, '')}`, ep, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${COGNITI_API_KEY}`,
      },
      body: messagePayload,
    })
    console.log(`   ${r.ok ? '✅' : '  '} ${r.label}: ${r.status}`)
    if (r.ok) {
      console.log(`   📩 Response: ${r.detail}`)
      break
    }
  }

  // ── 4. Summary ────────────────────────────────────────
  console.log('\n' + '─'.repeat(50))
  console.log('📊 Summary\n')

  const allOk = results.every(r => r.ok)
  const someOk = results.some(r => r.ok)

  if (allOk) {
    console.log('✅ All probes passed — Cogniti is fully reachable')
  } else if (someOk) {
    console.log('⚠️  Partial connectivity — some endpoints need attention')
  } else {
    console.log('❌ All probes failed — check network or API key')
  }

  const failed = results.filter(r => !r.ok)
  if (failed.length) {
    console.log('\nFailed probes:')
    failed.forEach(r => console.log(`  ✗ ${r.label}: ${r.status}`))
  }

  console.log('\n💡 Login screen fix options:')
  console.log('  1. Cogniti dashboard → Agent Settings → Enable "Public embed" or "No auth required"')
  console.log('  2. Pass ?token=<api_key> in the iframe src URL')
  console.log('  3. Replace iframe with direct API calls (no login screen at all)')
  console.log('')
}

run().catch(console.error)
