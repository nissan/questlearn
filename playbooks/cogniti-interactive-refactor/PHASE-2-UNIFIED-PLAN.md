# Phase 2: Unified Implementation Plan — Cogniti Interactive Refactor

**Version:** 2.0.0  
**Created:** 2026-04-06  
**Authors:** Loki (Orchestrator), Firefly (Analysis/Design)  
**Status:** ✅ Ready for Kit — Phase 3 Implementation  
**Project:** QuestLearn (`/Users/loki/projects/questlearn`)

---

## Overview

Move all three Cogniti mini-apps from iframe embeds → custom-hosted QuestLearn components.  
Cogniti's Agent API remains the AI brain; all API calls are proxied through QuestLearn's backend.

---

## Current State Audit

| App | Current Status | Component | Issue |
|-----|---------------|-----------|-------|
| **Flashcards** | ✅ iframe embed live | `CognitiFlashcards.tsx` | No control, no data ownership, iframe UX |
| **Concept Map** | ✅ iframe embed live | `CognitiConceptMap.tsx` | Same + key exposed in `LearnContent.tsx:23` |
| **Debate** | ❌ Not in codebase | N/A — needs to be built | Format not in `formats.ts`, no component |

### 🔴 Critical Security Issue — Existing Code

**File:** `src/components/learn/LearnContent.tsx` line 23  
```typescript
// INSECURE — API key exposed in client bundle via NEXT_PUBLIC fallback
const COGNITI_URL =
  process.env.NEXT_PUBLIC_COGNITI_AGENT_URL ??
  'https://app.cogniti.ai/agents/69d053d9324adcb67e01f97d/chat?k=_dJhhHwkvb2wLQdZAKlCSzp45MjspMhjK9ZCsCNqlh4';
```
**Fix:** Remove `?k=...` from fallback URL. Proxy the Cogniti tutor through backend.

---

## Cogniti Agent Credentials

| Field | Value |
|-------|-------|
| **Agent ID** | `69d053d9324adcb67e01f97d` |
| **Agent Endpoint** | `https://app.cogniti.ai/agents/69d053d9324adcb67e01f97d/chat` |
| **Flashcards Interactive ID** | `69d0575fbd12b7d70d8c1a2d` |
| **Concept Map Interactive ID** | `69d0609388709ae18201f7d4` |
| **1Password path** | `op://OpenClaw-Agents/Cogniti Agent API Key/credential` |
| **Env var** | `COGNITI_AGENT_KEY` |

---

## Architecture

```
Student Browser
    │
    │  fetch('/api/questlearn/{app}/{action}', { body })
    ▼
QuestLearn Next.js Backend  ← COGNITI_AGENT_KEY lives here only
    │
    │  POST https://app.cogniti.ai/agents/69d053d9324adcb67e01f97d/chat
    │  Authorization: Bearer {COGNITI_AGENT_KEY}
    ▼
Cogniti Agent  (AI brain)
    │
    └─► Response → rendered in QuestLearn component
```

---

## Part 1: App Analysis

### App 1 — Flashcards

**Current:** Iframe embed → `https://app.cogniti.ai/interactives/69d0575fbd12b7d70d8c1a2d/run?topic=...`

**AI Call Sites (from Cogniti interactive source):**
```javascript
// 1. Evaluate student's explanation of a card
const result = await InteractiveAI.call('evaluate_explanation', {
  topic,
  question,
  correct_answer,
  student_explanation
});
// Returns: { text: feedbackString }
```

**What the app does:**
1. Generates flashcards for the given topic (spaced repetition)
2. Student reads card front, flips to reveal back
3. Student writes explanation of the concept in their own words
4. AI evaluates explanation → provides feedback

**Refactor approach:** Build native React flashcard UI + proxy `evaluate_explanation` through backend.

---

### App 2 — Debate

**Current:** Not in codebase — needs to be built from scratch.

**AI Call Sites (from Cogniti interactive source):**
```javascript
// 1. Initialize debate conversation
const conversation = await InteractiveAI.startConversation('debate_opponent');

// 2. Send argument, receive counter-argument
const result = await conversation.send({
  message: promptMsg  // includes topic, position, round context
});
// Returns: { text: aiArgumentAndVerdict }
```

**What the app does:**
1. Student picks a topic + their position (For/Against)
2. AI takes the opposing position
3. 3-round structured debate: student argues → AI counter-argues → repeat
4. Final round: AI delivers verdict with reasoning

**Refactor approach:** Build multi-round debate React component. Conversation context maintained server-side per session.

---

### App 3 — Concept Map

**Current:** Iframe embed → `https://app.cogniti.ai/interactives/69d0609388709ae18201f7d4/run?topic=...`

**AI Call Sites (from Cogniti interactive source):**
```javascript
// 1. Evaluate a drawn connection between concepts
const result = await InteractiveAI.call('evaluate_connection', {
  topic, source, target, relationship
});
// Returns: { valid: bool, explanation: string, confidence: number }

// 2. Suggest related concepts
const result = await InteractiveAI.call('suggest_connections', {
  topic, concept, existingNodes
});
// Returns: { suggestions: string[], rationale: string }
```

**What the app does:**
1. Student creates nodes (concepts) on a canvas
2. Student draws edges (relationships) between nodes
3. AI evaluates each connection's validity + gives feedback
4. AI suggests new concepts to add

**Refactor approach:** Build React graph canvas (e.g., React Flow) + proxy AI calls through backend.

---

## Part 2: Backend Endpoint Specs

### Unified API Route Convention

All endpoints: `POST /api/questlearn/{app}/{action}`

Response pattern:
```typescript
// Success
{ ...data, _stub?: false }

// Fallback (Cogniti unavailable)  
{ ...fallbackData, _stub: true }

// Error
{ error: string }  // status 400/401/500
```

---

### Flashcards Endpoints

#### `POST /api/questlearn/flashcards/evaluate-explanation`

**File:** `src/app/api/questlearn/flashcards/evaluate-explanation/route.ts`

**Request:**
```typescript
{
  topic: string;           // e.g. "Photosynthesis"
  question: string;        // card front
  correct_answer: string;  // card back (expected explanation)
  student_explanation: string; // what student wrote
}
```

**Response:**
```typescript
{
  feedback: string;        // AI evaluation of student's explanation
  score?: 'excellent' | 'good' | 'needs_work';  // optional quality indicator
  _stub?: boolean;
}
```

**Prompt:**
```
You are a Year {yearLevel} {subject} teacher assessing a student's understanding.
Topic: {topic}
Flashcard question: {question}
Expected answer: {correct_answer}
Student's explanation: {student_explanation}

Evaluate the student's explanation. Is it accurate? What did they get right? What's missing or incorrect?
Give constructive, encouraging feedback in 2-3 sentences suitable for a secondary school student.
Also rate their response: "excellent", "good", or "needs_work".
Return JSON: { "feedback": "string", "score": "excellent"|"good"|"needs_work" }
```

---

### Debate Endpoints

#### `POST /api/questlearn/debate/start-conversation`

**File:** `src/app/api/questlearn/debate/start-conversation/route.ts`

**Request:**
```typescript
{
  topic: string;       // debate topic, e.g. "Nuclear energy should replace coal"
  userPosition: 'for' | 'against';
  yearLevel?: string;  // defaults to "Year 9"
}
```

**Response:**
```typescript
{
  conversationId: string;   // UUID stored server-side (or encoded context)
  aiPosition: 'for' | 'against';  // opposite of user
  openingStatement: string; // AI's opening position statement
  _stub?: boolean;
}
```

**Implementation note:** `conversationId` encodes the conversation context (topic, positions, round history) as a signed JWT or short-lived server-side session. The frontend passes it back on each `send-argument` call. This maintains stateless server architecture.

**Prompt:**
```
You are a debate coach running a structured academic debate for Year {yearLevel} students.
Topic: "{topic}"
You are arguing the {aiPosition} position.
The student is arguing the {userPosition} position.

Introduce yourself as the AI debate opponent and state your opening position clearly and persuasively in 3-4 sentences.
This is Round 1 of 3. Be firm but fair — this is educational.
Return JSON: { "openingStatement": "string" }
```

---

#### `POST /api/questlearn/debate/send-argument`

**File:** `src/app/api/questlearn/debate/send-argument/route.ts`

**Request:**
```typescript
{
  conversationId: string;   // from start-conversation
  topic: string;
  userPosition: 'for' | 'against';
  aiPosition: 'for' | 'against';
  round: number;            // 1, 2, or 3
  userArgument: string;     // student's argument for this round
  history?: Array<{ role: 'user' | 'ai', text: string }>;  // prior rounds
}
```

**Response:**
```typescript
{
  counterArgument: string;  // AI's response to student's argument
  verdict?: string;         // only populated on round === 3
  winner?: 'user' | 'ai' | 'tie';  // only on round === 3
  _stub?: boolean;
}
```

**Prompt (rounds 1–2):**
```
You are in a structured academic debate with a Year {yearLevel} student.
Topic: "{topic}"
You are arguing: {aiPosition}
Student is arguing: {userPosition}
Round: {round} of 3

Prior debate history:
{history}

Student's argument this round: "{userArgument}"

Acknowledge what's strong in their argument (1 sentence), then provide a compelling counter-argument (3-4 sentences).
Be intellectually rigorous but age-appropriate.
Return JSON: { "counterArgument": "string" }
```

**Prompt (round 3 — final):**
```
You are in the final round of a structured academic debate with a Year {yearLevel} student.
Topic: "{topic}" — Student argued: {userPosition}, You argued: {aiPosition}

Full debate transcript:
{history}

Student's closing argument: "{userArgument}"

1. Provide your final counter-argument (2-3 sentences).
2. Then deliver an impartial verdict: who made stronger arguments overall, and why?
   Consider: quality of evidence, logical structure, responsiveness to counter-arguments.
Return JSON: {
  "counterArgument": "string",
  "verdict": "string (3-4 sentences impartial analysis)",
  "winner": "user"|"ai"|"tie"
}
```

---

### Concept Map Endpoints

#### `POST /api/questlearn/concept-map/evaluate-connection`

**File:** `src/app/api/questlearn/concept-map/evaluate-connection/route.ts`

**Request:**
```typescript
{
  topic: string;
  source: string;       // source node label
  target: string;       // target node label
  relationship: string; // edge label / relationship type
  yearLevel?: string;
}
```

**Response:**
```typescript
{
  valid: boolean | null;
  explanation: string;
  confidence: 'high' | 'medium' | 'low' | null;
  _stub?: boolean;
}
```

**Prompt:**
```
You are a Year {yearLevel} teacher evaluating concept map connections.
Topic: {topic}
Connection: {source} --[{relationship}]--> {target}
Is this a valid and educationally meaningful connection for this topic?
Return JSON: { "valid": boolean, "explanation": "1-2 sentences", "confidence": "high"|"medium"|"low" }
```

#### `POST /api/questlearn/concept-map/suggest-connections`

**File:** `src/app/api/questlearn/concept-map/suggest-connections/route.ts`

**Request:**
```typescript
{
  topic: string;
  concept: string;
  existingNodes?: string[];
  yearLevel?: string;
}
```

**Response:**
```typescript
{
  suggestions: string[];
  rationale: string;
  _stub?: boolean;
}
```

---

## Part 3: Frontend Refactoring Patterns

### 3a. Universal Cogniti Agent Call Helper

Create `src/lib/cogniti-agent.ts`:

```typescript
/**
 * Cogniti Agent Integration Helper
 * 
 * Based on Cogniti Interactive concept. Refactored for QuestLearn.
 * AI interactions powered by Cogniti Agent (https://cogniti.ai)
 * Agent ID: 69d053d9324adcb67e01f97d
 */

export async function callQuestLearnAgent<T>(
  path: string,  // e.g. 'flashcards/evaluate-explanation'
  body: Record<string, unknown>
): Promise<T | null> {
  try {
    const res = await fetch(`/api/questlearn/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      console.warn(`[QuestLearn Agent] ${path} returned ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`[QuestLearn Agent] ${path} failed:`, err);
    return null;
  }
}
```

---

### 3b. Flashcards.tsx — Core Pattern

```typescript
/*
 * Flashcards Interactive — QuestLearn
 * Based on Cogniti Interactive concept. Refactored for QuestLearn.
 * AI interactions powered by Cogniti Agent (https://cogniti.ai)
 */
'use client'

import { callQuestLearnAgent } from '@/lib/cogniti-agent'

// BEFORE (Cogniti iframe):
// <iframe src="https://app.cogniti.ai/interactives/69d0575fbd12b7d70d8c1a2d/run?topic=..." />

// AFTER: Native React component

interface EvaluationResult {
  feedback: string;
  score: 'excellent' | 'good' | 'needs_work';
  _stub?: boolean;
}

async function submitAnswer(
  topic: string,
  question: string,
  correct_answer: string,
  student_explanation: string
) {
  const result = await callQuestLearnAgent<EvaluationResult>(
    'flashcards/evaluate-explanation',
    { topic, question, correct_answer, student_explanation }
  );

  if (!result) {
    // Graceful fallback
    return {
      feedback: 'Your answer has been saved. AI feedback temporarily unavailable.',
      score: null as null,
      _stub: true
    };
  }
  return result;
}
```

**Flashcard generation:** Use the `/api/learn/generate` endpoint (already exists) with `format: 'flashcards'` — it returns topic content. Parse into card front/back. Cards are generated client-side from topic JSON — no additional endpoint needed.

---

### 3c. Debate.tsx — Core Pattern

```typescript
/*
 * Debate Interactive — QuestLearn
 * Based on Cogniti Interactive concept. Refactored for QuestLearn.
 * AI interactions powered by Cogniti Agent (https://cogniti.ai)
 */
'use client'

import { useState } from 'react'
import { callQuestLearnAgent } from '@/lib/cogniti-agent'

interface DebateState {
  conversationId: string | null;
  aiPosition: 'for' | 'against' | null;
  round: number;  // 0 = not started, 1-3 = active, 4 = complete
  history: Array<{ role: 'user' | 'ai'; text: string }>;
  verdict: string | null;
  winner: 'user' | 'ai' | 'tie' | null;
}

// BEFORE (Cogniti interactives source):
// const conversation = await InteractiveAI.startConversation('debate_opponent');
// const result = await conversation.send({ message: promptMsg });

// AFTER:
async function startDebate(topic: string, userPosition: 'for' | 'against') {
  return await callQuestLearnAgent<{
    conversationId: string;
    aiPosition: 'for' | 'against';
    openingStatement: string;
  }>('debate/start-conversation', { topic, userPosition });
}

async function sendArgument(
  conversationId: string,
  topic: string,
  userPosition: 'for' | 'against',
  aiPosition: 'for' | 'against',
  round: number,
  userArgument: string,
  history: Array<{ role: string; text: string }>
) {
  return await callQuestLearnAgent<{
    counterArgument: string;
    verdict?: string;
    winner?: 'user' | 'ai' | 'tie';
  }>('debate/send-argument', {
    conversationId, topic, userPosition, aiPosition, round, userArgument, history
  });
}
```

---

### 3d. ConceptMap.tsx — Core Pattern

```typescript
/*
 * Concept Map Interactive — QuestLearn
 * Based on Cogniti Interactive concept. Refactored for QuestLearn.
 * AI interactions powered by Cogniti Agent (https://cogniti.ai)
 */
'use client'

import { callQuestLearnAgent } from '@/lib/cogniti-agent'

// BEFORE (Cogniti interactives source):
// const result = await InteractiveAI.call('evaluate_connection', { topic, source, target, relationship });
// const result = await InteractiveAI.call('suggest_connections', { topic, concept, existingNodes });

// AFTER:
async function evaluateConnection(
  topic: string,
  source: string,
  target: string,
  relationship: string
) {
  return await callQuestLearnAgent<{
    valid: boolean | null;
    explanation: string;
    confidence: 'high' | 'medium' | 'low' | null;
  }>('concept-map/evaluate-connection', { topic, source, target, relationship });
}

async function suggestConnections(
  topic: string,
  concept: string,
  existingNodes: string[]
) {
  return await callQuestLearnAgent<{
    suggestions: string[];
    rationale: string;
  }>('concept-map/suggest-connections', { topic, concept, existingNodes });
}
```

---

## Part 4: Cogniti Agent Integration Guide

### Environment Variables

Add to `.env.local` and Vercel project settings:
```bash
# Cogniti Agent API
COGNITI_AGENT_KEY=<from: op://OpenClaw-Agents/Cogniti Agent API Key/credential>
COGNITI_AGENT_ID=69d053d9324adcb67e01f97d

# Keep these for iframe fallback (until fully refactored)
NEXT_PUBLIC_COGNITI_MINIAPP_URL=https://app.cogniti.ai/interactives/69d0575fbd12b7d70d8c1a2d/run
NEXT_PUBLIC_COGNITI_CONCEPTMAP_URL=https://app.cogniti.ai/interactives/69d0609388709ae18201f7d4/run
```

**DO NOT** set `NEXT_PUBLIC_COGNITI_AGENT_KEY` — keys must never be public.

### Calling the Cogniti Agent

```typescript
// Standard pattern for all backend endpoints
const COGNITI_AGENT_KEY = process.env.COGNITI_AGENT_KEY
const COGNITI_AGENT_ID = '69d053d9324adcb67e01f97d'
const COGNITI_ENDPOINT = `https://app.cogniti.ai/agents/${COGNITI_AGENT_ID}/chat`

const response = await fetch(COGNITI_ENDPOINT, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${COGNITI_AGENT_KEY}`
  },
  body: JSON.stringify({ message: formattedPrompt }),
  next: { revalidate: 0 }
})

if (!response.ok) throw new Error(`Cogniti ${response.status}: ${await response.text()}`)
const data = await response.json()

// Parse response — agent may return JSON in a text field
const text = data.response ?? data.message ?? data.text ?? JSON.stringify(data)
const jsonMatch = text.match(/\{[\s\S]*\}/)
const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { text }
```

### Full Backend Endpoint Boilerplate

```typescript
// src/app/api/questlearn/{app}/{action}/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

const COGNITI_AGENT_KEY = process.env.COGNITI_AGENT_KEY
const COGNITI_AGENT_ID = '69d053d9324adcb67e01f97d'
const COGNITI_ENDPOINT = `https://app.cogniti.ai/agents/${COGNITI_AGENT_ID}/chat`

export async function POST(req: NextRequest) {
  // 1. Auth gate
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 2. Parse + validate
  const body = await req.json()
  const { topic, /* ...other required fields */ } = body
  if (!topic /* || !otherRequired */) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // 3. Graceful degradation — key not configured
  if (!COGNITI_AGENT_KEY) {
    return NextResponse.json({
      // ...stub response matching contract
      _stub: true
    })
  }

  try {
    // 4. Format prompt
    const prompt = buildPrompt(body)

    // 5. Call Cogniti agent
    const res = await fetch(COGNITI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COGNITI_AGENT_KEY}`
      },
      body: JSON.stringify({ message: prompt }),
      next: { revalidate: 0 }
    })

    if (!res.ok) throw new Error(`Cogniti ${res.status}`)
    const data = await res.json()

    // 6. Parse response
    const text = data.response ?? data.message ?? data.text ?? JSON.stringify(data)
    let result
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { text }
    } catch {
      result = { text }
    }

    return NextResponse.json(result)

  } catch (err) {
    console.error('[questlearn/{app}/{action}]', err)
    // 7. Never break the UI — always return stub
    return NextResponse.json({
      // ...stub response
      _stub: true
    })
  }
}
```

### Error Handling Matrix

| Scenario | Backend Response | Frontend Behavior |
|----------|-----------------|-------------------|
| `COGNITI_AGENT_KEY` not set | `{ ...stubData, _stub: true }` | Show stub content |
| Cogniti returns 4xx | Catch → stub | Show stub content |
| Cogniti returns 5xx | Catch → stub | Show stub content |
| Cogniti unreachable | Catch → stub | Show stub content |
| Auth missing | `{ error: 'Unauthorized' }` 401 | Redirect to login |
| Missing fields | `{ error: 'Missing required fields' }` 400 | Show form error |
| Null from helper | `null` | Show fallback message |

---

## Part 5: Attribution Strategy

### Code Comment (every component file — mandatory)
```tsx
/*
 * [AppName] Interactive — QuestLearn
 * Based on Cogniti Interactive concept. Refactored for QuestLearn.
 * AI interactions powered by Cogniti Agent (https://cogniti.ai)
 * Agent ID: 69d053d9324adcb67e01f97d
 */
```

### Visible Attribution Badge (add to component header)
```tsx
<span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
  AI by Cogniti
</span>
```

### HTML Comment in JSX output
```tsx
{/* Interactive powered by Cogniti Agent — https://cogniti.ai */}
```

---

## Part 6: File Structure

```
src/
  app/
    api/
      questlearn/
        flashcards/
          evaluate-explanation/
            route.ts              ← CREATE
        debate/
          start-conversation/
            route.ts              ← CREATE
          send-argument/
            route.ts              ← CREATE
        concept-map/
          evaluate-connection/
            route.ts              ← CREATE
          suggest-connections/
            route.ts              ← CREATE
    interactive/
      flashcards/
        page.tsx                  ← CREATE (standalone page)
      debate/
        page.tsx                  ← CREATE (standalone page)
      concept-map/
        page.tsx                  ← CREATE (standalone page)
  components/
    interactive/
      Flashcards.tsx              ← CREATE (replaces CognitiFlashcards.tsx iframe)
      Debate.tsx                  ← CREATE (new app)
      ConceptMap.tsx              ← CREATE (replaces CognitiConceptMap.tsx iframe)
  lib/
    cogniti-agent.ts              ← CREATE (shared helper)
```

**Existing files to modify:**
```
src/components/learn/LearnContent.tsx  ← EDIT: fix key exposure (line 23), update format handlers
src/components/learn/CognitiFlashcards.tsx  ← EDIT: add attribution, or REPLACE with new component
src/components/learn/CognitiConceptMap.tsx  ← EDIT: add attribution, or REPLACE with new component
src/lib/formats.ts                     ← EDIT: add 'debate' format
.env.local                             ← EDIT: add COGNITI_AGENT_KEY
.env.example                           ← EDIT: document new vars
```

---

## Part 7: Phase 3 Checklist for Kit

All three apps can be built **in parallel**.

### 🃏 Flashcards

- [ ] Create `src/lib/cogniti-agent.ts` (shared helper — do this first)
- [ ] Create `src/app/api/questlearn/flashcards/evaluate-explanation/route.ts`
  - Auth gate, input validation, Cogniti agent call, JSON parse, stub fallback
- [ ] Create `src/components/interactive/Flashcards.tsx`
  - Props: `{ topic: string }`
  - State: cards (generated from topic), currentCard, isFlipped, explanation, feedback
  - Generate cards from `/api/learn/generate` with `format: 'flashcards'` (or hardcode sample)
  - `submitAnswer()` → calls `evaluate-explanation` endpoint
  - Attribution comment + "AI by Cogniti" badge
- [ ] Create `src/app/interactive/flashcards/page.tsx` (reads `?topic=`)
- [ ] Update `LearnContent.tsx`: `format === 'flashcards'` → render `<Flashcards topic={topic} />`
- [ ] **Test:** `/learn?topic=Photosynthesis` → select Flashcards → submit explanation → get feedback

### 🗣️ Debate

- [ ] Create `src/app/api/questlearn/debate/start-conversation/route.ts`
  - Generate `conversationId` (uuid or signed JWT encoding topic+positions)
  - Auth gate, call Cogniti for opening statement, return opening
- [ ] Create `src/app/api/questlearn/debate/send-argument/route.ts`
  - Round 1-2: counter-argument only
  - Round 3: counter-argument + verdict + winner
  - Include full history in prompt for context continuity
- [ ] Create `src/components/interactive/Debate.tsx`
  - Props: `{ topic: string }`
  - State: `DebateState` (conversationId, positions, round, history, verdict)
  - Step 1: Position picker (For/Against)
  - Step 2: Round view (argument input + AI response)
  - Step 3: Verdict screen
  - Attribution comment + "AI by Cogniti" badge
- [ ] Add `'debate'` to `src/lib/formats.ts`
  ```typescript
  { id: 'debate', label: 'Debate', icon: '⚖️', description: 'Argue both sides with AI' }
  ```
- [ ] Create `src/app/interactive/debate/page.tsx`
- [ ] Update `LearnContent.tsx`: handle `format === 'debate'` case (same pattern as flashcards)
- [ ] **Test:** Debate → pick position → 3 rounds → verdict rendered

### 🗺️ Concept Map

- [ ] Create `src/app/api/questlearn/concept-map/evaluate-connection/route.ts`
- [ ] Create `src/app/api/questlearn/concept-map/suggest-connections/route.ts`
- [ ] Create `src/components/interactive/ConceptMap.tsx`
  - Props: `{ topic: string }`
  - Use `reactflow` or simple canvas for node/edge rendering
  - On edge create: call `evaluate-connection`
  - Sidebar: "Suggest connections" button → calls `suggest-connections`
  - Attribution comment + "AI by Cogniti" badge
- [ ] Create `src/app/interactive/concept-map/page.tsx`
- [ ] Update `LearnContent.tsx`: `format === 'concept_map'` → render `<ConceptMap topic={topic} />`
- [ ] **Fix key exposure:** `LearnContent.tsx` line 23 — remove `?k=...` from fallback URL
  ```typescript
  // Replace:
  const COGNITI_URL = process.env.NEXT_PUBLIC_COGNITI_AGENT_URL ??
    'https://app.cogniti.ai/agents/69d053d9324adcb67e01f97d/chat?k=_dJhhHwkvb2...'
  // With (key removed from public fallback):
  const COGNITI_URL = process.env.NEXT_PUBLIC_COGNITI_AGENT_URL ??
    'https://app.cogniti.ai/agents/69d053d9324adcb67e01f97d/chat'
  ```
- [ ] **Test:** Add nodes/edges → see connection feedback → use suggest button

### Shared Tasks (do once)

- [ ] Add `COGNITI_AGENT_KEY` to `.env.local` (retrieve from 1Password)
  ```bash
  op read "op://OpenClaw-Agents/Cogniti Agent API Key/credential"
  ```
- [ ] Add `COGNITI_AGENT_KEY=your-key-here` to `.env.local`
- [ ] Add to `.env.example`:
  ```bash
  COGNITI_AGENT_KEY=    # From op://OpenClaw-Agents/Cogniti Agent API Key/credential
  ```
- [ ] Add `reactflow` to dependencies (for Concept Map):
  ```bash
  npm install reactflow
  ```

---

## ETA

| App | Estimate | Parallel? |
|-----|----------|-----------|
| Flashcards | 2-3 hrs | ✅ Yes |
| Debate | 3-4 hrs | ✅ Yes |
| Concept Map | 3-4 hrs | ✅ Yes |
| **Total (serial)** | 8-11 hrs | — |
| **Total (parallel)** | ~4 hrs | 3 Kit instances |

---

## QA Checklist (Oli — post-implementation)

### Security
- [ ] No Cogniti API key in client bundle (check `NEXT_PUBLIC_` vars)
- [ ] No `?k=...` in any client-visible URL
- [ ] All Cogniti calls go through `/api/questlearn/*`
- [ ] 401 on unauthenticated API calls

### Functionality
- [ ] Each app renders with `_stub: true` when `COGNITI_AGENT_KEY` unset
- [ ] Feedback renders correctly
- [ ] Error states don't crash UI (network failure, timeout, malformed response)

### Attribution
- [ ] Code comment in every interactive component file
- [ ] "AI by Cogniti" badge visible in every interactive header

### UX
- [ ] Dark theme renders correctly
- [ ] Mobile viewport works
- [ ] Loading states present (skeleton/spinner while AI responds)

---

*Playbook Phase 2 complete. Dispatch Kit for Phase 3 implementation.*  
*Authored by Loki + Firefly — 2026-04-06*
