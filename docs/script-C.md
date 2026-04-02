# Video Script C — QuestLearn: The Protocol

**Version:** 1.0
**Target length:** 2 minutes
**Audience:** Developers + technical educators
**Style:** Explainer — conference lightning talk energy. Architecture-first, pedagogy grounded.
**Word count:** 245 words

---

## Scene-by-scene

### Scene 1 — The Framework (0:00–0:22)

**Screen:** `/learn` page — topic input visible, five format tiles below it, all unlocked
**Action:** Hold on the full `/learn` page. No interaction yet — let the viewer orient to the product.
**Narration:** "Two minutes. Here's the architecture of QuestLearn. The five learning formats — Game, Story, Meme, Puzzle, Short Film — aren't marketing choices. They map directly to Diana Laurillard's Conversational Framework: six learning types — Acquisition, Inquiry, Practice, Production, Discussion, and Collaboration — collapsed to five formats that a Year Eight student can choose without knowing any of that theory. The pedagogy is baked into the product."
**Music/mood:** Clean, minimal — slightly clinical. Conference room energy. No drama yet.

---

### Scene 2 — The Stack (0:22–0:42)

**Screen:** Teacher dashboard `/teacher` — full heatmap loaded, topic × format × depth grid visible
**Action:** Slow scroll across the heatmap axis labels. Pause on a hot cell to show the three-axis data structure (topic / format / depth).
**Narration:** "The stack: Next.js 16.2.1 with shadcn/ui, deployed to Vercel, backed by Turso — libSQL at the edge. The schema tracks sessions, format choices, Socratic response depth, and topic engagement — the data that powers the teacher dashboard heatmap: topic versus format versus depth, live."
**Music/mood:** Measured, forward — the calm confidence of someone who has thought this through.

---

### Scene 3 — CurricuLLM + The Stub (0:42–1:12)

**Screen:** `/learn` page — Story content card fully loaded, 🧪 Demo stub badge prominent, Australian Curriculum v9 tag visible
**Action:** Zoom in on the stub badge — hold for 2 seconds so the text is fully readable. Then cut to the `lib/curricullm-client.ts` file in VS Code, showing the stub import line highlighted.
**Narration:** "AI content generation runs through CurricuLLM-AU — an OpenAI-compatible API native to Australian Curriculum v9. Every content card in this demo carries a stub badge: 'Demo stub — awaiting CurricuLLM API key.' That is not a gap. That is a single import swap in lib/curricullm-client.ts. Replace the stub with the live client, and every format, every Socratic prompt, every curriculum alignment tag activates across the entire application."
**Music/mood:** Builds slightly — this is the key technical insight. A sense of readiness, one step away.

---

### Scene 4 — The Socratic Loop (1:12–1:28)

**Screen:** `/learn` page — Socratic chat thread. Student's answer visible. AI follow-up question below. No score, no fail state.
**Action:** Chat thread scrolls to show two turns of the Socratic loop — student answer, AI question, student answer, AI question.
**Narration:** "The AI is Socratic by design — it never states the answer. It asks follow-up questions, and the student builds their own understanding."
**Music/mood:** Thoughtful, steady. No drama — this is working exactly as intended.

---

### Scene 5 — Test Suite (1:28–1:43)

**Screen:** Terminal or VS Code test runner — Playwright test output showing passing tests: topic entry, format selection, Socratic loop, teacher dashboard
**Action:** Hold on the green test pass output. Maybe a brief scroll to show test names.
**Narration:** "The Playwright test suite covers the full student flow and the teacher dashboard."
**Music/mood:** Crisp, resolved — the sound of something well-built.

---

### Scene 6 — Equity Architecture + Close (1:43–2:00)

**Screen:** `/learn` page — simple topic entry, clean UI. Or a split showing Bourke (remote school) and Bondi (urban school) context, ending on the QuestLearn interface.
**Action:** Hold on the clean `/learn` page or a simple geographic contrast graphic. Fade to QuestLearn wordmark on white at 1:57.
**Narration:** "One final design note: Bourke and Bondi are named in the specification — not the marketing. Fifty percent of remote Aboriginal communities have no mobile coverage. That's a constraint, not a footnote, and we're designing toward it. Now you know the protocol."
**Music/mood:** Resolves fully — not triumphant, but grounded. The weight of the problem matched by the clarity of the approach.

---

## Full narration (clean read)

Two minutes. Here's the architecture of QuestLearn. The five learning formats — Game, Story, Meme, Puzzle, Short Film — aren't marketing choices. They map directly to Diana Laurillard's Conversational Framework: six learning types — Acquisition, Inquiry, Practice, Production, Discussion, and Collaboration — collapsed to five formats that a Year Eight student can choose without knowing any of that theory. The pedagogy is baked into the product.

The stack: Next.js 16.2.1 with shadcn/ui, deployed to Vercel, backed by Turso — libSQL at the edge. The schema tracks sessions, format choices, Socratic response depth, and topic engagement — the data that powers the teacher dashboard heatmap: topic versus format versus depth, live.

AI content generation runs through CurricuLLM-AU — an OpenAI-compatible API native to Australian Curriculum v9. Every content card in this demo carries a stub badge: Demo stub — awaiting CurricuLLM API key. That is not a gap. That is a single import swap in lib/curricullm-client.ts. Replace the stub with the live client, and every format, every Socratic prompt, every curriculum alignment tag activates across the entire application.

The AI is Socratic by design — it never states the answer. It asks follow-up questions, and the student builds their own understanding.

The Playwright test suite covers the full student flow and the teacher dashboard.

One final design note: Bourke and Bondi are named in the specification — not the marketing. Fifty percent of remote Aboriginal communities have no mobile coverage. That's a constraint, not a footnote, and we're designing toward it. Now you know the protocol.

---

## Screenshot/recording requirements

| Scene | Asset | Type | Notes |
|-------|-------|------|-------|
| 1 | `/learn` page — full view, format tiles all visible, no topic entered | Screenshot | Establish shot — full product overview |
| 1 | `/learn` page — slow zoom out to show full format selector | Recording (Peekaboo) | Reveal all 5 format tiles clearly |
| 2 | Teacher dashboard `/teacher` — heatmap fully loaded, all three axes visible | Screenshot | KEY SHOT — must show topic × format × depth labels clearly |
| 2 | Heatmap — slow scroll across axis labels, pause on a hot cell | Recording (Peekaboo) | Aim to show topic label, format label, and depth label simultaneously |
| 3 | `/learn` page — Story content card, 🧪 Demo stub badge prominent and readable | Screenshot | KEY SHOT — badge must be legible. Crop/zoom if needed |
| 3 | Stub badge — tight close-up crop | Screenshot | "🧪 Demo stub — awaiting CurricuLLM API key" text must be fully readable |
| 3 | `lib/curricullm-client.ts` in VS Code — stub import line highlighted | Screenshot | KEY SHOT — the single-import-swap moment. Clean, no distractions in frame |
| 4 | Socratic chat — two turns visible (student answer → AI question → student answer → AI question) | Screenshot | No score, no fail state anywhere in frame |
| 4 | Chat thread scroll — two Socratic turns | Recording (Peekaboo) | 3–4 second scroll, slow |
| 5 | Playwright test output — all tests passing, test names visible | Screenshot | KEY SHOT for technical credibility — green ticks, test names legible |
| 6 | `/learn` page clean state OR Bourke/Bondi split graphic | Static/graphic | Finn's choice — either works. Kit can generate the split card. |
| 6 | QuestLearn wordmark — clean white background | Static | Fade-to-logo close, hold for ~3 seconds |

**Total assets: 8 screenshots + 3 recordings + 1 graphic = 12 assets**

---

## Notes for Finn

**Overall approach:** This is a two-minute conference lightning talk, not a student walkthrough. Cut faster than Variant A (cinematic) but with more deliberate holds than Variant B (walkthrough). The rhythm is: statement → visual evidence → next statement. Like a well-timed tech demo at an education conference.

**Scene-by-scene timing:**
- Scene 1 (0:00–0:22): 22 seconds. Hold the full `/learn` page long enough for viewers to read the five format tiles. The narration is dense — don't rush the visuals to match. Let the UI serve as backdrop.
- Scene 2 (0:22–0:42): 20 seconds. The heatmap needs to read as "three-dimensional data" — topic vs format vs depth. If the axes aren't clearly labelled in the current UI, flag to the dev team or shoot a tighter crop on the labels.
- Scene 3 (0:42–1:12): 30 seconds — the longest scene, the centrepiece. Three beats: (a) full content card with stub badge → (b) tight crop on badge text → (c) VS Code showing the single import line. The VS Code shot is critical — it's the technical proof of the stub architecture. If the file doesn't exist yet, coordinate with Kit to create a clean screenshot of the stub import pattern.
- Scene 4 (1:12–1:28): 16 seconds. The Socratic loop is supporting evidence here, not the headline. Show two clean turns. Keep narration and visual in sync — if the AI's follow-up question isn't visible, scroll to it before narration reaches "It asks follow-up questions."
- Scene 5 (1:28–1:43): 15 seconds. The Playwright test output needs to show test NAMES (not just a pass count). Aim for test names like "student can enter topic", "format selection works", "Socratic loop responds", "teacher dashboard loads". If test names aren't this descriptive, coordinate with Kit before capture.
- Scene 6 (1:43–2:00): 17 seconds. The closing tone is grounded, not triumphant. Let the equity note land with weight — hold silence or near-silence for 1–2 seconds after "we're designing toward it" before "Now you know the protocol." Logo hold for ~3 seconds.

**Transition style:** Clean cuts throughout — no wipes or dissolves. This is a technical presentation, not cinematic. Exception: Scene 6 → logo = fade to white (not black).

**Music:** Choose something spare and intelligent — piano or minimal ambient with a slight modern edge. Think: "calm precision" not "inspiration". Keep well under the narration at -20dB. This audience will find overly emotional scoring patronising.

**TTS note:** Feed "Full narration (clean read)" directly to kokoro. Voice suggestion: measured, neutral-to-warm — neither too casual nor too corporate. Aim for ~125 words/minute. The Laurillard list (six learning types) should be read with equal weight on each type — not rushed, even though it's a list. The sentence "That is not a gap. That is a single import swap." should land as two deliberate statements — brief pause between them.

**Code asset note:** The VS Code screenshot of `lib/curricullm-client.ts` is the single most technically significant shot in this script. It signals to developer judges that the stub architecture is intentional and production-ready. If the file doesn't look clean in the current repo state, Kit should tidy it (clear comments, clean stub import, well-named live-client import commented out) before Finn captures it.

**Variant differentiation:** Variant A opens with the human problem. Variant B opens with the product. Variant C opens with the architecture. Each is structured for a different audience and serves a different purpose in the submission package.
