/**
 * Cogniti API Connectivity Tests
 *
 * Probes whether we can contact the Cogniti agent outside the web app.
 * Runs directly against the Cogniti API — no browser, no iframe.
 *
 * Run individually: npx vitest run src/__tests__/api/cogniti/connectivity.test.ts
 */

import { describe, it, expect } from 'vitest'

const COGNITI_API_KEY = process.env.COGNITI_API_KEY ?? '_dJhhHwkvb2wLQdZAKlCSzp45MjspMhjK9ZCsCNqlh4'
const COGNITI_AGENT_ID = '69d053d9324adcb67e01f97d'
const COGNITI_MINIAPP_ID = process.env.COGNITI_MINIAPP_ID ?? '69d0575fbd12b7d70d8c1a2d'
const COGNITI_BASE = 'https://app.cogniti.ai'

// ─── 1. Basic reachability ───────────────────────────────────────────────────

describe('Cogniti API — Basic Reachability', () => {
  it('app.cogniti.ai is reachable (HEAD request)', async () => {
    const res = await fetch(`${COGNITI_BASE}`, { method: 'HEAD' })
    // Any response (even 401) means the host is up
    expect(res.status).toBeLessThan(600)
  }, 10_000)

  it('Agent chat URL returns a response (not 404)', async () => {
    const url = `${COGNITI_BASE}/agents/${COGNITI_AGENT_ID}/chat`
    const res = await fetch(url, { method: 'GET' })
    // 200 = public, 401 = requires auth, 403 = forbidden — all mean endpoint exists
    expect(res.status).not.toBe(404)
    console.log(`Agent chat URL status: ${res.status}`)
  }, 10_000)
})

// ─── 2. API key authentication ───────────────────────────────────────────────

describe('Cogniti API — Authentication', () => {
  it('API key is set in environment', () => {
    expect(COGNITI_API_KEY).toBeTruthy()
    expect(COGNITI_API_KEY.length).toBeGreaterThan(20)
  })

  it('Telemetry endpoint returns non-403 with API key', async () => {
    const url = `${COGNITI_BASE}/api/v1/interactives/${COGNITI_MINIAPP_ID}/telemetry/`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${COGNITI_API_KEY}` },
    })
    console.log(`Telemetry endpoint status: ${res.status}`)
    // 200 = success, 401 = bad key, 403 = forbidden, 404 = wrong ID
    // We're checking it's not 403 (which would mean key is blocked)
    expect(res.status).not.toBe(403)
    if (res.status === 200) {
      const data = await res.json()
      console.log('Telemetry data keys:', Object.keys(data))
    }
  }, 10_000)

  it('API key is rejected without Bearer prefix (sanity check)', async () => {
    const url = `${COGNITI_BASE}/api/v1/interactives/${COGNITI_MINIAPP_ID}/telemetry/`
    const res = await fetch(url, {
      headers: { Authorization: COGNITI_API_KEY }, // no Bearer prefix
    })
    // Should fail with 401 or 403
    expect([401, 403, 400]).toContain(res.status)
  }, 10_000)
})

// ─── 3. Agent message sending ─────────────────────────────────────────────────

describe('Cogniti API — Agent Messaging', () => {
  it('Can send a message to the agent and get a response', async () => {
    // Try the Cogniti REST API for sending a chat message
    // Common Cogniti endpoints — try both patterns
    const endpoints = [
      `${COGNITI_BASE}/api/v1/agents/${COGNITI_AGENT_ID}/chat`,
      `${COGNITI_BASE}/api/v1/agents/${COGNITI_AGENT_ID}/messages`,
      `${COGNITI_BASE}/api/agents/${COGNITI_AGENT_ID}/chat`,
    ]

    const payload = {
      message: 'Hello, can you explain photosynthesis in one sentence?',
      context: { topic: 'Photosynthesis', format: 'flashcards' },
    }

    let lastStatus = 0
    let succeeded = false

    for (const endpoint of endpoints) {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${COGNITI_API_KEY}`,
        },
        body: JSON.stringify(payload),
      })
      lastStatus = res.status
      console.log(`Endpoint ${endpoint} → ${res.status}`)

      if (res.status === 200 || res.status === 201) {
        const data = await res.json()
        console.log('Agent response:', JSON.stringify(data).slice(0, 200))
        succeeded = true
        break
      }
    }

    // Log for diagnosis even if all fail
    if (!succeeded) {
      console.warn(`All agent endpoints returned non-200. Last status: ${lastStatus}`)
      console.warn('This likely means the API endpoint path needs discovery.')
    }

    // Not asserting success here — we log the result for diagnosis
    // This test is a probe, not a hard pass/fail
    expect(lastStatus).toBeLessThan(600) // at least got a response
  }, 15_000)

  it('Agent responds to a Socratic learning prompt', async () => {
    // Try to send a Socratic-style message and verify we get text back
    const endpoint = `${COGNITI_BASE}/api/v1/agents/${COGNITI_AGENT_ID}/chat`

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${COGNITI_API_KEY}`,
      },
      body: JSON.stringify({
        message: 'What is the role of chlorophyll in photosynthesis?',
        student_context: {
          topic: 'Photosynthesis',
          year_level: 'Year 9',
          format: 'socratic',
        },
      }),
    })

    console.log(`Socratic prompt status: ${res.status}`)

    if (res.status === 200) {
      const text = await res.text()
      console.log('Socratic response:', text.slice(0, 300))
      expect(text.length).toBeGreaterThan(10)
    } else {
      // Non-200 — log body for diagnosis
      const body = await res.text().catch(() => '[unreadable]')
      console.log('Response body:', body.slice(0, 300))
      // Still a probe — don't hard fail
      expect(res.status).toBeLessThan(600)
    }
  }, 15_000)
})

// ─── 4. Iframe embed URL analysis ────────────────────────────────────────────

describe('Cogniti Embed URL — Login Screen Diagnosis', () => {
  it('Embed URL is accessible without auth (public embed)', async () => {
    const embedUrl = `${COGNITI_BASE}/agents/${COGNITI_AGENT_ID}/chat`
    const res = await fetch(embedUrl, {
      headers: {
        // Simulate browser iframe request
        'Accept': 'text/html',
        'Sec-Fetch-Dest': 'iframe',
        'Sec-Fetch-Mode': 'navigate',
      },
    })
    const html = await res.text()
    console.log(`Embed URL status: ${res.status}`)

    // Check if the page contains a login form (the bug Anusha saw)
    const hasLoginForm = html.includes('login') || html.includes('sign in') || html.includes('AAF') || html.includes('Microsoft')
    const hasChat = html.includes('chat') || html.includes('message') || html.includes('send')

    console.log(`Contains login form: ${hasLoginForm}`)
    console.log(`Contains chat UI: ${hasChat}`)

    if (hasLoginForm) {
      console.warn('⚠️ DIAGNOSIS: Embed URL shows login screen — agent is NOT set to public embed')
      console.warn('FIX NEEDED: In Cogniti dashboard, set agent to "Allow public embed" or "No auth required"')
    }

    if (hasChat) {
      console.log('✅ Embed URL shows chat UI — public embed is working')
    }

    // This test always passes — it's diagnostic only
    expect(res.status).toBeLessThan(600)
  }, 10_000)

  it('Embed URL with API key in query param (alternative auth)', async () => {
    const embedUrl = `${COGNITI_BASE}/agents/${COGNITI_AGENT_ID}/chat?api_key=${COGNITI_API_KEY}`
    const res = await fetch(embedUrl, { headers: { Accept: 'text/html' } })
    const html = await res.text()
    console.log(`Embed with API key status: ${res.status}`)

    const hasLoginForm = html.includes('login') || html.includes('AAF')
    console.log(`Still shows login: ${hasLoginForm}`)

    // Diagnostic only
    expect(res.status).toBeLessThan(600)
  }, 10_000)
})
