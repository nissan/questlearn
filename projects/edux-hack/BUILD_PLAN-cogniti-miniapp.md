# BUILD PLAN: Cogniti Mini App Integration
**Project:** QuestLearn × Cogniti Flashcards  
**Deadline:** April 8, 2026  
**Author:** Firefly — 2026-04-04  
**BDD spec:** `features/cogniti-mini-app.feature`, `features/cogniti-telemetry.feature`

---

## Constraints (global)
- ❌ No new DB tables — telemetry comes from Cogniti's API, not our LibSQL DB
- ❌ No breaking existing tests (formats.ts, LearnContent, teacher heatmap must pass green)
- ✅ New env vars are fine (server-side: `COGNITI_API_TOKEN`, `COGNITI_MINIAPP_ID`; client-side: `NEXT_PUBLIC_COGNITI_MINIAPP_URL`)
- ✅ Format type change is backward-compatible (flashcards tab added, not replacing anything)
- ⏱ Scope is 4 phases, realistic for April 8 solo or pair effort

---

## Phase A: Cogniti Mini App Creation

### Can we create a mini app via API?
**Status: TBD — needs verification.**

The Cogniti API endpoint `POST /api/v1/interactives/` _exists_ but creation capability via API is unconfirmed. We have the Socratic Tutor agent already created; mini apps ("interactives") may require the visual builder.

**Action required (Kit or Nissan to verify before Phase B):**

1. Test: `curl -X POST https://app.cogniti.ai/api/v1/interactives/ -H "Authorization: Bearer $COGNITI_API_TOKEN" -H "Content-Type: application/json" -d '{"name":"QuestLearn Flashcards"}'`
2. If 201 returned with `id` → proceed programmatically (Kit writes a setup script)
3. If 403/405 → **manual step required**: Create mini app in the Cogniti web builder at `app.cogniti.ai`, configure:
   - Enable AI functions (for "Check my answer" critique)
   - Enable telemetry events: `card_flipped`, `answer_submitted`, `confidence_rated`
   - Note the mini app `id` and embed URL
   - Paste `id` into env var `COGNITI_MINIAPP_ID`
   - Paste embed URL into env var `NEXT_PUBLIC_COGNITI_MINIAPP_URL`

### Files changed in Phase A
| File | Change |
|------|--------|
| `.env.local` (not committed) | Add `COGNITI_MINIAPP_ID`, `NEXT_PUBLIC_COGNITI_MINIAPP_URL`, `COGNITI_API_TOKEN` |
| `.env.example` | Document new vars (no values) |
| `scripts/create-cogniti-miniapp.ts` | Optional setup script if API creation works |

### Success criteria
- ✅ Cogniti mini app exists and is accessible at an embed URL
- ✅ Mini app is configured with AI critique + telemetry events
- ✅ Three env vars are populated in Vercel and `.env.local`
- ✅ Curl to `GET /api/v1/interactives/{id}/telemetry/` returns 200

---

## Phase B: Frontend Embed (Student-Facing)

**Firefly gate: YES** — touches `formats.ts` + `LearnContent.tsx` + new component (>1 file, BDD spec required ✅)

### Changes

#### `src/lib/formats.ts`
Add flashcards as a 6th entry (non-breaking — existing `FormatId` type widens via `as const`):
```ts
{ id: 'flashcards', label: 'Flashcards', icon: '🃏', description: 'Test your recall with AI-powered flashcards' }
```
⚠️ Check: any switch/case on FormatId in the codebase must handle `'flashcards'` (likely the learn API route).

#### `src/components/learn/CognitiFlashcards.tsx` *(new file)*
Encapsulates the iframe panel:
- Props: `topic: string`
- Reads `NEXT_PUBLIC_COGNITI_MINIAPP_URL` from env
- Appends `?topic={encodeURIComponent(topic)}` to URL
- Handles `onLoad` → hide skeleton; `onError` → show error + retry
- Listens for `window.message` events: `cogniti:ready` → postMessage back `{type: 'cogniti:context', topic}`
- Graceful degradation if env var missing

#### `src/components/learn/LearnContent.tsx`
- Import `CognitiFlashcards`
- Add `'flashcards'` to format list rendering logic
- When `format === 'flashcards'`: render `<CognitiFlashcards topic={topic} />` in the right panel (same position as Cogniti tutor iframe tab)
- Keep existing CurricuLLM / Cogniti tutor tabs untouched

#### `src/app/api/learn/session/route.ts` *(check only)*
- If format is validated against a whitelist, add `'flashcards'`
- If free-form string, no change needed

### Files changed in Phase B
| File | Change |
|------|--------|
| `src/lib/formats.ts` | Add flashcards entry |
| `src/components/learn/CognitiFlashcards.tsx` | New component |
| `src/components/learn/LearnContent.tsx` | Import + render flashcards branch |
| `src/app/api/learn/session/route.ts` | Add 'flashcards' to format whitelist (if needed) |

### Success criteria
- ✅ Flashcards tab appears in the format selector
- ✅ Clicking it renders `<iframe title="Cogniti Flashcards" src="...?topic=...">` in the DOM
- ✅ Switching away hides the iframe, shows normal format content
- ✅ No TypeScript errors; `npm run build` passes
- ✅ Existing format tabs (game, story, meme, puzzle, short_film) unchanged

---

## Phase C: Telemetry API Route + Teacher Heatmap

**Firefly gate: YES** — new API route + teacher page update (>3 files changed, BDD spec required ✅)

### Changes

#### `src/app/api/cogniti/telemetry/route.ts` *(new file)*
- `GET` handler, auth-gated (check session)
- Fetch `GET https://app.cogniti.ai/api/v1/interactives/{COGNITI_MINIAPP_ID}/telemetry/`
- Auth: `Authorization: Bearer ${COGNITI_API_TOKEN}`
- Aggregate raw events into:
  ```ts
  {
    topTopics: { topic, cardFlips, sessions }[],    // sorted desc by cardFlips, top 10
    avgConfidence: { topic, avgRating }[],            // 1dp
    answerAccuracy: { topic, correctCount, totalCount, pct }[], // sorted asc by pct
    fetchedAt: string // ISO 8601
  }
  ```
- On Cogniti error: return 503 `{ error: 'Cogniti API unavailable' }`
- No caching for now (refresh on page load is sufficient per spec)

#### `src/components/teacher/CognitiEngagement.tsx` *(new file)*
Client component. Fetches `/api/cogniti/telemetry` on mount. Renders three sub-panels:
- **Top Topics**: ranked table (topic, flips)
- **Avg Confidence**: table with colour indicator (red/yellow/green)
- **Answer Accuracy**: table sorted asc by pct, ⚠️ warning below 50%

#### `src/app/teacher/page.tsx`
- Import `CognitiEngagement`
- Render `<CognitiEngagement />` below the existing heatmap grid
- No structural changes to existing heatmap code

### Files changed in Phase C
| File | Change |
|------|--------|
| `src/app/api/cogniti/telemetry/route.ts` | New API route |
| `src/components/teacher/CognitiEngagement.tsx` | New UI component |
| `src/app/teacher/page.tsx` | Add CognitiEngagement below heatmap |

### Success criteria
- ✅ `GET /api/cogniti/telemetry` returns 200 with correct shape (verified via curl or test)
- ✅ Teacher page renders "Cogniti Engagement" heading and all 3 panels
- ✅ Empty state ("No flashcard activity yet") shown if no data
- ✅ 503 returned if Cogniti is unreachable
- ✅ Existing teacher heatmap tests pass green

---

## Phase D: Playwright Smoke Tests

**Firefly gate: YES** — touches test infra, mocks, 2+ new test files

### Changes

#### `e2e/cogniti-flashcards.spec.ts` *(new file)*
- Mock: intercept iframe navigation (Playwright `page.route`) to avoid real Cogniti load
- Mock: `GET /api/cogniti/telemetry` returns fixture from `e2e/fixtures/cogniti-telemetry.json`
- Test 1: Student flow — navigate to `/learn?topic=Photosynthesis&format=story` → click Flashcards tab → assert iframe visible with correct src params
- Test 2: No console errors during Flashcards tab switch

#### `e2e/teacher-cogniti.spec.ts` *(new file)*
- Mock: `GET /api/cogniti/telemetry` returns `e2e/fixtures/cogniti-telemetry.json`
- Test 1: Navigate to `/teacher` → assert "Cogniti Engagement" heading visible
- Test 2: Assert "Photosynthesis" appears in Cogniti Engagement section
- Test 3: Assert no real outbound calls to `app.cogniti.ai`

#### `e2e/fixtures/cogniti-telemetry.json` *(new file)*
Static fixture with realistic data matching the API response shape.

#### `playwright.config.ts` *(check only)*
- Verify `baseURL` is set; no structural changes expected

### Files changed in Phase D
| File | Change |
|------|--------|
| `e2e/cogniti-flashcards.spec.ts` | New smoke test |
| `e2e/teacher-cogniti.spec.ts` | New smoke test |
| `e2e/fixtures/cogniti-telemetry.json` | New fixture file |

### Success criteria
- ✅ `npx playwright test e2e/cogniti-flashcards.spec.ts` passes
- ✅ `npx playwright test e2e/teacher-cogniti.spec.ts` passes
- ✅ No real calls to `app.cogniti.ai` during test runs
- ✅ Existing Playwright tests (if any) continue to pass

---

## Execution Order

```
Phase A (manual or script) → Phase B (Kit) → Phase C (Kit) → Phase D (Kit)
                                              ↑ depends on Phase A env vars
```

- Phase A must be verified/completed before Phase B can use the env vars
- Phase B and Phase C are independent and can be built in parallel if needed
- Phase D depends on both B and C being deployed (or at least built locally)

## Total file count
| Phase | New files | Modified files |
|-------|-----------|----------------|
| A     | 1 (optional script) | 1 (.env.example) |
| B     | 1 (CognitiFlashcards.tsx) | 2–3 (formats.ts, LearnContent.tsx, maybe session route) |
| C     | 2 (telemetry route, CognitiEngagement.tsx) | 1 (teacher page) |
| D     | 3 (2 specs, 1 fixture) | 0–1 (playwright.config check) |
| **Total** | **7** | **4–5** |

All phases individually satisfy the Firefly/BDD gate (>3 files or new API routes). ✅
