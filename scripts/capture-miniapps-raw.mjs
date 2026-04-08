import { chromium } from '@playwright/test'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const BASE_URL = 'https://questlearn-nu.vercel.app'
const OUT_BASE = '/Users/loki/.openclaw/workspace/projects/questlearn-app/overnight-production/raw-video/miniapps-batch'
const VIEWPORT = { width: 1440, height: 900 }

const students = [
  {
    slug: 's1-zara',
    name: 'Zara Osei',
    role: 'student',
    year_level: 'Year 10',
    school_name: 'Parramatta High School',
    school_location: 'Parramatta',
    topic: 'Photosynthesis',
  },
  {
    slug: 's2-kai',
    name: 'Kai Nguyen',
    role: 'student',
    year_level: 'Year 9',
    school_name: 'Epping Boys High School',
    school_location: 'Epping',
    topic: "Newton's Laws of Motion",
  },
  {
    slug: 's3-priya',
    name: 'Priya Sharma',
    role: 'student',
    year_level: 'Year 8',
    school_name: 'Cheltenham Girls High School',
    school_location: 'Cheltenham',
    topic: 'The Water Cycle',
  },
]

const teachers = [
  {
    slug: 't1-rachel',
    name: 'Ms Rachel Chen',
    role: 'teacher',
    teacher_id: 'T-1024',
    subject: 'Science',
    school_name: 'Parramatta High School',
    school_location: 'Parramatta',
  },
  {
    slug: 't2-david',
    name: 'Mr David Okafor',
    role: 'teacher',
    teacher_id: 'T-2048',
    subject: 'Mathematics',
    school_name: 'Parramatta High School',
    school_location: 'Parramatta',
  },
]

const apps = [
  { key: 'meme', path: (topic) => `/mini/meme?topic=${encodeURIComponent(topic)}` },
  { key: 'flashcards', path: (topic) => `/mini/flashcards?topic=${encodeURIComponent(topic)}` },
  { key: 'concept-map', path: (topic) => `/mini/concept-map?topic=${encodeURIComponent(topic)}` },
  { key: 'debate', path: (topic) => `/mini/debate?topic=${encodeURIComponent(topic)}` },
]

function cleanAndMkdir(dir) {
  fs.mkdirSync(dir, { recursive: true })
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith('.webm') || f.endsWith('.mp4')) fs.unlinkSync(path.join(dir, f))
  }
}

async function registerPersona(page, payload) {
  return page.evaluate(async (data) => {
    const res = await fetch('/api/auth/lumina-register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })
    return { ok: res.ok, status: res.status }
  }, payload)
}

async function captureScenario(browser, scenario) {
  const outDir = path.join(OUT_BASE, scenario.personaSlug, scenario.fileSlug)
  cleanAndMkdir(outDir)

  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: outDir, size: VIEWPORT },
  })
  const page = await context.newPage()

  let ok = false
  let error = ''
  let mp4Path = ''

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 45000 })
    const reg = await registerPersona(page, scenario.personaPayload)
    if (!reg.ok) throw new Error(`register failed: ${reg.status}`)

    await page.goto(`${BASE_URL}${scenario.path}`, { waitUntil: 'domcontentloaded', timeout: 45000 })
    await page.waitForTimeout(2200)

    // light interactions for more useful motion
    if (scenario.kind !== 'teacher') {
      await page.mouse.wheel(0, 250)
      await page.waitForTimeout(600)
      try {
        await page.locator('button, [role="button"]').first().click({ timeout: 2000 })
      } catch {}
      await page.waitForTimeout(1400)
    } else {
      await page.mouse.wheel(0, 420)
      await page.waitForTimeout(900)
      try {
        await page.locator('button, [role="button"]').first().click({ timeout: 2000 })
      } catch {}
      await page.waitForTimeout(1500)
    }

    ok = true
  } catch (e) {
    error = String(e)
  }

  await context.close()

  const latestWebm = fs.readdirSync(outDir)
    .filter(f => f.endsWith('.webm'))
    .map(f => ({ f, mtime: fs.statSync(path.join(outDir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0]?.f

  if (latestWebm) {
    const webmPath = path.join(outDir, latestWebm)
    mp4Path = path.join(outDir, `${scenario.fileSlug}.mp4`)
    execSync(`ffmpeg -y -i "${webmPath}" -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p "${mp4Path}" >/dev/null 2>&1`)
    fs.unlinkSync(webmPath)
  }

  return { ...scenario, ok, error, mp4Path }
}

async function main() {
  fs.mkdirSync(OUT_BASE, { recursive: true })

  const scenarios = []
  for (const s of students) {
    for (const app of apps) {
      scenarios.push({
        kind: 'student',
        personaSlug: s.slug,
        personaPayload: {
          name: s.name,
          role: s.role,
          year_level: s.year_level,
          school_name: s.school_name,
          school_location: s.school_location,
        },
        path: app.path(s.topic),
        fileSlug: `${s.slug}-${app.key}-raw`,
        label: `${s.name} · ${app.key}`,
      })
    }
  }

  for (const t of teachers) {
    scenarios.push({
      kind: 'teacher',
      personaSlug: t.slug,
      personaPayload: {
        name: t.name,
        role: t.role,
        teacher_id: t.teacher_id,
        subject: t.subject,
        school_name: t.school_name,
        school_location: t.school_location,
      },
      path: '/teacher',
      fileSlug: `${t.slug}-dashboard-raw`,
      label: `${t.name} · dashboard`,
    })
  }

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
  const results = []

  for (const scenario of scenarios) {
    const r = await captureScenario(browser, scenario)
    results.push(r)
    console.log(`${r.ok ? '✅' : '❌'} ${r.label}`)
    if (r.mp4Path) console.log(`   ${r.mp4Path}`)
    if (!r.ok && r.error) console.log(`   ${r.error}`)
  }

  await browser.close()

  const report = {
    baseUrl: BASE_URL,
    generatedAt: new Date().toISOString(),
    total: results.length,
    passed: results.filter(r => r.ok).length,
    failed: results.filter(r => !r.ok).length,
    results,
  }

  const reportPath = path.join(OUT_BASE, 'capture-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`\nReport: ${reportPath}`)

  if (report.failed > 0) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
