# BUILD_PLAN: Student Dashboard Window — QuestLearn / Lumina OS

**Author:** Firefly  
**Date:** 2026-04-04  
**Feature:** Student Dashboard (`student-dashboard`) as a full Lumina OS window app  
**Status:** READY FOR KIT

---

## Summary

Add a `student-dashboard` window to Lumina OS that:
- Auto-opens after login (first window the student sees)
- Is accessible from the Dock and App Launcher
- Loads `/student-dashboard?name=<name>` in an iframe via the existing `Window.tsx` mechanism
- Shows a Figma-matched dashboard: greeting bar, 4 stat cards, upcoming quizzes, ongoing learning sessions as "issues"
- Reads student name from URL param (iframe-safe; no Zustand access inside iframe)
- Calls two new API routes: `/api/student/stats` and `/api/student/sessions`

**Total files:** 9 (3 new routes/pages, 1 new layout, 5 OS wiring files)  
**New npm packages:** None  
**TypeScript errors:** Zero required  
**Test command:** `cd /Users/loki/projects/questlearn && npm run build`  
**Dev command:** `npm run dev`

---

## TypeScript Interfaces

```typescript
// API: GET /api/student/stats?name=<name>
interface StudentStatsResponse {
  name: string              // from query param, echoed back
  activeQuests: number      // COUNT from teacher_quests WHERE active=1
  completedSessions: number // COUNT from learning_sessions WHERE user_id matched via lumina_users
  totalTurns: number        // SUM(turn_count) from learning_sessions
  progressPct: number       // Math.min(Math.round((totalTurns / 100) * 100), 100)
}

// API: GET /api/student/sessions?name=<name>
interface StudentSession {
  id: string
  topic: string             // displayed as "issue name"
  format: string            // displayed as subject/tag
  turn_count: number        // >3 = 'In Progress', else 'Pending'
  last_active_at: string    // displayed as due date proxy
  status: 'In Progress' | 'Pending'
  priority: 'High' | 'Medium'   // High if turn_count >= 5, Medium otherwise
}
interface StudentSessionsResponse {
  sessions: StudentSession[]
}

// API: GET /api/teacher/quest (existing, reused as-is)
interface TeacherQuestResponse {
  quest: {
    id: string
    teacher_name: string
    topic: string
    format: string
    message: string | null
    created_at: string
    active: number
  } | null
}

// localStorage: lumina_user
interface LuminaUserLocal {
  name: string
  role: string
}
```

---

## Phase 1: DB/API Changes

### File 1: `src/app/api/student/stats/route.ts` — NEW

**What it does:**  
Returns dashboard stats for a named student. Does NOT require JWT (query-param-based, iframe-safe). Uses `?name=` to look up the student in `lumina_users`, then joins to `learning_sessions`.

**Key logic:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name') ?? '';
  const db = getDb();

  // Active quests (global — not user-specific)
  const questResult = await db.execute(
    `SELECT COUNT(*) as count FROM teacher_quests WHERE active=1`
  );
  const activeQuests = Number(questResult.rows[0]?.count ?? 0);

  // Find user in lumina_users by name
  const userResult = await db.execute({
    sql: `SELECT id FROM lumina_users WHERE name = ? LIMIT 1`,
    args: [name],
  });
  const userId = userResult.rows[0]?.id ?? null;

  let completedSessions = 0;
  let totalTurns = 0;

  if (userId) {
    const sessionStats = await db.execute({
      sql: `SELECT COUNT(*) as count, COALESCE(SUM(turn_count), 0) as turns
            FROM learning_sessions WHERE user_id = ?`,
      args: [userId],
    });
    completedSessions = Number(sessionStats.rows[0]?.count ?? 0);
    totalTurns = Number(sessionStats.rows[0]?.turns ?? 0);
  }

  const progressPct = Math.min(Math.round((totalTurns / 100) * 100), 100);

  return NextResponse.json({
    name,
    activeQuests,
    completedSessions,
    totalTurns,
    progressPct,
  });
}
```

**Notes:**
- `lumina_users.id` is the foreign key for `learning_sessions.user_id` — confirmed from schema
- If user not found in `lumina_users`, returns 0s gracefully (no 404)
- No `ensureTable()` needed — tables created by existing routes

---

### File 2: `src/app/api/student/sessions/route.ts` — NEW

**What it does:**  
Returns the last 5 learning sessions for a student by name. Joins `learning_sessions` with `lumina_users` on `user_id = lumina_users.id`. Adds derived `status` and `priority` fields.

**Key logic:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name') ?? '';
  const db = getDb();

  const result = await db.execute({
    sql: `SELECT ls.id, ls.topic, ls.format, ls.turn_count, ls.last_active_at
          FROM learning_sessions ls
          LEFT JOIN lumina_users lu ON ls.user_id = lu.id
          WHERE lu.name = ?
          ORDER BY ls.last_active_at DESC
          LIMIT 5`,
    args: [name],
  });

  const sessions = result.rows.map((row) => ({
    id: row.id,
    topic: row.topic,
    format: row.format,
    turn_count: Number(row.turn_count ?? 0),
    last_active_at: row.last_active_at,
    status: Number(row.turn_count ?? 0) > 3 ? 'In Progress' : 'Pending',
    priority: Number(row.turn_count ?? 0) >= 5 ? 'High' : 'Medium',
  }));

  return NextResponse.json({ sessions });
}
```

**Notes:**
- Returns empty array `{ sessions: [] }` if no sessions found — UI handles gracefully
- `last_active_at` is ISO string from libsql — format client-side with `toLocaleDateString()`
- No auth required — name param is sufficient for hackathon scope

---

## Phase 2: OS Wiring

### File 3: `src/components/os/WindowManager.tsx` — MODIFY

**Changes:**

**3a. Extend `WindowId` type:**
```typescript
// BEFORE:
export type WindowId = 'questlearn' | 'teacher' | 'showcase'

// AFTER:
export type WindowId = 'questlearn' | 'teacher' | 'showcase' | 'student-dashboard'
```

**3b. Add to `INITIAL_WINDOWS` array:**
```typescript
{
  id: 'student-dashboard',
  title: 'My Dashboard',
  src: '/student-dashboard',         // name param injected at open-time via desktop/page.tsx
  open: false,
  minimised: false,
  zIndex: 10,
  position: { x: 80, y: 50 },
  size: { width: 1100, height: 700 },
},
```

**⚠️ Note for Kit:** The `src` here is the base path. The `name` URL param must be appended when opening from `desktop/page.tsx`. Two options:
- Option A (simpler): `src: '/student-dashboard'` — the page reads name from `localStorage` directly (already stored as `lumina_user`)
- Option B: Extend `WindowState` with a dynamic `src` and set it at open time in `desktop/page.tsx`

**Recommendation: Use Option A.** The student-dashboard page reads `localStorage.getItem('lumina_user')` and parses `.name` — same as the OS already does. This avoids changing the `WindowState` interface and keeps the OS wiring simple.

---

### File 4: `src/components/os/Dock.tsx` — MODIFY

**Change:** Add to `DOCK_APPS` array (before the separator, after `showcase`):
```typescript
const DOCK_APPS = [
  { id: 'questlearn' as const, icon: '🎓', label: 'QuestLearn', color: '#f59e0b' },
  { id: 'teacher' as const, icon: '📊', label: 'Teacher Hub', color: '#60a5fa' },
  { id: 'showcase' as const, icon: '🎬', label: 'Showcase', color: '#a78bfa' },
  { id: 'student-dashboard' as const, icon: '🏠', label: 'My Dashboard', color: '#34d399' },
]
```

**Change:** Update `handleAppClick` type signature:
```typescript
// BEFORE:
const handleAppClick = (id: 'questlearn' | 'teacher' | 'showcase') => {

// AFTER:
const handleAppClick = (id: WindowId) => {
```

**Add import:**
```typescript
import { WindowId, useWindowManager } from './WindowManager'
```

---

### File 5: `src/components/os/Desktop.tsx` — MODIFY

**Change:** Add a 4th `DesktopIcon` entry in the icons area:
```tsx
<DesktopIcon
  id="student-dashboard"
  icon="🏠"
  label="My Dashboard"
  defaultPosition={{ x: 0, y: 312 }}
  accentColor="#34d399"
/>
```

Place it after the `showcase` icon (y: 208 → next slot is y: 312 using 104px spacing).

---

### File 6: `src/app/desktop/page.tsx` — MODIFY

**Change:** After login completes, auto-open the student-dashboard window.

The `DesktopPage` component currently does not call `openWindow` on login. We need to:

1. Add `useWindowManager` import (already present via `WindowLayer`)
2. Use `openWindow` in a `useEffect` that fires when `phase` transitions to `'desktop'`

**Add inside `DesktopPage` component:**
```typescript
const openWindow = useWindowManager((s) => s.openWindow)

useEffect(() => {
  if (phase === 'desktop') {
    openWindow('student-dashboard')
  }
}, [phase, openWindow])
```

**⚠️ Note for Kit:** The `phase` effect already runs for returning users (localStorage skip) AND fresh logins. This means the dashboard opens in both paths — correct behaviour for a student OS.

**⚠️ Existing `useEffect` conflict check:** The current `useEffect` at top of `DesktopPage` reads localStorage and calls `setPhase('desktop')`. The new effect watching `phase` will fire after that. This is fine — Zustand `openWindow` is synchronous.

---

### File 7: `src/components/os/AppLauncher.tsx` — MODIFY

**Change:** Add to `LAUNCHER_APPS` in the "Live" section:
```typescript
{
  id: 'student-dashboard',
  icon: '🏠',
  label: 'My Dashboard',
  desc: 'Your learning overview',
  status: 'live' as const,
},
```

**Change:** Update the `onClick` handler in `AppItem` to handle `student-dashboard`:
```typescript
// BEFORE:
if (isLive && (app.id === 'questlearn' || app.id === 'teacher')) {
  openWindow(app.id as 'questlearn' | 'teacher')

// AFTER:
if (isLive && (app.id === 'questlearn' || app.id === 'teacher' || app.id === 'student-dashboard')) {
  openWindow(app.id as WindowId)
```

**Add import:**
```typescript
import { WindowId, useWindowManager } from './WindowManager'
```

---

## Phase 3: Student Dashboard Page

### File 8: `src/app/student-dashboard/layout.tsx` — NEW

Minimal layout — no nav bar, no shell chrome. The OS window provides the chrome.

**Pattern confirmed by reading `/learn/layout.tsx`:** that layout is just `<>{children}</>` — the root `app/layout.tsx` provides the `<html>`/`<body>` shell for ALL routes including iframed ones. Follow the same pattern:

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Dashboard — QuestLearn',
}

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
```

**⚠️ Note:** Do NOT add `<html>/<body>` here — the root `app/layout.tsx` already provides those. Adding them would create invalid nested HTML. The root layout's `<body>` styling is overridden by the page's own inline styles.

---

### File 9: `src/app/student-dashboard/page.tsx` — NEW

**Full self-contained student dashboard UI.** Reads name from localStorage. Fetches stats + sessions + active quest in parallel.

**Structure:**
```
<div className="flex h-screen" style={{background: '#0f172a'}}>
  <Sidebar />                    /* fixed left nav */
  <main className="flex-1 flex flex-col overflow-hidden">
    <TopGreeting name={name} />  /* Hello [Name] 👋 + date */
    <StatsRow stats={stats} />   /* 4 stat cards */
    <ContentArea>
      <UpcomingQuizzes />        /* left column */
      <OngoingIssues />          /* right column */
    </ContentArea>
  </main>
</div>
```

---

#### Detailed implementation:

```typescript
'use client'
import { useEffect, useState } from 'react'

// --- Types ---
interface StudentStats {
  name: string
  activeQuests: number
  completedSessions: number
  totalTurns: number
  progressPct: number
}

interface StudentSession {
  id: string
  topic: string
  format: string
  turn_count: number
  last_active_at: string
  status: 'In Progress' | 'Pending'
  priority: 'High' | 'Medium'
}

interface ActiveQuest {
  id: string
  teacher_name: string
  topic: string
  format: string
  message: string | null
  created_at: string
}

// --- Sidebar nav items ---
const NAV_ITEMS = [
  { icon: '🏠', label: 'Dashboard', active: true, comingSoon: false },
  { icon: '🧩', label: 'Quiz Rooms', active: false, comingSoon: true },
  { icon: '📚', label: 'Learn', active: false, comingSoon: false, action: 'learn' },
  { icon: '🗂️', label: 'Topics', active: false, comingSoon: true },
  { icon: '💬', label: 'Discussions', active: false, comingSoon: true },
]

// --- Component ---
export default function StudentDashboardPage() {
  const [name, setName] = useState<string>('')
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [sessions, setSessions] = useState<StudentSession[]>([])
  const [quest, setQuest] = useState<ActiveQuest | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lumina_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setName(parsed.name ?? '')
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (!name) return
    const encodedName = encodeURIComponent(name)

    Promise.all([
      fetch(`/api/student/stats?name=${encodedName}`).then(r => r.json()),
      fetch(`/api/student/sessions?name=${encodedName}`).then(r => r.json()),
      fetch('/api/teacher/quest').then(r => r.json()),
    ]).then(([statsData, sessionsData, questData]) => {
      setStats(statsData)
      setSessions(sessionsData.sessions ?? [])
      setQuest(questData.quest ?? null)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [name])

  // --- Learn nav handler: postMessage to parent OS ---
  const handleLearnClick = () => {
    try {
      window.parent.postMessage({ type: 'OPEN_WINDOW', windowId: 'questlearn' }, '*')
    } catch {
      window.open('/learn', '_blank')
    }
  }

  // Placeholder quiz cards when no active quest
  const PLACEHOLDER_QUIZZES = [
    { topic: 'Year 10 Biology', format: 'Quiz', teacher_name: 'Coming Soon', created_at: '' },
    { topic: 'Mathematics', format: 'Challenge', teacher_name: 'Coming Soon', created_at: '' },
  ]

  const today = new Date().toLocaleDateString('en-AU', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#0f172a', color: 'white', fontFamily: 'system-ui, sans-serif' }}
    >
      {/* === LEFT SIDEBAR === */}
      <aside
        className="flex flex-col gap-1 py-6 px-3"
        style={{
          width: '200px',
          minWidth: '200px',
          background: '#1e2d45',
          borderRight: '1px solid rgba(245,158,11,0.1)',
        }}
      >
        {/* Logo */}
        <div className="px-3 mb-6">
          <span className="text-xl font-bold" style={{ color: '#f59e0b' }}>🎓 QuestLearn</span>
        </div>

        {NAV_ITEMS.map((item) => (
          <div key={item.label} className="relative group">
            <button
              disabled={item.comingSoon}
              onClick={item.action === 'learn' ? handleLearnClick : undefined}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors"
              style={{
                background: item.active ? 'rgba(245,158,11,0.15)' : 'transparent',
                color: item.active ? '#f59e0b' : item.comingSoon ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                border: item.active ? '1px solid rgba(245,158,11,0.3)' : '1px solid transparent',
                cursor: item.comingSoon ? 'not-allowed' : 'pointer',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.comingSoon && (
                <span
                  className="ml-auto text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontSize: '9px' }}
                >
                  Soon
                </span>
              )}
            </button>
          </div>
        ))}

        {/* Bottom: student info */}
        <div className="mt-auto px-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Signed in as</p>
          <p className="text-sm font-medium text-white truncate">{name || '...'}</p>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top greeting bar */}
        <header
          className="flex items-center justify-between px-6 py-4"
          style={{
            background: 'rgba(30, 45, 69, 0.6)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(245,158,11,0.1)',
          }}
        >
          <div>
            <h1 className="text-xl font-semibold text-white">
              Hello {name || 'there'} 👋 <span style={{ color: '#f59e0b' }}>Welcome back</span>
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{today}</p>
          </div>
          {/* Progress indicator */}
          {stats && (
            <div className="flex items-center gap-2">
              <div
                className="rounded-full overflow-hidden"
                style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${stats.progressPct}%`, background: '#f59e0b' }}
                />
              </div>
              <span className="text-xs" style={{ color: '#f59e0b' }}>{stats.progressPct}%</span>
            </div>
          )}
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* === STATS ROW === */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              {
                label: 'Active Quests',
                value: loading ? '…' : String(stats?.activeQuests ?? 0),
                icon: '⚡',
                color: '#f59e0b',
              },
              {
                label: 'Upcoming Quizzes',
                value: quest ? '1' : '0',
                icon: '📋',
                color: '#60a5fa',
              },
              {
                label: 'Completed',
                value: loading ? '…' : String(stats?.completedSessions ?? 0),
                icon: '✅',
                color: '#34d399',
              },
              {
                label: 'Progress',
                value: loading ? '…' : `${stats?.progressPct ?? 0}%`,
                icon: '📈',
                color: '#a78bfa',
              },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-xl p-4"
                style={{
                  background: 'rgba(30, 45, 69, 0.8)',
                  border: `1px solid rgba(255,255,255,0.05)`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {card.label}
                  </span>
                  <span className="text-lg">{card.icon}</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* === TWO-COLUMN CONTENT === */}
          <div className="grid grid-cols-2 gap-6">

            {/* LEFT: Upcoming Quizzes */}
            <section>
              <h2 className="text-sm font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                📋 Upcoming Quizzes
              </h2>
              <div className="flex flex-col gap-3">
                {(quest ? [quest] : PLACEHOLDER_QUIZZES).map((q, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4"
                    style={{
                      background: 'rgba(30, 45, 69, 0.8)',
                      border: '1px solid rgba(245,158,11,0.15)',
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-white">{q.topic}</p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b' }}
                      >
                        {q.format}
                      </span>
                    </div>
                    <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {q.teacher_name === 'Coming Soon' ? '🔒 Coming soon' : `By ${q.teacher_name}`}
                    </p>
                    <button
                      disabled={q.teacher_name === 'Coming Soon'}
                      onClick={() => {
                        try {
                          window.parent.postMessage({ type: 'OPEN_WINDOW', windowId: 'questlearn' }, '*')
                        } catch { /* ignore */ }
                      }}
                      className="w-full py-1.5 rounded-lg text-sm font-medium transition-opacity"
                      style={{
                        background: q.teacher_name === 'Coming Soon'
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(245,158,11,0.9)',
                        color: q.teacher_name === 'Coming Soon' ? 'rgba(255,255,255,0.3)' : '#0f172a',
                        cursor: q.teacher_name === 'Coming Soon' ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {q.teacher_name === 'Coming Soon' ? 'Coming Soon' : 'Join Now →'}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* RIGHT: Ongoing Issues (learning sessions) */}
            <section>
              <h2 className="text-sm font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                🗂️ Ongoing Issues
              </h2>
              {loading ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-xl p-4 animate-pulse"
                      style={{ background: 'rgba(30,45,69,0.6)', height: '80px' }}
                    />
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <div
                  className="rounded-xl p-8 text-center"
                  style={{ background: 'rgba(30,45,69,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <p className="text-2xl mb-2">📚</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    No learning sessions yet.<br />
                    <span style={{ color: '#f59e0b' }}>Open QuestLearn to start!</span>
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="rounded-xl p-4"
                      style={{
                        background: 'rgba(30, 45, 69, 0.8)',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm font-medium text-white truncate mr-2">{session.topic}</p>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full shrink-0"
                          style={{
                            background: session.priority === 'High'
                              ? 'rgba(239,68,68,0.2)'
                              : 'rgba(245,158,11,0.2)',
                            color: session.priority === 'High' ? '#f87171' : '#f59e0b',
                          }}
                        >
                          {session.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: session.status === 'In Progress'
                              ? 'rgba(52,211,153,0.15)'
                              : 'rgba(148,163,184,0.15)',
                            color: session.status === 'In Progress' ? '#34d399' : '#94a3b8',
                          }}
                        >
                          {session.status}
                        </span>
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          {session.format}
                        </span>
                        <span className="text-xs ml-auto" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          {session.last_active_at
                            ? new Date(session.last_active_at).toLocaleDateString('en-AU', {
                                day: 'numeric', month: 'short',
                              })
                            : '—'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        </div>
      </main>
    </div>
  )
}
```

---

## Risk Flags

### ~~🔴 HIGH — Layout file collision~~ RESOLVED
`/learn/layout.tsx` confirmed as `<>{children}</>` — root layout provides `<html>/<body>` for all routes. Student-dashboard layout follows the same simple pattern. No collision risk. The iframed page receives a proper document shell via the root layout.

### 🟡 MEDIUM — `handleAppClick` type narrowing in Dock.tsx
`Dock.tsx` currently uses a hard-coded union type `'questlearn' | 'teacher' | 'showcase'` in `handleAppClick`. Changing to `WindowId` import from `WindowManager.tsx` is clean and correct, but Kit must ensure the import is added and the type cast is updated. If Kit forgets the import and just changes the string union, TypeScript will error.

### 🟡 MEDIUM — AppLauncher onClick cast
`AppLauncher.tsx` currently casts `app.id` to `'questlearn' | 'teacher'`. After adding student-dashboard, this cast must be updated to `WindowId` (imported from WindowManager). Kit must also import `WindowId`.

### 🟡 MEDIUM — Auto-open effect double-fire
The `useEffect` watching `phase === 'desktop'` in `desktop/page.tsx` will fire once when the phase first becomes `'desktop'`. Since `openWindow` is idempotent for a window that's already open (just re-focuses it), this is safe. However, if the user returns to the login screen and logs in again, it fires again — which is desired behaviour.

### 🟢 LOW — localStorage race condition
The dashboard page reads localStorage in a `useEffect`. Since this is client-only, there's no SSR race. However, if the page loads before the effect runs, `name` is empty string and the API calls don't fire. This is handled by the `if (!name) return` guard in the second `useEffect`. **No issue.**

### 🟢 LOW — `lumina_users` vs `ql_users`
The `sessions` API looks up students via `lumina_users.name`. This is correct for Lumina OS students (registered via `/api/auth/lumina-register`). Students who signed up via `ql_users` (different table) won't match. This is acceptable for hackathon scope — Lumina students are the target.

### 🟢 LOW — `window.parent.postMessage` in iframe
The `OPEN_WINDOW` postMessage to `window.parent` will only work if the OS (`desktop/page.tsx`) has a listener for it. The build plan currently does NOT add a `window.addEventListener('message', ...)` handler. This means the "Learn" nav item and "Join Now" button postMessage call will silently fail for now. The fallback `window.open('/learn', '_blank')` in the catch block will fire if postMessage throws, but postMessage itself never throws — it just sends to the parent.

**Mitigation (optional v1.1):** Add to `desktop/page.tsx`:
```typescript
useEffect(() => {
  const handler = (e: MessageEvent) => {
    if (e.data?.type === 'OPEN_WINDOW') {
      openWindow(e.data.windowId as WindowId)
    }
  }
  window.addEventListener('message', handler)
  return () => window.removeEventListener('message', handler)
}, [openWindow])
```
This is optional but recommended. Include it in Phase 2.

---

## Kit Instructions

### Build order
1. Phase 1 first (API routes) — they have no dependencies
2. Phase 2 (OS wiring) — depends only on `WindowId` type being updated first
3. Phase 3 (dashboard page + layout) — last, can reference API routes with correct types

### TypeScript check
```bash
cd /Users/loki/projects/questlearn
npm run build
# OR just type-check without building:
npx tsc --noEmit
```

### Dev test flow
```bash
npm run dev
# 1. Navigate to /desktop
# 2. Click through boot → login (use any Lumina-registered student name)
# 3. Confirm student-dashboard window auto-opens
# 4. Confirm Dock shows 🏠 My Dashboard icon
# 5. Confirm AppLauncher shows My Dashboard under "Available Now"
# 6. Confirm double-click on Desktop icon opens the window
# 7. In the dashboard: check stats load (may be 0s if no sessions for that name)
# 8. Check "Ongoing Issues" shows sessions or empty state
# 9. Check "Upcoming Quizzes" shows quest or placeholder cards
```

### API test (curl)
```bash
# Stats
curl "http://localhost:3000/api/student/stats?name=TestStudent"

# Sessions
curl "http://localhost:3000/api/student/sessions?name=TestStudent"

# Quest (existing, unchanged)
curl "http://localhost:3000/api/teacher/quest"
```

### Files to create/edit summary

| # | File | Action |
|---|------|--------|
| 1 | `src/app/api/student/stats/route.ts` | CREATE |
| 2 | `src/app/api/student/sessions/route.ts` | CREATE |
| 3 | `src/components/os/WindowManager.tsx` | EDIT — add `'student-dashboard'` to type + INITIAL_WINDOWS |
| 4 | `src/components/os/Dock.tsx` | EDIT — add dock app + fix type |
| 5 | `src/components/os/Desktop.tsx` | EDIT — add DesktopIcon |
| 6 | `src/app/desktop/page.tsx` | EDIT — auto-open effect + optional postMessage listener |
| 7 | `src/components/os/AppLauncher.tsx` | EDIT — add to LAUNCHER_APPS + fix onClick cast |
| 8 | `src/app/student-dashboard/layout.tsx` | CREATE |
| 9 | `src/app/student-dashboard/page.tsx` | CREATE |

---

*Firefly — Build Plan v1.0 — 2026-04-04*

---

## Phase 4: Topics Tab (Fast-follow — separate PR)

> Added post-Firefly based on Anusha's design input. NOT part of this PR — Kit builds this in PR #12 after the dashboard PR is merged.

### Overview
The Topics tab is the **self-directed learning launchpad**. Students browse topics, pick a creative format (Story, Puzzle, Meme, Game, Short Film), and jump straight into the Cogniti tutor with that combination pre-loaded.

### Layout
- **Row 1 — 🔥 Trending** (horizontal scroll, 3-4 cards)
  - Topics with highest combined `turn_count` across all `learning_sessions`
  - Card shows: topic name, student count, most-used format badge, "Start →"
  - Data from: `GET /api/topics/trending`

- **Rows 2+ — By Subject** (grouped grid)
  - Sections: Mathematics · Science · English · History · Geography · Technology
  - Each topic card shows: topic name, subject tag, student count
  - **Inline format picker**: `📖 Story` `🧩 Puzzle` `😂 Meme` `🎮 Game` `🎬 Short Film`
  - Selected format highlights amber → "Start Learning →" button activates
  - On click: `window.parent.postMessage({ type: 'OPEN_WINDOW', windowId: 'questlearn', topic, format }, '*')`
  - Data from: `GET /api/topics/by-subject`

### New API routes needed
- `GET /api/topics/trending` — `SELECT topic, format, COUNT(*) as student_count, SUM(turn_count) as total_turns FROM learning_sessions GROUP BY topic ORDER BY total_turns DESC LIMIT 6`
- `GET /api/topics/by-subject` — returns a static subject taxonomy seeded with common Australian Curriculum v9 topics, enriched with `student_count` from `learning_sessions` where available

### Topics tab activation
- Remove "Soon" badge from Topics nav item in sidebar
- Render `<TopicsView />` when Topics is selected (tab state inside the dashboard page)
- Dashboard tab remains the default view

