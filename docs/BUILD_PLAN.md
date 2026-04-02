# BUILD_PLAN — QuestLearn
_Author: Firefly | Date: 2026-04-02 | Total estimated effort: ~38h across 2 people_

---

## Deliverable

A working web prototype of QuestLearn — an AI-powered adaptive learning format selector for Years 8–10 students — suitable for a live demo at Cambridge EduX Hackathon 2026, Demo Day April 9 @ UTS.

**Minimum demo-ready state:** Student can pick a topic + format, receive CurricuLLM-generated content, and complete at least 2 Socratic follow-up exchanges. Teacher dashboard shows a heatmap (live or seeded data). App is deployed to a public URL.

---

## Stack

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS | Fast, deployable on Vercel in 1 click; team familiar; AI vibe-coding friendly |
| Backend API | Next.js API routes (serverless) | No separate server needed; CurricuLLM calls are simple HTTP; avoids infra complexity |
| AI — content gen | CurricuLLM API (`CurricuLLM-AU` model) | Australian Curriculum v9 native, OpenAI-compatible drop-in |
| AI — Socratic loop | CurricuLLM API (same key, same model) | Native curriculum grounding + K-12 safe; **Cogniti not needed** (see note below) |
| Session data store | In-memory Map + optional Vercel KV | Teacher heatmap aggregation; no persistent student identity |
| Deployment | Vercel (free hobby tier) | Zero-config Next.js deploy; public URL in <5 min |
| Mocks/fallbacks | Static JSON content cards | Backup if API credits run low during demo |
| Prototype reference | `projects/edux-hack/questlearn-prototype.html` | Existing clickable mockup; Anusha's source of truth for UI |

### Cogniti Decision
**Verdict: Skip Cogniti.** CurricuLLM native is better for this build because:
- Cogniti has no REST API — can't inject dynamic topic/format at request time
- Would require building one agent per format (5+ agents) and iframe-switching per selection
- No conversation data flows back into our teacher heatmap if Cogniti hosts the chat
- CurricuLLM handles everything Cogniti would add (Socratic prompting, K-12 safety, curriculum grounding) natively

**Cogniti is only worth adding if:** we want to demo "teacher-created AI agents" as a separate pitch narrative. Not recommended for the 7-day window.

---

## Success Criteria

1. ✅ Student can type a topic, pick a year level, pick a format — receive generated content within 15s
2. ✅ All 5 formats (Game, Story, Meme, Puzzle, Short Film) produce visually distinct rendered output
3. ✅ Socratic loop runs for at least 2 exchanges without revealing the direct answer
4. ✅ Wrong answers receive encouragement text, never a fail state
5. ✅ Teacher dashboard shows topic × format heatmap with real session data
6. ✅ No student PII stored — heatmap data is aggregated counts only
7. ✅ App deployed on public URL, accessible from judges' laptops/phones
8. ✅ Demo video (2–3 min) recorded and uploaded by April 8 11:59 PM
9. ✅ Pitch deck (4 min) ready with Laurillard framework mapped to QuestLearn formats

---

## Risk Flags

| # | Risk | Likelihood | Mitigation |
|---|---|---|---|
| R1 | **CurricuLLM API key not received before build starts** | Medium — registration via MS Forms, not instant | Nissan registers NOW; build Phase 1 with mock responses so Anusha can still build UI in parallel |
| R2 | **API credits ($15 ≈ 1,200 calls) exhausted during testing** | Medium — easy to burn in dev | Add `NEXT_PUBLIC_USE_MOCK=true` env flag from Day 1; pre-generate static fallback cards for all 5 formats before demo |
| R3 | **Content generation latency >10s causes poor demo** | Low-Medium — CurricuLLM speed unknown | Add streaming (SSE/ReadableStream) in Phase 3; test latency in Phase 1; have pre-cached demo responses ready |
| R4 | **Anusha + Nissan working on same files causes merge conflicts** | Low — clear split: Anusha owns `app/` UI, Nissan owns `app/api/` + lib | Agree on file ownership day 1; use feature branches; merge at phase boundaries |
| R5 | **Meme format requires image generation (not text)** | Medium — meme ≠ text-only | Scope Meme as: AI-generated caption + relatable text overlay on a template image. No image gen API needed. |

---

## Phase Map (Calendar View)

```
Thu Apr 2    Fri Apr 3    Sat Apr 4    Sun Apr 5    Mon Apr 6    Tue Apr 7    Wed Apr 8
[Phase 1]    [Phase 2A]   [Phase 3]    [Phase 4]    [Phase 5]    [Phase 6]    SUBMIT
             [Phase 2B]   (parallel)
```

---

## Phases

---

### Phase 1 — Scaffold + CurricuLLM Integration Test
_Owner: Nissan_

**Inputs:**
- This BUILD_PLAN.md
- CurricuLLM API key (from https://console.curricullm.com/)
- `questlearn-prototype.html` (reference for route/component naming)

**Task:**
Scaffold a Next.js 14 project with TypeScript + Tailwind. Wire up the CurricuLLM API in a single test route. Confirm a round-trip content generation call works. Set up mock mode toggle. Deploy skeleton to Vercel.

```
Scaffold checklist:
- npx create-next-app@latest questlearn --typescript --tailwind --app
- app/page.tsx — home/topic screen (stub, Anusha fills in Phase 2B)
- app/learn/page.tsx — format selector + content display (stub)
- app/teacher/page.tsx — teacher dashboard (stub)
- app/api/generate/route.ts — CurricuLLM content generation endpoint
- app/api/socratic/route.ts — Socratic follow-up endpoint
- app/api/session/route.ts — POST session event (aggregation store)
- lib/curricullm.ts — CurricuLLM client wrapper
- lib/prompts.ts — all system prompts (5 formats + Socratic + teacher)
- lib/store.ts — in-memory session aggregation (Map<topic, Map<format, count>>)
- lib/mock-content.ts — static fallback cards for all 5 formats
- .env.local — CURRICULLM_API_KEY, USE_MOCK
```

**task_type:** `boilerplate_floor` + `code_generation`

**Deliverable:**
- Repo on GitHub (Nissan's account, add Anusha as collaborator)
- `GET /api/generate?topic=photosynthesis&format=story&year=9` returns valid CurricuLLM content
- Vercel preview URL live

**Acceptance criteria:**
- [ ] CurricuLLM test call succeeds with real key (or mock mode works with flag)
- [ ] All route stubs return 200 with placeholder JSON
- [ ] `USE_MOCK=true` returns static content without hitting API
- [ ] Vercel deploy green

**Parallel with:** Phase 2B (Anusha can start UI components once repo is live)

**QA gate:** no (integration check only — Nissan eyeballs response)

**Belle needed:** no

**Est. time:** 3h (Nissan)

**Depends on:** CurricuLLM API key received; GitHub repo created

**Cogniti note:** Not used in this phase or this project.

---

### Phase 2A — Content Generation for All 5 Formats
_Owner: Nissan_

**Inputs:**
- Phase 1 scaffold (repo live, `lib/curricullm.ts` working)
- `lib/prompts.ts` stub
- CURRICULLM-SPEC.md (prompts defined, see below)

**Task:**
Implement the `/api/generate` route to handle all 5 format types. Each format gets a distinct system prompt that shapes the output structure. Define and return a typed `ContentCard` response that the frontend can render.

```typescript
// ContentCard schema — return this from /api/generate
type ContentCard = {
  format: 'game' | 'story' | 'meme' | 'puzzle' | 'short-film';
  topic: string;
  yearLevel: string;
  title: string;
  body: string;           // main generated content (markdown OK)
  socraticPrompt: string; // opening question to student
  curriculumRef: string;  // AC v9 outcome descriptor
  isMock: boolean;
}
```

Each format needs a pre-written system prompt in `lib/prompts.ts` (see CURRICULLM-SPEC.md for full prompts). Test each format manually with 2–3 topics before marking done.

**task_type:** `code_generation` + `structured_json`

**Deliverable:**
- `/api/generate` handles all 5 formats and returns `ContentCard`
- `lib/prompts.ts` has all 5 system prompts
- `lib/mock-content.ts` has one static `ContentCard` per format (for demo fallback)
- Manual test log: 5 topics × 5 formats = 25 combinations attempted (sample 5–10 for quality)

**Acceptance criteria:**
- [ ] All 5 formats return structured `ContentCard` without 500 errors
- [ ] Each card contains a `socraticPrompt` that is a genuine question (not a statement)
- [ ] `curriculumRef` is non-empty for at least 3/5 formats
- [ ] Mock mode returns cards matching the same schema

**Parallel with:** Phase 2B

**QA gate:** no (Nissan spot-checks output quality)

**Belle needed:** no

**Est. time:** 3–4h (Nissan)

**Depends on:** Phase 1 complete

---

### Phase 2B — Student UI Shell (Topic Picker + Format Selector)
_Owner: Anusha_

**Inputs:**
- `questlearn-prototype.html` (exact reference for visual design)
- Phase 1 repo (Vercel preview URL)
- Design tokens from prototype: navy `#0f172a`, amber `#f59e0b`, green `#22c55e`

**Task:**
Build the two student-facing screens in `app/page.tsx` (topic entry) and `app/learn/page.tsx` (format selector + content display placeholder). Match the prototype's split-pane dark-navy aesthetic. Use Tailwind. No API wiring yet — hardcode a sample `ContentCard` to confirm layout renders.

```
Screens to build:
1. Home screen (app/page.tsx)
   - QuestLearn wordmark / tagline
   - Free-text topic input ("What are you stuck on?")
   - Year level selector (Year 8 / 9 / 10)
   - "Let's Go" CTA button
   - Validation: empty topic → inline error

2. Format selector (app/learn/page.tsx — Step 1)
   - 5 format tiles: Game / Story / Meme / Puzzle / Short Film
   - Each tile: icon + format name + 1-line description
   - Selected state (amber highlight)
   - "Generate" button → navigates to content display

3. Content display (app/learn/page.tsx — Step 2)
   - Loading skeleton while API is called
   - ContentCard rendered (title, body as markdown, curriculum ref badge)
   - Socratic prompt box at the bottom
   - Student reply input field
```

**task_type:** `code_generation` (UI/React)

**Deliverable:**
- Both screens render correctly in browser
- Format selector shows all 5 tiles with icons
- Content display renders a hardcoded `ContentCard`
- Responsive at 375px (mobile) and 1024px (desktop)

**Acceptance criteria:**
- [ ] No competitive language anywhere on screen (no "score", "rank", "leaderboard")
- [ ] "Wrong" path shows encouragement, not failure (validate in stub content)
- [ ] All 5 format tiles are present and selectable
- [ ] Loading state is visible during simulated delay
- [ ] Matches prototype colour palette and layout spirit

**Parallel with:** Phase 2A

**QA gate:** no (Anusha + Nissan eyeball together at end of day)

**Belle needed:** no (existing prototype is the design spec; Anusha owns implementation)

**Est. time:** 3–4h (Anusha)

**Depends on:** Phase 1 repo live on Vercel

---

### Phase 3 — Socratic Feedback Loop
_Owner: Nissan (backend) + Anusha (UI wiring)_

**Inputs:**
- Phase 2A: `/api/generate` working, `ContentCard` defined
- Phase 2B: Content display screen with student reply input
- `lib/prompts.ts`: Socratic system prompt (see CURRICULLM-SPEC.md)

**Task:**
Implement the `/api/socratic` endpoint + wire up the frontend reply input to it. The loop:
1. Student reads generated content + opening `socraticPrompt`
2. Student types reply → POST `/api/socratic` with `{topic, format, year, history: Message[]}`
3. CurricuLLM returns a follow-up question (never the direct answer)
4. Repeat up to 3 exchanges, then surface a summary card

Backend: multi-turn conversation history must be maintained in the request body (stateless — no server-side session storage). Each request sends the full `history[]` array.

Frontend: chat-style reply thread below the content card. Each AI turn shows encouragement prefix + follow-up question. Student turns show their reply in a distinct style. Add streaming response support if time allows (optional).

**task_type:** `code_generation`

**Deliverable:**
- `/api/socratic` returns a follow-up question given conversation history
- Frontend renders at least 2 exchange turns correctly
- AI response never includes the phrase "The answer is" (enforced by system prompt)
- Encouragement prefix appears on every AI turn ("Great thinking!", "Nice try — let's dig deeper", etc.)

**Acceptance criteria:**
- [ ] POST `/api/socratic` with a 2-turn history returns a valid follow-up question
- [ ] System prompt enforces Socratic style (no direct answers)
- [ ] Frontend renders the exchange thread without layout breakage
- [ ] Wrong/incomplete student answers receive encouragement, not punishment text
- [ ] Conversation history is passed stateless in the request (no server session)

**Parallel with:** none (depends on both Phase 2A and 2B being solid)

**QA gate:** yes — Nissan + Anusha both run a 3-turn exchange with a real topic before marking done

**Belle needed:** no

**Est. time:** 3h (Nissan 2h backend + Anusha 1h wiring)

**Depends on:** Phase 2A + Phase 2B complete

---

### Phase 4 — Wire Up Full Student Flow (End-to-End)
_Owner: Anusha (wiring) + Nissan (debug)_

**Inputs:**
- Phase 2B: All student screens built
- Phase 2A: `/api/generate` live
- Phase 3: `/api/socratic` live

**Task:**
Connect the complete student journey end-to-end. Replace all hardcoded stub data with live API calls. Add session event logging (POST `/api/session` after each content generation + each Socratic exchange). Test the full flow for all 5 formats.

```
Wiring checklist:
- Home screen "Let's Go" → format selector (pass topic + year via URL params or context)
- Format selector "Generate" → call /api/generate → render ContentCard
- ContentCard socraticPrompt → auto-populates first Socratic question
- Student reply → POST /api/socratic → render follow-up
- Each generation event → POST /api/session {topic, format, year} (no student ID)
- Add retry button for API errors
- Add "Try another format" button after 3 exchanges
```

**task_type:** `code_generation`

**Deliverable:**
- Full student flow works without hardcoded stubs
- Session events are logged to the in-memory store (feeds teacher heatmap in Phase 5)
- Error state shows friendly retry message, not raw error
- Flow works for all 5 formats

**Acceptance criteria:**
- [ ] A fresh user can complete the full flow (topic → format → content → 2 Socratic exchanges) without touching the console
- [ ] Session data appears in `/api/session` store after a flow completes
- [ ] API error state is handled gracefully
- [ ] Mock mode (`USE_MOCK=true`) still works end-to-end

**Parallel with:** Phase 5 can start in parallel once session POST endpoint is wired

**QA gate:** yes — run full flow manually on mobile viewport AND desktop

**Belle needed:** no

**Est. time:** 3h (Anusha 2h wiring + Nissan 1h debug)

**Depends on:** Phase 2A + 2B + 3 complete

---

### Phase 5 — Teacher Heatmap Dashboard
_Owner: Anusha (UI) + Nissan (data endpoint)_

**Inputs:**
- Phase 4: `/api/session` store accumulating data
- Heatmap design: topic (rows) × format (columns) grid, colour-coded by count
- Seed data script for demo (20–30 synthetic sessions across topics + formats)

**Task:**
Build the teacher dashboard at `/teacher`. Read aggregated session data from `/api/sessions/summary` (Nissan). Render as a grid heatmap (Anusha). Add a seed-data endpoint or script so the heatmap looks lively during the demo even with zero real student sessions.

```
Dashboard components:
1. Heatmap grid — topics (rows) × formats (columns), cell = session count
   - Colour scale: 0=empty grey, 1–3=pale amber, 4–7=amber, 8+=dark amber
   - Hover tooltip: "X sessions — [topic] via [format]"
2. Top 3 formats summary card (bar or pill display)
3. Total sessions counter (top of page)
4. Subject filter (All / Maths / Science / English / HASS)
5. "Demo mode" banner — "Aggregated data only. No student identities stored."
6. Seed button (dev only) — inject 25 synthetic sessions for demo
```

**Data API:**
```
GET /api/sessions/summary
→ { total: number, byTopicFormat: Record<topic, Record<format, count>>, topFormats: [{format, count, pct}] }
```

**task_type:** `code_generation` + `structured_json`

**Deliverable:**
- `/teacher` renders heatmap with real + seeded session data
- Seed script injects 25 demo sessions with varied topics + formats
- No student PII in any API response or UI
- Dashboard loads in <2s

**Acceptance criteria:**
- [ ] Heatmap renders all 5 format columns and at least 8 topic rows
- [ ] Colour intensity scales with count
- [ ] "No sessions yet" empty state renders cleanly
- [ ] Seed data produces a visually rich heatmap for demo
- [ ] No student names, IDs, or per-student data visible anywhere

**Parallel with:** Phase 4 (can start once `/api/session` POST is wired)

**QA gate:** yes — check for PII leakage, empty state, and visual quality

**Belle needed:** no (but Anusha owns the heatmap visual — use a simple CSS grid, not a charting library, to keep it lightweight)

**Est. time:** 3–4h (Anusha 2h UI + Nissan 1h data endpoint + seed script)

**Depends on:** Phase 4 (`/api/session` store live); can mock the GET endpoint independently

---

### Phase 6 — Polish + Demo Prep
_Owner: Both (split tasks)_

**Inputs:**
- All phases complete (or near-complete)
- Demo script outline
- Pitch deck template

**Task:**
Final polish, static fallbacks, demo recording, and pitch deck prep. This phase is time-boxed: anything not done by EOD April 7 is cut or mocked.

**Sub-tasks:**
```
Nissan:
- Pre-generate static ContentCard fallbacks for 5 "hero" topic+format combos
  → store in lib/mock-content.ts, activated by USE_MOCK=true
- Load test: run 20 CurricuLLM calls and confirm credits remain healthy
- Confirm Vercel deploy is stable at final URL
- Record backend walkthrough (optional, for pitch deck)

Anusha:
- Visual polish pass: spacing, loading states, colour consistency
- Add format icons (emoji or SVG) to format tiles
- Add Laurillard framework label to each format card
  (Game=Practice, Story=Acquisition, Meme=Acquisition/Discussion, Puzzle=Investigation, Short Film=Production)
- Ensure mobile viewport is clean (375px)

Both:
- Walk through the 2–3 min demo script (topic → format → content → Socratic → teacher dashboard)
- Record demo video (Loom or screen recording)
- Populate pitch deck:
  - Problem: passive, format-mismatch learning
  - Solution: QuestLearn — student-driven format selection
  - Laurillard framework slide (6 types → 5 formats mapped)
  - CurricuLLM architecture diagram
  - Privacy principle slide (no student PII)
  - Demo screenshot / live URL
  - Team slide
```

**task_type:** `boilerplate_floor` + manual

**Deliverable:**
- Final app live at stable Vercel URL
- Mock mode pre-loaded with 5 hero content cards
- Demo video uploaded (YouTube unlisted or Google Drive)
- Pitch deck 4 slides minimum (+ title)

**Acceptance criteria:**
- [ ] Full demo flow runs without touching developer tools
- [ ] Mock mode fallback activates cleanly if API is slow
- [ ] Demo video < 3 min and shows all key features
- [ ] Pitch deck covers: problem, solution, Laurillard theory, CurricuLLM, privacy
- [ ] App URL shared in hackathon submission form

**Parallel with:** none (polish is last)

**QA gate:** yes — both team members watch the recorded demo before submitting

**Belle needed:** no

**Est. time:** 4h (Anusha 2h polish + 1h pitch deck; Nissan 2h fallbacks + 1h demo recording)

**Depends on:** Phases 1–5 complete or near-complete

---

## Effort Summary

| Phase | Owner | Est. Time | Day Target |
|---|---|---|---|
| 1 — Scaffold + CurricuLLM test | Nissan | 3h | Thu Apr 2 |
| 2A — Content generation (5 formats) | Nissan | 3–4h | Thu Apr 2 – Fri Apr 3 |
| 2B — Student UI shell | Anusha | 3–4h | Fri Apr 3 (parallel with 2A) |
| 3 — Socratic loop | Nissan + Anusha | 3h | Sat Apr 4 |
| 4 — End-to-end wiring | Anusha + Nissan | 3h | Sun Apr 5 |
| 5 — Teacher heatmap | Anusha + Nissan | 3–4h | Mon Apr 6 |
| 6 — Polish + demo prep | Both | 4h | Tue Apr 7 |
| **Total** | | **~38h** | Done by Apr 7 EOD |

_Buffer: April 8 is reserved for final QA, video submission, and pitch deck review._

---

## Deferred (explicitly out of scope for this build)

- **User authentication** — no login for students or teachers in demo
- **Persistent database** — Vercel KV/Redis is optional; in-memory store is fine for demo
- **Image generation** — Meme format uses text overlay on a static template, not DALL-E / Imagen
- **Real-time multi-student sync** — teacher dashboard refreshes on manual reload
- **Short Film format as actual video** — generate a narrated script + scene descriptions; no video rendering
- **Game format as playable game engine** — generate a text-based interactive scenario (choose-your-path), not a full game
- **Cogniti integration** — explicitly skipped (see Stack decision above)
- **Accessibility audit** — WCAG compliance is not in scope; dark theme contrast to be reviewed post-hackathon
- **Mobile app** — web only; responsive design targets 375px+
- **Analytics beyond heatmap** — no time-on-task, session duration, or re-engagement tracking

---

## Open Questions (resolve before Phase 1 starts)

1. **CurricuLLM API key** — Has Anusha registered? Has the key been received? Nissan needs this before Phase 1 can go live (mock mode covers Day 1 build but not integration test). → _Action: Anusha registers at https://forms.office.com/e/9ZWQ2pVy1t; Nissan shares key securely._

2. **GitHub repo** — Does Anusha have a GitHub account? Nissan creates the repo and adds her as collaborator immediately. → _Action: Nissan creates `questlearn` repo, adds Anusha as collaborator, and shares link in Telegram group._

3. **Vercel account** — Who owns the Vercel deploy? Recommend Nissan owns the project; Anusha gets preview URL. → _Action: Nissan connects repo to Vercel, sets `CURRICULLM_API_KEY` env var._

4. **Meme format visual** — Is Anusha comfortable implementing the meme card? Suggest: AI-generated caption + slogan text overlaid on one of 5 pre-selected stock template images (stored in `/public/meme-templates/`). → _Action: Confirm meme design approach at kickoff._

5. **Short Film format rendering** — "Short Film" generates a script with scene headings, not an actual video. Is the pitch framing clear? Suggest labelling it "Short Film Script" in the UI and explaining in the pitch that this maps to Laurillard's Production learning type. → _Action: Confirm naming + framing with both team members._

6. **Demo laptop** — Who demos at UTS on April 9? Must ensure the final Vercel URL works on that laptop without dev environment. → _Action: Nissan or Anusha confirms demo attendance before April 7._
