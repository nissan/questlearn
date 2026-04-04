# BUILD_PLAN: Cogniti Dual-Tutor Integration
_For: QuestLearn — Cambridge EduX Hackathon 2026_
_Created: 2026-04-04_
_Deadline: April 8 submission_

## What We're Building

A **dual-tutor comparison mode** in QuestLearn's learn page:
- Left panel: CurricuLLM Socratic dialogue (existing)
- Right panel: Cogniti Socratic Tutor (new, via iframe embed)
- Student can toggle between tutors or use both simultaneously
- Both tutors work on the same topic/format the student picked

**Why this wins:** Judges see real AI platform integration + original AI side-by-side. It's the only submission that will show TWO AI tutors on the same topic, letting students compare pedagogical approaches.

## Cogniti Agent (Already Created)

- **Agent ID:** `69d053d9324adcb67e01f97d`
- **Name:** QuestLearn Socratic Tutor
- **Headless URL:** `https://app.cogniti.ai/agents/69d053d9324adcb67e01f97d/chat?k=oVlyYYj3ZTmtV06WBVEBxI6Cu6-s0tTtdxWtne6hAU0`
- **Chat URL:** same (public, global chatting permissions)
- **Styling:** QuestLearn dark navy + amber brand colours already applied

## Phase A — Learn Page UI (Kit)

### Files to modify
- `src/components/learn/LearnContent.tsx` — main learn page component

### Changes

**1. Add a tutor toggle above the chat panel**

Replace the current single "Socratic Dialogue" header section with a toggle:

```tsx
// Tutor mode state
const [tutorMode, setTutorMode] = useState<'curricullm' | 'cogniti' | 'both'>('curricullm')
```

Toggle UI (pill buttons, amber active state):
```
[ CurricuLLM ] [ Cogniti ] [ Both ]
```

**2. CurricuLLM pane** — existing chat UI, shown when `tutorMode === 'curricullm' || tutorMode === 'both'`

**3. Cogniti pane** — new iframe embed, shown when `tutorMode === 'cogniti' || tutorMode === 'both'`

```tsx
const COGNITI_AGENT_URL = 'https://app.cogniti.ai/agents/69d053d9324adcb67e01f97d/chat?k=oVlyYYj3ZTmtV06WBVEBxI6Cu6-s0tTtdxWtne6hAU0'

// In JSX:
{(tutorMode === 'cogniti' || tutorMode === 'both') && (
  <div className="flex flex-col h-full border-l">
    <div className="px-4 py-3 border-b flex items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cogniti Tutor</span>
      <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Powered by Cogniti</span>
    </div>
    <iframe
      src={COGNITI_AGENT_URL}
      className="flex-1 w-full border-0"
      allow="microphone"
      title="Cogniti Socratic Tutor"
    />
  </div>
)}
```

**4. Layout adjustment for "Both" mode**

When `tutorMode === 'both'`, the right half of the grid splits into two equal columns (each tutor gets half the pane). On mobile, stack vertically with a mode selector that swaps between them (no "both" on mobile).

```tsx
// Right panel grid class
const rightPanelClass = tutorMode === 'both'
  ? 'grid grid-cols-2 h-full'
  : 'flex flex-col h-full'
```

## Phase B — Environment Variable (Kit)

Add to `.env.local` and Vercel env:
```
NEXT_PUBLIC_COGNITI_AGENT_URL=https://app.cogniti.ai/agents/69d053d9324adcb67e01f97d/chat?k=oVlyYYj3ZTmtV06WBVEBxI6Cu6-s0tTtdxWtne6hAU0
```

Use `process.env.NEXT_PUBLIC_COGNITI_AGENT_URL` in the component (fallback to hardcoded URL if not set).

## Phase C — Pitch Deck Slide Update (Kit)

Update `src/app/pitch/page.tsx` slide 6 (or add a new slide) to call out the dual-tutor feature:

Current slide content for AI slide → add:
- "Two AI tutors on the same topic — CurricuLLM (purpose-built for AU curriculum) + Cogniti (evidence-based educational AI platform)"
- "Students choose their learning style; both tutors use Socratic method"
- Small Cogniti logo/badge on the slide

## Constraints

- Do NOT modify the existing CurricuLLM Socratic API (`/api/learn/socratic`) — it must continue to work exactly as before
- Do NOT add any new DB tables or API routes — purely frontend
- The iframe uses Cogniti's own auth (public link) — no token management needed
- TypeScript must compile with zero errors
- No `any` casts

## Success Criteria

1. Learn page loads with the tutor toggle visible
2. CurricuLLM tab shows the existing chat UI (unchanged behaviour)
3. Cogniti tab shows the Cogniti agent iframe, branded amber/dark
4. Both tab shows both side by side (desktop only)
5. Mobile: toggle between CurricuLLM and Cogniti, no "both" option
6. Pitch deck mentions Cogniti integration
7. `npm run build` passes with zero errors

## Commit Strategy

- One commit: `feat: cogniti dual-tutor — iframe embed + toggle UI`
- Feature branch: `feat/cogniti-dual-tutor`
- PR to main — Nissan merges

## Estimated Time

Kit: ~15 minutes (purely frontend, no new APIs)
