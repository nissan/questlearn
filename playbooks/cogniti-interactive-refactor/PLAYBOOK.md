# Playbook: Cogniti Interactive Refactoring Pattern

**Version:** 1.0.0  
**Created:** 2026-04-06  
**Authors:** Loki (Orchestrator), Firefly (Analysis/Design)  
**Status:** Ready for Kit (Phase 3 implementation)

---

## Purpose

This playbook defines the **reusable pattern** for taking a Cogniti-generated interactive (concept map, quiz engine, knowledge graph, etc.) and integrating it into QuestLearn as a first-class feature with:

- All API calls proxied through QuestLearn's backend (security + rate limiting)
- Cogniti agent as the AI "brain"
- Proper attribution
- Fallback handling for offline/unavailable states

**Use this playbook any time** a Cogniti-generated interactive is introduced to QuestLearn.

---

## Trigger

> User provides HTML/JS code from a Cogniti-generated interactive (concept map builder, knowledge graph tool, quiz engine, etc.)

OR

> A Cogniti interactive is already embedded as an iframe and needs to be decoupled into a first-class QuestLearn feature.

---

## Key Design Principles

| # | Principle | Why |
|---|-----------|-----|
| 1 | **All API calls go through our backend** | Security, rate limiting, auth — no keys exposed to client |
| 2 | **Frontend is "dumb"** | Only renders UI and calls our endpoints — never calls Cogniti directly |
| 3 | **Attribution is mandatory** | Always credit Cogniti — HTML comment + optional visible badge |
| 4 | **Cogniti agent is the "brain"** | We format requests/responses; the agent does the intelligence |
| 5 | **Fallback stubs for offline** | If Cogniti agent unavailable, show helpful message — never break the UI |

---

## Architecture Overview

```
Student browser
    │
    │  fetch('/api/cogniti/{name}', { ...params })
    ▼
QuestLearn Next.js backend  (secret key lives here only)
    │
    │  POST https://app.cogniti.ai/agents/{agentId}/chat
    │  Authorization: Bearer {COGNITI_AGENT_KEY}
    ▼
Cogniti Agent  (AI brain — evaluates, generates, explains)
    │
    └─► Response back up the chain → rendered in browser
```

---

## Cogniti Agent Credentials

| Field | Value |
|-------|-------|
| **Agent ID** | `69d053d9324adcb67e01f97d` |
| **Endpoint** | `https://app.cogniti.ai/agents/69d053d9324adcb67e01f97d/chat` |
| **1Password path** | `op://OpenClaw-Agents/Cogniti Agent API Key/credential` |
| **Env var name** | `COGNITI_AGENT_KEY` |

> ⚠️ **Never hardcode the key in frontend code.** It must only live in `.env.local` / Vercel environment variables and be accessed server-side.

---

## Phase 1: Analysis (Firefly)

**Goal:** Catalogue all AI call sites in the Cogniti-generated code.

### Tasks

1. **Identify all `InteractiveAI.call()` sites** in the provided HTML/JS code
2. **Map each call:**

| `InteractiveAI.call(name, params)` | What it does | Response shape |
|------------------------------------|-------------|----------------|
| `evaluate-connection` | Evaluates if a concept→concept relationship is valid for the topic | `{ valid: bool, explanation: string, confidence: number }` |
| `suggest-connections` | Suggests related concepts given a starting node | `{ suggestions: string[], rationale: string }` |
| `explain-concept` | Explains a concept in context of the topic | `{ explanation: string, level: string }` |
| *(add rows as discovered)* | | |

3. **Identify hard-coded API calls** — any direct `fetch()` to Cogniti URLs
4. **Identify hard-coded API keys** in frontend code — these must be moved to backend
5. **Plan attribution placement** — where in the UI does the Cogniti badge/comment go?

### Firefly Output Format

```markdown
## Analysis Report: [Interactive Name]

### InteractiveAI.call() inventory
| Call site | Line # | Function name | Parameters | Response handling |
|-----------|--------|---------------|-----------|-------------------|
| ...       |        |               |           |                   |

### Hard-coded API calls found
- Line XX: `fetch('https://...')` — must proxy

### Hard-coded keys found
- Line XX: `k=_dJhhHwkvb2...` — must remove

### Attribution placement recommendation
- [Describe where badge/comment should appear]
```

---

## Phase 2: Design (Firefly)

**Goal:** Design the backend endpoints and frontend refactoring plan.

### 2a. Backend Endpoint Design

For each `InteractiveAI.call(name, params)` identified in Phase 1:

**Endpoint naming convention:** `POST /api/cogniti/{kebab-case-name}`

**Example — Concept Map:**

| Call | Endpoint | Request body | Response |
|------|----------|-------------|----------|
| `evaluate-connection` | `POST /api/cogniti/evaluate-connection` | `{ topic, source, target, relationship }` | `{ valid, explanation, confidence }` |
| `suggest-connections` | `POST /api/cogniti/suggest-connections` | `{ topic, concept, existingNodes }` | `{ suggestions[], rationale }` |
| `explain-concept` | `POST /api/cogniti/explain-concept` | `{ topic, concept, context? }` | `{ explanation, level }` |

### 2b. Prompt Design (Cogniti Agent Context)

Each endpoint must format a clear prompt for the Cogniti agent. The prompt must include:
- **Topic context** (e.g., "This is for Year 9 Biology — Photosynthesis")
- **Specific request** (e.g., "Evaluate this connection: Light Energy --[produces]--> Glucose")
- **Expected output format** (tell the agent what JSON to return, or accept free text)

**Example prompts by interactive type:**

```
# Concept Map — evaluate-connection
"You are a Year {yearLevel} {subject} teacher evaluating concept map connections.
Topic: {topic}
Connection: {source} --[{relationship}]--> {target}
Is this a valid and educationally meaningful connection for this topic?
Respond with: { valid: boolean, explanation: string (1-2 sentences), confidence: 'high'|'medium'|'low' }"

# Concept Map — suggest-connections
"You are helping a student build a concept map on {topic} (Year {yearLevel} {subject}).
They have already mapped: {existingNodes.join(', ')}
They are currently looking at: {concept}
Suggest 3-5 related concepts they should connect to this node.
Respond with: { suggestions: string[], rationale: string }"

# Quiz — evaluate-answer
"You are grading a student quiz answer on {topic}.
Question: {question}
Student answer: {studentAnswer}
Correct answer: {correctAnswer}
Is the student's answer correct or partially correct? Explain what they got right/wrong.
Respond with: { correct: boolean, partial: boolean, feedback: string, score: number (0-1) }"

# Knowledge Graph — find-relationship
"You are a {subject} expert building a knowledge graph on {topic}.
Two concepts: '{conceptA}' and '{conceptB}'
What is the relationship between these two concepts in the context of {topic}?
Respond with: { relationship: string, direction: 'A→B'|'B→A'|'bidirectional', strength: 'strong'|'moderate'|'weak', explanation: string }"
```

### 2c. Frontend Refactoring Plan

Replace every `InteractiveAI.call(name, params)` with `fetch('/api/cogniti/{name}', ...)`:

```javascript
// BEFORE (Cogniti-generated code)
const result = await InteractiveAI.call('evaluate-connection', {
  topic, source, target, relationship
});

// AFTER (QuestLearn refactored)
const res = await fetch('/api/cogniti/evaluate-connection', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ topic, source, target, relationship })
});
if (!res.ok) {
  // fallback stub
  return { valid: null, explanation: 'AI feedback temporarily unavailable.', confidence: null };
}
const result = await res.json();
```

### 2d. Integration Plan

- **Standalone page:** `/interactive/{slug}?topic=...` (e.g., `/interactive/concept-map?topic=Photosynthesis`)
- **In-flow (learn page):** Format button in `/learn` → switches right panel to `<ConceptMap topic={topic} />`
- **Post-Socratic prompt:** After Socratic dialogue completes, show CTA button → deep link to standalone

### 2e. Attribution Plan

```html
<!-- 
  Interactive powered by Cogniti (https://cogniti.ai)
  Agent ID: 69d053d9324adcb67e01f97d
  Integrated by QuestLearn — API calls proxied for security
-->
```

Visible badge (optional, based on UX requirements):
```tsx
<span className="text-xs text-muted-foreground">
  Powered by <a href="https://cogniti.ai" target="_blank" rel="noopener">Cogniti ↗</a>
</span>
```

---

## Phase 3: Implementation (Kit)

**Goal:** Build the backend endpoints and refactor the frontend.

### 3a. Backend — Create Endpoints

**File location:** `src/app/api/cogniti/{name}/route.ts`

**Boilerplate template:**

```typescript
// src/app/api/cogniti/evaluate-connection/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

const COGNITI_AGENT_KEY = process.env.COGNITI_AGENT_KEY
const COGNITI_AGENT_ID = '69d053d9324adcb67e01f97d'
const COGNITI_ENDPOINT = `https://app.cogniti.ai/agents/${COGNITI_AGENT_ID}/chat`

export async function POST(req: NextRequest) {
  // 1. Auth gate
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 2. Parse + validate request
  const body = await req.json()
  const { topic, source, target, relationship } = body
  if (!topic || !source || !target || !relationship) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // 3. Graceful degradation if key not configured
  if (!COGNITI_AGENT_KEY) {
    return NextResponse.json({
      valid: null,
      explanation: 'AI feedback is currently unavailable. Your connection has been saved.',
      confidence: null,
      _stub: true
    })
  }

  try {
    // 4. Format prompt for Cogniti agent
    const prompt = [
      `You are a Year 9 teacher evaluating concept map connections.`,
      `Topic: ${topic}`,
      `Connection: ${source} --[${relationship}]--> ${target}`,
      `Is this a valid and educationally meaningful connection?`,
      `Respond with JSON: { "valid": boolean, "explanation": "1-2 sentences", "confidence": "high"|"medium"|"low" }`
    ].join('\n')

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

    // 6. Parse response (handle both JSON and free-text)
    let result
    try {
      // Try to extract JSON from agent response
      const text = data.response ?? data.message ?? JSON.stringify(data)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { explanation: text }
    } catch {
      result = { explanation: data.response ?? 'Unable to parse response.' }
    }

    return NextResponse.json(result)

  } catch (err) {
    console.error('[cogniti/evaluate-connection]', err)
    // 7. Fallback — never break the UI
    return NextResponse.json({
      valid: null,
      explanation: 'AI feedback temporarily unavailable. Your connection has been saved.',
      confidence: null,
      _stub: true
    })
  }
}
```

### 3b. Frontend Refactoring Template

```typescript
// Replace all InteractiveAI.call() with this pattern:

async function callCognitiAgent<T>(
  endpoint: string,
  params: Record<string, unknown>
): Promise<T | null> {
  try {
    const res = await fetch(`/api/cogniti/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// Usage:
const feedback = await callCognitiAgent<EvaluationResult>('evaluate-connection', {
  topic,
  source: sourceNode.label,
  target: targetNode.label,
  relationship: edgeLabel
})

if (!feedback) {
  showFallbackMessage('AI feedback temporarily unavailable.')
  return
}
renderFeedback(feedback)
```

### 3c. Attribution Tag (top of component file)

```tsx
{/* 
  Interactive concept map component
  Powered by Cogniti (https://cogniti.ai) — Agent ID: 69d053d9324adcb67e01f97d
  API calls proxied through /api/cogniti/* for security
*/}
```

### 3d. Environment Variables

Add to `.env.local` and Vercel:

```bash
COGNITI_AGENT_KEY=<from op://OpenClaw-Agents/Cogniti Agent API Key/credential>
COGNITI_AGENT_ID=69d053d9324adcb67e01f97d
```

### 3e. Checklist for Kit

- [ ] Read Phase 1 Analysis Report (what endpoints are needed)
- [ ] Read Phase 2 Design (request/response contracts)
- [ ] Create `src/app/api/cogniti/{name}/route.ts` for each endpoint
- [ ] Verify `COGNITI_AGENT_KEY` env var is in `.env.local`
- [ ] Refactor frontend: replace all `InteractiveAI.call()` with `fetch('/api/cogniti/...')`
- [ ] Remove any hardcoded keys from frontend code
- [ ] Add attribution comment to top of component
- [ ] Add stub response for each endpoint (offline fallback)
- [ ] Test each endpoint locally: `curl -X POST http://localhost:3000/api/cogniti/{name}`
- [ ] Verify UI renders correctly with stub responses (COGNITI_AGENT_KEY unset)

---

## Phase 4: QA (Oli)

**Goal:** Verify the integration works correctly and securely.

### QA Checklist

**API Correctness**
- [ ] Each `/api/cogniti/{name}` endpoint returns expected response shape
- [ ] Auth gate works — unauthenticated requests return 401
- [ ] Input validation works — missing fields return 400

**Error States**
- [ ] When `COGNITI_AGENT_KEY` is unset → returns stub with `_stub: true`
- [ ] When Cogniti API returns non-200 → returns fallback, does NOT crash
- [ ] When Cogniti API is unreachable → returns fallback within reasonable timeout
- [ ] Frontend handles `null` response from `callCognitiAgent()` gracefully

**Security**
- [ ] No Cogniti key exposed in browser network tab
- [ ] No Cogniti key in client-side JS bundle
- [ ] All calls go through `/api/cogniti/*` — no direct `app.cogniti.ai` calls from frontend

**Attribution**
- [ ] HTML comment present in component file
- [ ] Visible attribution badge present (if UX spec requires)

**Rendering**
- [ ] Interactive renders correctly in QuestLearn's layout (dark theme, responsive)
- [ ] Works on mobile viewport
- [ ] No layout breaks when AI response is long/short

---

## Phase 5: Integration (Kit)

**Goal:** Wire the interactive into QuestLearn's navigation and lesson flow.

### Standalone Page

Create `src/app/interactive/[slug]/page.tsx`:

```tsx
// src/app/interactive/concept-map/page.tsx
import { Suspense } from 'react'
import { ConceptMapInteractive } from '@/components/interactives/ConceptMapInteractive'

export default function ConceptMapPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <ConceptMapInteractive />
    </Suspense>
  )
}
```

The component reads `?topic=` from search params.

### In-Flow Integration (Post-Socratic CTA)

In `LearnContent.tsx`, after Socratic dialogue completes, show:

```tsx
{socraticComplete && (
  <div className="border-t px-4 py-3 bg-emerald-500/5">
    <p className="text-xs text-muted-foreground mb-2">
      Great discussion! Want to visualise what you've learned?
    </p>
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.push(`/interactive/concept-map?topic=${encodeURIComponent(topic)}`)}
    >
      🗺️ Build a Concept Map
    </Button>
  </div>
)}
```

### Navigation

Add to format buttons in `/learn`:
- The `concept_map` format button already exists — it opens the Cogniti iframe in the right panel
- Standalone route (`/interactive/concept-map`) gives full-screen experience

### Lessons Learned

> *(Append after each completed integration)*

---

## Current Interactive Inventory

### Concept Map (Implemented — iframe embed)

| Property | Value |
|----------|-------|
| **Status** | ✅ Iframe embed live (PR #9) |
| **Component** | `src/components/learn/CognitiConceptMap.tsx` |
| **Interactive ID** | `69d0609388709ae18201f7d4` |
| **Embed URL** | `https://app.cogniti.ai/interactives/69d0609388709ae18201f7d4/run?topic=...` |
| **Agent ID** | `69d053d9324adcb67e01f97d` |
| **Agent URL** | `https://app.cogniti.ai/agents/69d053d9324adcb67e01f97d/chat` |
| **Integration** | In `/learn` as `format=concept_map`; right panel shows iframe |
| **Next step** | Phase 3: add standalone `/interactive/concept-map` + post-Socratic CTA |

**⚠️ Key exposure issue found in `LearnContent.tsx` line 23:**
```typescript
// CURRENT (insecure — key in client bundle):
const COGNITI_URL =
  process.env.NEXT_PUBLIC_COGNITI_AGENT_URL ??
  'https://app.cogniti.ai/agents/69d053d9324adcb67e01f97d/chat?k=_dJhhHwkvb2wLQdZAKlCSzp45MjspMhjK9ZCsCNqlh4';
```
This must be addressed in Phase 3: remove `?k=...` from the URL, proxy through backend.

### Flashcards (Implemented — iframe embed)

| Property | Value |
|----------|-------|
| **Status** | ✅ Iframe embed live |
| **Component** | `src/components/learn/CognitiFlashcards.tsx` |
| **Integration** | In `/learn` as `format=flashcards` |

---

## Concept Map — Phase 1 Analysis (Firefly)

> **Note:** The current concept map integration uses an **iframe embed** (`CognitiConceptMap.tsx`) rather than raw HTML/JS with `InteractiveAI.call()`. The Phase 1 analysis therefore focuses on the Agent API integration pattern rather than HTML code refactoring.

### InteractiveAI.call() Inventory

No `InteractiveAI.call()` sites found in QuestLearn codebase — the current Cogniti integration uses:
1. **Iframe embed** for the concept map interactive (`/interactives/69d0609388709ae18201f7d4/run`)
2. **Agent chat URL** for the Cogniti tutor (`/agents/69d053d9324adcb67e01f97d/chat`)

When Cogniti provides a raw HTML/JS interactive (not an iframe URL), this playbook's full Phase 1 analysis applies.

### Hard-coded Keys Found

| Location | Line | Issue |
|----------|------|-------|
| `src/components/learn/LearnContent.tsx` | 23 | `?k=_dJhhHwkvb2wLQdZAKlCSzp45MjspMhjK9ZCsCNqlh4` hardcoded in NEXT_PUBLIC var fallback — exposed in client bundle |

### Attribution Placement

- `CognitiConceptMap.tsx`: attribution label `"Cogniti Concept Map"` already present in header
- Add `<!-- Powered by Cogniti -->` HTML comment to component files
- Add `op://OpenClaw-Agents/Cogniti Agent API Key/credential` note to env docs

---

## Concept Map — Phase 2 Design (Firefly)

### Endpoints to Create

For the **Agent API integration** (powering the chat tutor + future interactive feedback):

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/cogniti/evaluate-connection` | POST | Evaluate concept map connections |
| `/api/cogniti/suggest-connections` | POST | Suggest related concepts |
| `/api/cogniti/explain-concept` | POST | Explain a concept in topic context |

### Request/Response Contracts

**POST /api/cogniti/evaluate-connection**
```typescript
// Request
{ topic: string, source: string, target: string, relationship: string }

// Response
{ valid: boolean | null, explanation: string, confidence: 'high' | 'medium' | 'low' | null, _stub?: boolean }
```

**POST /api/cogniti/suggest-connections**
```typescript
// Request
{ topic: string, concept: string, existingNodes?: string[] }

// Response
{ suggestions: string[], rationale: string, _stub?: boolean }
```

**POST /api/cogniti/explain-concept**
```typescript
// Request  
{ topic: string, concept: string, yearLevel?: string, context?: string }

// Response
{ explanation: string, level: string, _stub?: boolean }
```

### Frontend Refactoring Approach

The current `CognitiConceptMap.tsx` is a **thin iframe wrapper** — no `InteractiveAI.call()` sites.

For **Option C** (standalone + in-flow), the work is:
1. Create `src/app/interactive/concept-map/page.tsx` — standalone page
2. Update `CognitiConceptMap.tsx` to use `NEXT_PUBLIC_COGNITI_CONCEPTMAP_URL` (already done ✅)
3. Fix key exposure in `LearnContent.tsx` — move to server-side env var
4. Add post-Socratic CTA button in `LearnContent.tsx`

### Integration Plan (Option C)

1. **Standalone:** `src/app/interactive/concept-map/page.tsx` → reads `?topic=` param → renders `<CognitiConceptMap topic={topic} />`
2. **In-flow:** `LearnContent.tsx` → after Socratic dialogue → "Build a Concept Map" button → routes to `/interactive/concept-map?topic=...`

---

## Appendix: Common Cogniti Agent Prompts

### Concept Map

```
# evaluate-connection
"You are a Year {yearLevel} {subject} teacher.
Topic: {topic}
Evaluate this concept map connection: {source} --[{relationship}]--> {target}
Is this educationally valid? Return JSON: { valid: boolean, explanation: string, confidence: 'high'|'medium'|'low' }"

# suggest-connections  
"You are helping a student map the concept '{concept}' within the topic '{topic}' (Year {yearLevel} {subject}).
Existing nodes: {existingNodes}.
Suggest 3-5 new concepts to connect. Return JSON: { suggestions: string[], rationale: string }"
```

### Quiz

```
# evaluate-answer
"You are a {subject} teacher marking a Year {yearLevel} quiz.
Topic: {topic}, Question: {question}
Student answered: {studentAnswer}
Mark this answer. Return JSON: { correct: boolean, partial: boolean, feedback: string, score: number }"

# generate-hint
"Student is stuck on: {question} (Topic: {topic}, Year {yearLevel} {subject})
Give a helpful hint without revealing the answer. Return JSON: { hint: string, spoilerLevel: 'none'|'mild'|'strong' }"
```

### Knowledge Graph

```
# find-relationship
"Given two concepts in {topic}: '{conceptA}' and '{conceptB}'
What is their relationship? Return JSON: { relationship: string, direction: 'A→B'|'B→A'|'bidirectional', strength: 'strong'|'moderate'|'weak', explanation: string }"

# validate-graph
"Review this knowledge graph for {topic}: {edges (as JSON)}
Identify any incorrect connections. Return JSON: { errors: [{edge, issue}], corrections: [{edge, suggestion}] }"
```

---

## Quick Reference — Files to Touch (Concept Map, Phase 3)

| File | Action |
|------|--------|
| `src/app/interactive/concept-map/page.tsx` | CREATE — standalone page |
| `src/app/api/cogniti/evaluate-connection/route.ts` | CREATE — agent endpoint |
| `src/app/api/cogniti/suggest-connections/route.ts` | CREATE — agent endpoint |
| `src/app/api/cogniti/explain-concept/route.ts` | CREATE — agent endpoint |
| `src/components/learn/LearnContent.tsx` | EDIT — fix key exposure (line 23), add post-Socratic CTA |
| `src/components/learn/CognitiConceptMap.tsx` | EDIT — add attribution comment |
| `.env.local` + `.env.example` | EDIT — add `COGNITI_AGENT_KEY` |
| `src/app/interactive/concept-map/page.tsx` | CREATE — standalone wrapper |

---

*Playbook maintained by Loki. Update "Lessons Learned" section after each integration.*
