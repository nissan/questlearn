# BUILD_PLAN.md — QuestLearn Bug Fixes (3 Bugs)
**Prepared by:** Firefly (analysis agent)
**Target:** Kit (implementation)
**Codebase:** `/Users/loki/projects/questlearn`
**Post-PR #27 (mini-apps grid, merged)**
**Date:** 2026-04-05

---

## Architecture Snapshot (Current Flow)

```
Teacher Dashboard (/teacher)
  └── TodaysQuest.tsx
        └── POST /api/teacher/quest → teacher_quests table
              (no grade_level column)

Student Dashboard (/student-dashboard)
  └── fetches GET /api/teacher/quest (no grade filter)
        → returns latest active quest to ALL students
  └── TopicsView.tsx
        └── GET /api/topics/by-subject → static topic list (no grade filter)
        └── GET /api/topics/trending → all learning_sessions (no grade filter)

Learn Page (/learn)
  └── LearnContent.tsx
        └── POST /api/learn/session → learning_sessions (topic + format stored ✅)
        └── POST /api/learn/generate → content_cache (format-aware ✅)
        └── handleSend() → POST /api/learn/socratic
              ⚠️ sends: learningSessionId, studentResponse, turnIndex
              ✗ MISSING: topic, format, yearLevel, history
              → engagement_events table (no format column)
              → learning_sessions.turn_count += 1

Teacher Heatmap
  └── GET /api/teacher/heatmap
        → queries learning_sessions GROUP BY topic, format
        → formats hardcoded: ['game','story','meme','puzzle','short_film']

DB Tables:
  lumina_users: id, name, role, school_name, year_level ← grade lives here ✅
  teacher_quests: id, teacher_name, topic, format, message, active ← NO grade_level ❌
  learning_sessions: id, user_id, topic, format, turn_count
  engagement_events: id, learning_session_id, user_id, turn_index, student_response, ai_followup ← NO format ❌
```

---

## Bug Analysis

### Bug 1 + 2: Grade-Level Quest Access Control + Student Quest Visibility Filtering

> These two bugs share the same root cause and the same fix.

**Root Cause:**
The `teacher_quests` table has no `grade_level` column. Teachers have no way to target a quest at a specific year level. The `GET /api/teacher/quest` API returns the most recent active quest to every caller — no filtering by grade. Students are identified in `lumina_users.year_level` (e.g. `"Year 9"`) but this field is **never consulted** when fetching or displaying quests.

**Trace:**
1. `TodaysQuest.tsx` form → POSTs `{ teacher_name, topic, format, message }` — no `grade_level` field
2. `teacher_quests` table — no `grade_level` column
3. `GET /api/teacher/quest` — `SELECT * FROM teacher_quests WHERE active=1 ORDER BY created_at DESC LIMIT 1` — returns to anyone
4. `StudentDashboardPage` — calls `GET /api/teacher/quest` without passing student's year level

**Schema gap:** `teacher_quests` needs `grade_level TEXT` column.

**Filter gap:** `GET /api/teacher/quest?grade=Year+9` must filter by grade. Students must pass their stored `year_level` when fetching.

**UI gap:** `TodaysQuest.tsx` needs a grade level dropdown (Year 7–12).

**Scope:** 3 files + 1 DB migration (additive column, safe).

---

### Bug 3: Puzzle Engagement Not Tracked Correctly

**Root Cause:** `LearnContent.handleSend()` does **not** send `format`, `topic`, `yearLevel`, or `history` to `/api/learn/socratic`. The socratic route receives `undefined` for these and defaults to `format='story'`, `topic='this topic'`. This means:

1. Puzzle sessions generate **story-style** socratic followups → weak puzzle learning experience
2. Students get generic, untailored responses → they disengage → `turn_count` stays 0 for puzzle sessions
3. The heatmap shows puzzle columns empty (0 turns) while meme shows real data because the meme experience is better (MemeCard UI is polished)

**Secondary issue:** `engagement_events` has no `format` column. Even when engagement IS recorded, the teacher can't query "show me puzzle engagement" without JOINing to `learning_sessions`. Not a blocking bug, but a data quality issue.

**Trace:**
```ts
// LearnContent.tsx handleSend() — current (BROKEN)
body: JSON.stringify({
    learningSessionId,
    studentResponse: msg,
    turnIndex: chat.filter(m => m.role === 'student').length,
    // ← topic, format, yearLevel, history MISSING
}),

// /api/learn/socratic — receives these as undefined
const { ..., topic, format, yearLevel, history } = await req.json();
fn: async () => generateSocratic(
    topic ?? 'this topic',   // ← falls back to this
    format ?? 'story',       // ← falls back to 'story' even for puzzle!
    yearLevel ?? 'Year 9',
    history ?? [],
    turnIndex ?? 0
),
```

**Fix:** Pass `topic`, `format`, `yearLevel` from `LearnContent` state into the `handleSend` POST body.

**Scope:** 1 file fix (`LearnContent.tsx`) + optional: add `format` column to `engagement_events` for richer teacher analytics.

---

## Implementation Plan

### Phase A — DB Schema (migration, safe/additive)

**File:** `src/lib/schema.ts`

Changes:
1. Add `grade_level TEXT` to `teacher_quests` CREATE TABLE
2. Add `grade_level TEXT` to `engagement_events` CREATE TABLE (optional but recommended — stores format at event time)

**Note:** Both are additive columns with no NOT NULL constraint → backward-compatible. Existing rows will have NULL; that's fine.

```sql
-- teacher_quests: add grade_level
ALTER TABLE teacher_quests ADD COLUMN grade_level TEXT;

-- engagement_events: add format (optional analytics improvement)  
ALTER TABLE engagement_events ADD COLUMN format TEXT;
```

The `ensureTable()` pattern in `teacher/quest/route.ts` handles this idempotently on first run.

---

### Phase B — Quest Grade Assignment + Filtering (Bugs 1 & 2)

**Files touched: 3**

#### B1. `src/app/api/teacher/quest/route.ts`

- **POST handler:** Accept `grade_level` in request body. Insert into DB.
- **GET handler:** Accept optional `?grade=Year+9` query param. If provided, filter: `WHERE active=1 AND (grade_level IS NULL OR grade_level = ?)`. Null-grade quests are "all grades" — broadcast to everyone.

```ts
// GET — add grade filter
const grade = req.nextUrl.searchParams.get('grade');
const sql = grade
  ? `SELECT * FROM teacher_quests WHERE active=1 AND (grade_level IS NULL OR grade_level=?) ORDER BY created_at DESC LIMIT 1`
  : `SELECT * FROM teacher_quests WHERE active=1 ORDER BY created_at DESC LIMIT 1`;
const args = grade ? [grade] : [];

// POST — accept grade_level
const { teacher_name, topic, format, message, grade_level } = body;
// INSERT: add grade_level to VALUES
```

#### B2. `src/components/teacher/TodaysQuest.tsx`

- Add `gradeLevel` state (default: `''` = all grades)
- Add `<select>` dropdown: `All Grades | Year 7 | Year 8 | Year 9 | Year 10 | Year 11 | Year 12`
- Pass `grade_level: gradeLevel || null` in POST body

#### B3. `src/app/student-dashboard/page.tsx`

- Read student's `year_level` from `lumina_user` in localStorage (already parsed)
- Pass it when fetching quest: `fetch(\`/api/teacher/quest?grade=${encodeURIComponent(yearLevel)}\`)`
- Also pass from `QuestBanner.tsx` if used in `/learn` page

**Bonus:** `src/components/learn/QuestBanner.tsx` — same pattern. Read localStorage, pass grade in fetch. (Same file structure, minor change.)

---

### Phase C — Puzzle Engagement Fix (Bug 3)

**Files touched: 1 core fix, 1 optional**

#### C1. `src/components/learn/LearnContent.tsx` — CRITICAL FIX

In `handleSend()`, add the missing fields to the POST body:

```ts
body: JSON.stringify({
    learningSessionId,
    studentResponse: msg,
    turnIndex: chat.filter(m => m.role === 'student').length,
    topic,           // ← ADD THIS
    format,          // ← ADD THIS  
    yearLevel: 'Year 9',  // ← ADD THIS (hardcoded for now; will be dynamic once grade_level flows through)
    history: chat.map(m => ({ role: m.role, text: m.text })),  // ← ADD THIS
}),
```

This makes the socratic route use the correct format (`'puzzle'`) when generating followup questions, ensuring puzzle-specific prompting works.

#### C2. `src/app/api/learn/socratic/route.ts` — OPTIONAL analytics improvement

Add `format` to the `engagement_events` INSERT so teachers can filter engagement by format without JOINs:

```ts
await db.execute({
    sql: `INSERT INTO engagement_events (id, learning_session_id, user_id, turn_index, student_response, ai_followup, format, timestamp) 
          VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    args: [uuidv4(), learningSessionId, session.userId, turnIndex, studentResponse, followUp.followUp, format ?? null],
});
```

---

## File Manifest

| File | Change | Phase | Risk |
|------|--------|-------|------|
| `src/lib/schema.ts` | Add `grade_level` to teacher_quests; add `format` to engagement_events | A | Low — additive only |
| `src/app/api/teacher/quest/route.ts` | Accept + store `grade_level` in POST; filter by grade in GET | B | Low |
| `src/components/teacher/TodaysQuest.tsx` | Add grade dropdown to form | B | Low |
| `src/app/student-dashboard/page.tsx` | Pass `?grade=` when fetching quest | B | Low |
| `src/components/learn/QuestBanner.tsx` | Pass `?grade=` when fetching quest | B | Low |
| `src/components/learn/LearnContent.tsx` | Pass `topic`, `format`, `yearLevel`, `history` in handleSend | C | Low |
| `src/app/api/learn/socratic/route.ts` | Store `format` in engagement_events (optional) | C | Low |

**Total: 7 files, 3 phases, no breaking changes.**

---

## Complexity Assessment

| Dimension | Score |
|-----------|-------|
| Files changed | 7 (medium) |
| DB schema changes | 2 additive columns (safe) |
| New API routes | 0 |
| Breaking changes | 0 |
| New dependencies | 0 |
| Total estimated dev time | ~2–3 hours |

**Verdict:** Medium complexity. All changes are additive or small fixes. No new routes, no auth changes, no new dependencies. Safe to ship in a single PR.

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Existing quests have NULL grade_level | GET filter: `(grade_level IS NULL OR grade_level = ?)` — NULLs are treated as "all grades", so old quests broadcast to everyone until teacher reassigns |
| Students without year_level in localStorage | Fall back to unfiltered fetch: if `yearLevel` is empty string, omit `?grade=` param |
| Socratic route breaking if format/topic undefined | Existing defaults (`?? 'story'`, `?? 'this topic'`) are still there as last-resort fallback |
| Schema migration on existing DB | `ALTER TABLE ADD COLUMN` is safe in SQLite/Turso with no NOT NULL constraint |
| Puzzle engagement historically untracked | No recovery of historical data needed; fix is forward-only |

---

## Dispatch Order for Kit

```
Phase A first (schema) → Phase B (grade filtering) → Phase C (engagement fix)
Phases B and C can be done in parallel after A.
```

**Test checklist:**
- [ ] Teacher can set quest with "Year 9" grade level
- [ ] Grade 9 student sees Grade 9 quest; Grade 10 student sees Grade 10 quest (or "all grades" quest)
- [ ] Quest set for "All Grades" (blank) shows to all students
- [ ] Student doing puzzle format: socratic followup is puzzle-style (mentions "hint", "clue", not story narrative)
- [ ] Heatmap shows non-zero puzzle turns after a student completes a puzzle session
- [ ] `engagement_events.format` column populated for new events (Phase C optional)

---

*No Anusha branch found in remote — no conflict risk. All changes are on clean main post-PR #27.*
