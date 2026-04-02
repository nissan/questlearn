# CURRICULLM-SPEC.md — QuestLearn Integration Spec
_Author: Firefly | Date: 2026-04-02_

---

## Overview

CurricuLLM is a drop-in OpenAI-compatible API that adds Australian Curriculum v9 alignment out of the box. QuestLearn uses it for:
1. **Content generation** — one call per format to produce the learning content card
2. **Socratic follow-up** — multi-turn conversation that never gives the direct answer
3. **Teacher analysis hint** (optional) — summarise class heatmap patterns into a pedagogical insight

Base URL: `https://api.curricullm.com/v1`  
Model: `CurricuLLM-AU` (Australian Curriculum v9)  
Auth: `Authorization: Bearer $CURRICULLM_API_KEY`

---

## Client Setup

```typescript
// lib/curricullm.ts
import OpenAI from 'openai';

export const curricullm = new OpenAI({
  apiKey: process.env.CURRICULLM_API_KEY!,
  baseURL: 'https://api.curricullm.com/v1',
});
```

---

## 1. Content Generation — Per Format

### Request Shape

```typescript
// app/api/generate/route.ts
import { curricullm } from '@/lib/curricullm';
import { getSystemPrompt, getUserPrompt } from '@/lib/prompts';

export async function POST(req: Request) {
  const { topic, format, yearLevel } = await req.json();

  const completion = await curricullm.chat.completions.create({
    model: 'CurricuLLM-AU',
    messages: [
      { role: 'system', content: getSystemPrompt(format, yearLevel) },
      { role: 'user',   content: getUserPrompt(topic, format, yearLevel) },
    ],
    temperature: 0.8,   // creative but not unhinged
    max_tokens: 800,
  });

  const raw = completion.choices[0].message.content!;
  // Parse structured JSON from response (see prompts below)
  return Response.json(JSON.parse(raw));
}
```

### User Prompt Template (shared across all formats)

```
getUserPrompt(topic, format, yearLevel):

"Generate curriculum-aligned learning content about '{topic}' for a {yearLevel} student using the '{format}' learning format.
Return ONLY a JSON object with these exact fields:
{
  "title": "engaging title for the content",
  "body": "the main content in the chosen format (see system prompt for structure)",
  "socraticPrompt": "an open question to start the Socratic dialogue (must NOT contain or imply the answer)",
  "curriculumRef": "the most relevant Australian Curriculum v9 content descriptor or outcome"
}
Do not include any text outside the JSON object."
```

---

## 2. System Prompts — Per Format

### Format 1: Story (Laurillard: Acquisition)

```
You are QuestLearn's Story Generator for Years 8–10 Australian students.
Your role: Transform curriculum concepts into an engaging short story (200–250 words) that makes the topic memorable.
Rules:
- Write in second person ("You are a scientist who just discovered...") for immersion
- Reference real-world Australian contexts when possible (Great Barrier Reef, Uluru, Sydney Harbour, etc.)
- End the story at a cliffhanger or open question that sets up the Socratic dialogue
- Do NOT explain the concept directly — embed it in the narrative action
- Match language complexity to {yearLevel} (Year 8 = simpler sentences, Year 10 = richer vocabulary)
- The curriculumRef must cite an AC v9 content descriptor (e.g. "AC9S9U01" format preferred)
Return ONLY the JSON object as instructed.
```

### Format 2: Game (Laurillard: Practice)

```
You are QuestLearn's Game Designer for Years 8–10 Australian students.
Your role: Create a text-based interactive scenario game (choose-your-path style, 200–250 words) that lets the student practice applying the concept.
Rules:
- Present a scenario where the student must make a decision that depends on understanding the concept
- Offer 2–3 labelled choices (A, B, C) — one is correct, others are plausible misconceptions
- Do NOT reveal which choice is correct in the body — that is for the Socratic loop
- Write as a game narrator: "You are the crew of [vessel/team/lab]..."
- The socraticPrompt should ask the student to justify their chosen option
- Keep it snappy and fun — gamers expect concise setup, not a lecture
Return ONLY the JSON object as instructed.
```

### Format 3: Meme (Laurillard: Acquisition + Discussion)

```
You are QuestLearn's Meme Content Creator for Years 8–10 Australian students.
Your role: Create meme-style content that makes a curriculum concept funny and memorable.
Rules:
- Write a TITLE LINE (all caps, like a meme header) — 5–8 words that subvert expectations
- Write a PUNCHLINE (the meme's bottom text) — 5–10 words connecting the joke to the concept
- Write a CAPTION (2–3 sentences) explaining WHY the joke works and what the real concept is
- The joke should relate to something students actually know (social media, gaming, sports, food)
- The socraticPrompt should ask the student to explain the concept in their own words "in meme format"
- Keep it clean and school-appropriate — funny but not edgy
- Format the body as: "TITLE: [title]\nPUNCHLINE: [punchline]\nCAPTION: [caption]"
Return ONLY the JSON object as instructed.
```

### Format 4: Puzzle (Laurillard: Investigation)

```
You are QuestLearn's Puzzle Maker for Years 8–10 Australian students.
Your role: Create a fill-in-the-blank OR matching OR sequencing puzzle that requires understanding the concept to solve.
Rules:
- Choose the puzzle type that best fits the topic (factual → matching, process → sequencing, definitional → fill-in-the-blank)
- Present the puzzle clearly with blanks marked as [___] or numbered items to match
- Do NOT provide the answers in the body
- The puzzle should have 4–6 items (not too long for a mobile screen)
- The socraticPrompt should ask the student to explain one step or term from the puzzle in their own words
- Keep instructions simple: "Match the term to its definition:" or "Fill in the blanks using the word bank:"
- Format the body with clear puzzle structure (use newlines, numbered lists)
Return ONLY the JSON object as instructed.
```

### Format 5: Short Film (Laurillard: Production)

```
You are QuestLearn's Short Film Script Writer for Years 8–10 Australian students.
Your role: Write a short film script (scene headings, dialogue, action lines) that dramatises the concept in an engaging way.
Rules:
- Write a 3-scene micro-script (INT./EXT. headings, character names in CAPS, dialogue + action lines)
- Each scene is 3–5 lines maximum — think of this as a TikTok / YouTube Short script
- Set it in a relatable Australian teen environment (school lab, backyard, beach, sports oval)
- The concept should emerge naturally through the story conflict, not through exposition
- End Scene 3 on an unresolved moment that the Socratic prompt picks up
- The socraticPrompt should ask: "How would you write the next scene to resolve [the core problem]?"
- Format using standard screenplay conventions: SCENE HEADING in caps, action in plain text, DIALOGUE indented
Return ONLY the JSON object as instructed.
```

---

## 3. Socratic Follow-Up Loop

### Request Shape

```typescript
// app/api/socratic/route.ts
export async function POST(req: Request) {
  const { topic, format, yearLevel, history } = await req.json();
  // history: Array<{ role: 'user' | 'assistant', content: string }>

  const completion = await curricullm.chat.completions.create({
    model: 'CurricuLLM-AU',
    messages: [
      { role: 'system', content: getSocraticSystemPrompt(topic, format, yearLevel) },
      ...history,
    ],
    temperature: 0.7,
    max_tokens: 300,
  });

  return Response.json({
    reply: completion.choices[0].message.content,
    role: 'assistant',
  });
}
```

### Socratic System Prompt

```
You are QuestLearn's Socratic Tutor for a Year {yearLevel} Australian student exploring '{topic}' through a {format} learning experience.

Your ONLY job is to deepen their understanding through questions — NEVER give the direct answer.

Rules (non-negotiable):
1. NEVER say "The answer is..." or "That's correct, the answer is..." or reveal the answer directly
2. ALWAYS start your response with a brief encouragement (1 sentence):
   - Correct/partial: "Great thinking!", "You're on the right track!", "Interesting approach!"
   - Incorrect: "Nice try — let's think about this differently.", "Good effort! Let's look at it another way."
3. THEN ask ONE follow-up question that pushes their thinking one step further
4. Keep responses SHORT — 2–4 sentences maximum
5. Relate questions to the Australian Curriculum v9 outcomes for {topic} at {yearLevel} level
6. If the student goes off-topic, gently redirect: "Let's keep exploring {topic} — [redirect question]"
7. After 3 exchanges, offer a synthesis prompt: "In one sentence, how would you explain {topic} to a friend?"

Tone: warm, curious, like a friendly tutor — not a formal examiner.
```

---

## 4. Session Aggregation Endpoint

No CurricuLLM call needed here — this is in-memory aggregation.

```typescript
// lib/store.ts
type SessionEvent = { topic: string; format: string; yearLevel: string };
const store = new Map<string, Map<string, number>>(); // topic → format → count

export function recordSession(event: SessionEvent) {
  const key = `${event.topic.toLowerCase()}|${event.yearLevel}`;
  if (!store.has(key)) store.set(key, new Map());
  const formatMap = store.get(key)!;
  formatMap.set(event.format, (formatMap.get(event.format) ?? 0) + 1);
}

export function getSummary() {
  const byTopicFormat: Record<string, Record<string, number>> = {};
  const formatTotals: Record<string, number> = {};
  let total = 0;

  store.forEach((formatMap, topicKey) => {
    byTopicFormat[topicKey] = {};
    formatMap.forEach((count, format) => {
      byTopicFormat[topicKey][format] = count;
      formatTotals[format] = (formatTotals[format] ?? 0) + count;
      total += count;
    });
  });

  const topFormats = Object.entries(formatTotals)
    .sort(([,a],[,b]) => b - a)
    .slice(0, 3)
    .map(([format, count]) => ({ format, count, pct: Math.round((count / total) * 100) }));

  return { total, byTopicFormat, topFormats };
}
```

---

## 5. Optional: Teacher Insight (CurricuLLM call)

If time permits, add a "Pedagogical Insight" card on the teacher dashboard that summarises class engagement patterns using CurricuLLM.

```typescript
const insight = await curricullm.chat.completions.create({
  model: 'CurricuLLM-AU',
  messages: [
    {
      role: 'system',
      content: `You are a pedagogical advisor for an Australian secondary school teacher (Years 8–10).
Your role: Analyse class engagement data and provide 2–3 actionable teaching suggestions.
Rules:
- Be concise (3–5 bullet points)
- Reference Laurillard's Conversational Framework learning types where relevant
- Suggest topics or formats that appear under-explored in the data
- Never reference individual student data — only class-level patterns`
    },
    {
      role: 'user',
      content: `Here is the aggregated class engagement heatmap:
${JSON.stringify(summaryData, null, 2)}
What patterns do you see, and what would you suggest the teacher explore next?`
    }
  ],
  temperature: 0.5,
  max_tokens: 400,
});
```

---

## 6. Curriculum Alignment Prompt Pattern

To maximise CurricuLLM's curriculum token advantage, always include:

1. **Year level** in the system prompt: `"for a Year {8|9|10} student"`
2. **Subject area** when known: `"in the context of Australian Curriculum v9 {Science|Mathematics|English|HASS}"`
3. **Explicit curriculum ref request**: `"Include the most relevant AC v9 content descriptor code in your response"`

This triggers CurricuLLM's proprietary curriculum tokens and ensures the response references real AC v9 outcomes (e.g. `AC9S9U01`, `AC9M9N01`), which strengthens the hackathon judging angle on curriculum alignment.

---

## 7. Mock Content Fallbacks

Pre-generate 5 static `ContentCard` objects (one per format) for the topic "photosynthesis, Year 9" and store in `lib/mock-content.ts`. Activate with `process.env.USE_MOCK === 'true'`.

These are the demo safety net — if API credits run low or latency spikes during the live demo, flip the flag and the app keeps running flawlessly.

```typescript
// lib/mock-content.ts
export const MOCK_CARDS: Record<string, ContentCard> = {
  story: { format: 'story', topic: 'photosynthesis', yearLevel: 'Year 9',
    title: 'The Last Light', body: '...', socraticPrompt: 'Why do you think the plant started to wilt?',
    curriculumRef: 'AC9S9U01', isMock: true },
  game: { ... },
  meme: { ... },
  puzzle: { ... },
  'short-film': { ... },
};
```

---

## 8. Cost Estimate

| Use case | Avg tokens/call | Calls (dev+demo) | Estimated cost (AUD) |
|---|---|---|---|
| Content generation | ~600 tokens | ~50 | ~$0.60 |
| Socratic follow-up | ~200 tokens/turn × 3 turns | ~100 turns | ~$0.60 |
| Teacher insight | ~500 tokens | ~10 | ~$0.15 |
| Dev/testing waste | — | ~100 | ~$1.00 |
| **Total estimate** | | | **~$2.35** |

**Buffer:** $15.00 total credits → ~$12.65 headroom. Very comfortable. No credit rationing needed unless bulk testing all 25 topic×format combos repeatedly.
