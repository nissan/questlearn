# BUILD_PLAN-meme.md — QuestLearn Meme Format Image Generation

**Author:** Firefly  
**Date:** 2026-04-04  
**Status:** Ready for Kit  
**Scope:** 4 files changed (1 new API route, 1 new component, 2 modified files)

---

## Overview

When a student selects the **Meme** format and receives a response from the AI tutor, the app should render a **visual meme card** instead of a plain text bubble. The meme card shows:

- Top text (setup / question line) in Impact-style bold white font with black stroke
- AI-generated background image (~512×512, topic-relevant, via fal.ai flux-schnell)
- Bottom text (punchline / learning point) in the same Impact style
- A **Share** button that copies the image URL to clipboard

The image is generated server-side via `POST /api/generate/meme`. The fal.ai key lives in 1Password and is read at runtime — it never touches the client.

All other formats (Story, Puzzle, Game, Short Film, Flashcards, Concept Map) are **unaffected**.

---

## Architecture Summary

```
Student selects Meme format
  → LearnContent.tsx calls /api/learn/generate (existing)
  → AI returns body with TOP: ... / BOTTOM: ... format
  → LearnContent parses topText + bottomText
  → LearnContent calls /api/generate/meme { topic, topText, bottomText }
  → API route reads FAL_API_KEY from env, calls fal.ai flux-schnell
  → Returns { imageUrl }
  → LearnContent renders <MemeCard topText bottomText imageUrl />
  → On fal.ai failure: MemeCard renders text-only fallback (dark bg + white text)
```

---

## Files Changed

### 1. `src/app/api/generate/meme/route.ts` ← **NEW FILE**

New API route. Accepts `{ topic, topText, bottomText }`, calls fal.ai, returns `{ imageUrl }`.

```
src/app/api/generate/
└── meme/
    └── route.ts   ← create this
```

**Key points:**
- Auth check first: `getSession()` — return 401 if null (same pattern as all other routes)
- Read `FAL_API_KEY` from `process.env` (never from client)
- Call fal.ai REST API with native `fetch` (no new npm packages)
- fal.ai endpoint: `https://fal.run/fal-ai/flux/schnell`
- Image prompt should be topic-relevant but NOT include the text overlay (that's rendered in CSS)
- Suggested image prompt: `"Educational illustration about [topic], meme-style background, vibrant colors, no text"`
- Return `{ imageUrl: string }` on success
- Return `{ imageUrl: null, error: string }` on fal.ai failure (do NOT 500 — let client fall back gracefully)

**fal.ai REST call shape:**
```typescript
const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
  method: 'POST',
  headers: {
    'Authorization': `Key ${process.env.FAL_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: `Educational illustration about ${topic}, meme-style background, vibrant, no text`,
    image_size: 'square',   // 512x512 equivalent
    num_inference_steps: 4, // schnell is fast — 4 steps is fine
    num_images: 1,
  }),
});
const data = await response.json();
const imageUrl = data?.images?.[0]?.url ?? null;
```

**Full route skeleton:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { topic, topText, bottomText } = await req.json();
  if (!topic || !topText || !bottomText) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const falKey = process.env.FAL_API_KEY;
  if (!falKey) {
    // Graceful: no key configured → signal fallback to client
    return NextResponse.json({ imageUrl: null, error: 'FAL_API_KEY not configured' });
  }

  try {
    const res = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Educational illustration about ${topic}, meme-style background, vibrant colors, no text, no watermark`,
        image_size: 'square',
        num_inference_steps: 4,
        num_images: 1,
      }),
    });
    const data = await res.json();
    const imageUrl: string | null = data?.images?.[0]?.url ?? null;
    return NextResponse.json({ imageUrl });
  } catch (err) {
    console.error('[meme] fal.ai error:', err);
    return NextResponse.json({ imageUrl: null, error: 'Image generation failed' });
  }
}
```

---

### 2. `src/components/learn/MemeCard.tsx` ← **NEW FILE**

Renders the meme card. Accepts props: `topText`, `bottomText`, `imageUrl` (nullable), `topic`.

**Rendering logic:**
- If `imageUrl` is provided: render `<img>` as the card background
- If `imageUrl` is null (fallback): render a dark gradient background (`bg-gray-900`)
- Text overlay in both cases: white Impact-style text with black text-shadow for readability
- "Share" button: `navigator.clipboard.writeText(imageUrl)` — show "Copied!" toast for 2s
- If no imageUrl, Share button copies a placeholder or is hidden

**Tailwind + inline style approach for Impact font:**

Impact is a web-safe font. Use `style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}` on the text divs. No new package needed.

**Text shadow for meme readability:**
```tsx
style={{
  fontFamily: "'Impact', 'Arial Black', sans-serif",
  textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
  letterSpacing: '0.02em',
}}
```

**Component skeleton:**
```tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MemeCardProps {
  topText: string;
  bottomText: string;
  imageUrl: string | null;
  topic: string;
  isLoading?: boolean;
}

export function MemeCard({ topText, bottomText, imageUrl, topic, isLoading }: MemeCardProps) {
  const [copied, setCopied] = useState(false);

  function handleShare() {
    if (!imageUrl) return;
    navigator.clipboard.writeText(imageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const memeTextStyle: React.CSSProperties = {
    fontFamily: "'Impact', 'Arial Black', sans-serif",
    textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
    letterSpacing: '0.03em',
  };

  if (isLoading) {
    return (
      <div className="relative w-full max-w-sm mx-auto aspect-square bg-gray-800 rounded-xl flex items-center justify-center animate-pulse">
        <span className="text-white text-sm opacity-60">Generating meme…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-full max-w-sm mx-auto aspect-square rounded-xl overflow-hidden bg-gray-900 shadow-2xl">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`Meme about ${topic}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Dark overlay for text readability when no image */}
        {!imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950" />
        )}
        {/* Top text */}
        <div className="absolute top-3 left-0 right-0 px-4 text-center">
          <p className="text-white text-xl font-black uppercase leading-tight" style={memeTextStyle}>
            {topText}
          </p>
        </div>
        {/* Bottom text */}
        <div className="absolute bottom-3 left-0 right-0 px-4 text-center">
          <p className="text-white text-xl font-black uppercase leading-tight" style={memeTextStyle}>
            {bottomText}
          </p>
        </div>
      </div>
      {imageUrl && (
        <Button variant="outline" size="sm" onClick={handleShare}>
          {copied ? '✅ Copied!' : '🔗 Share meme'}
        </Button>
      )}
    </div>
  );
}
```

---

### 3. `src/lib/curricullm-client.ts` ← **MODIFY**

**Change:** Update the `meme` system prompt to output `TOP: / BOTTOM:` format instead of the current `TITLE: / PUNCHLINE: / CAPTION:` format.

**Current meme system prompt body format instruction (line ~52):**
```
- Format the body as: "TITLE: [title]\\nPUNCHLINE: [punchline]\\nCAPTION: [caption]"
```

**Replace with:**
```
- Format the body as EXACTLY: "TOP: [setup/question — 5-10 words]\\nBOTTOM: [punchline/learning point — 5-10 words]\\nCAPTION: [2-3 sentences explaining the concept behind the joke]"
- The TOP line is the setup or question (think: top text of a classic meme)
- The BOTTOM line is the punchline that reveals the concept (think: bottom text of a classic meme)
- Both TOP and BOTTOM must be SHORT — they will be displayed as visual text overlays on an image
```

**Why:** `LearnContent.tsx` will parse `body` with regex to extract `topText` and `bottomText`. The CAPTION field is preserved so the existing content card still has explanatory text if needed.

**No other changes to this file.**

---

### 4. `src/components/learn/LearnContent.tsx` ← **MODIFY**

**Changes:**

#### 4a. Add import for `MemeCard` (top of file, after existing imports):
```tsx
import { MemeCard } from '@/components/learn/MemeCard';
```

#### 4b. Add meme state variables (inside `LearnContent` function, after existing `useState` declarations):
```tsx
const [memeImageUrl, setMemeImageUrl] = useState<string | null>(null);
const [memeTopText, setMemeTopText] = useState('');
const [memeBottomText, setMemeBottomText] = useState('');
const [memeLoading, setMemeLoading] = useState(false);
```

#### 4c. Add a `parseMemeBody` helper (inside the component, before the return):
```tsx
function parseMemeBody(body: string): { topText: string; bottomText: string } {
  const topMatch = body.match(/^TOP:\s*(.+)/im);
  const bottomMatch = body.match(/^BOTTOM:\s*(.+)/im);
  return {
    topText: topMatch?.[1]?.trim() ?? 'Did you know...',
    bottomText: bottomMatch?.[1]?.trim() ?? '...it was actually this simple.',
  };
}
```

#### 4d. Add `generateMemeImage` async function (inside the component):
```tsx
async function generateMemeImage(topic: string, topText: string, bottomText: string) {
  setMemeLoading(true);
  setMemeImageUrl(null);
  try {
    const res = await fetch('/api/generate/meme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, topText, bottomText }),
    });
    const data = await res.json();
    setMemeImageUrl(data.imageUrl ?? null); // null triggers fallback in MemeCard
  } catch {
    setMemeImageUrl(null); // fallback
  } finally {
    setMemeLoading(false);
  }
}
```

#### 4e. Trigger meme generation when content loads and format is meme:

In the existing `load()` function inside `useEffect`, after `setContent(contentData)` and `setChat(...)`:
```tsx
if (format === 'meme' && contentData?.body) {
  const { topText, bottomText } = parseMemeBody(contentData.body);
  setMemeTopText(topText);
  setMemeBottomText(bottomText);
  generateMemeImage(topic, topText, bottomText);
}
```

Also reset meme state on format change (add to the top of `load()`):
```tsx
setMemeImageUrl(null);
setMemeTopText('');
setMemeBottomText('');
```

#### 4f. Add meme card rendering in the left content pane:

In the content pane JSX, add a meme branch **before** the `loadingContent` check (alongside the existing `flashcards` and `concept_map` branches):

```tsx
{format === 'meme' && !loadingContent && content ? (
  <div className="space-y-4">
    <MemeCard
      topText={memeTopText}
      bottomText={memeBottomText}
      imageUrl={memeImageUrl}
      topic={topic}
      isLoading={memeLoading}
    />
    {/* Optional: show the caption/explanation below the meme card */}
    {content.body.match(/^CAPTION:\s*(.+)/im)?.[1] && (
      <p className="text-xs text-muted-foreground text-center px-4">
        {content.body.match(/^CAPTION:\s*(.+)/im)?.[1]}
      </p>
    )}
  </div>
) : /* ... existing loadingContent / content branches unchanged ... */}
```

**IMPORTANT:** The meme branch wraps the `<MemeCard>` AND keeps the existing `else if (loadingContent)` and `else if (content)` branches intact. Only add the meme branch — do NOT remove or alter any other branch.

---

## Environment Variables

Add to `.env.local` (and Vercel project settings):

```
FAL_API_KEY=<value from: op read "op://OpenClaw/Fal.ai API Credentials/credential">
```

The key is **server-side only**. Do NOT prefix with `NEXT_PUBLIC_`.

---

## BDD Scenarios (Gherkin)

```gherkin
Feature: Meme format image generation

  Background:
    Given the student is authenticated
    And the student has selected the topic "Photosynthesis"

  Scenario: Happy path — meme renders with AI-generated image
    Given the student selects the "Meme" format
    When the AI tutor returns a response with "TOP: Plants eating sunlight" and "BOTTOM: Solar panels wish they were this efficient"
    Then the app calls POST /api/generate/meme with { topic, topText, bottomText }
    And the fal.ai API returns a valid image URL
    And a MemeCard is displayed with the topic image as background
    And the top text "PLANTS EATING SUNLIGHT" appears at the top of the card
    And the bottom text "SOLAR PANELS WISH THEY WERE THIS EFFICIENT" appears at the bottom
    And a "🔗 Share meme" button is visible

  Scenario: Fallback — fal.ai error renders text-only meme
    Given the student selects the "Meme" format
    When the AI tutor returns a valid meme response
    And the fal.ai API returns an error or times out
    Then /api/generate/meme returns { imageUrl: null }
    And a MemeCard is displayed with a dark gradient background (no image)
    And the top and bottom text are still visible in Impact-style font
    And no "Share meme" button is shown

  Scenario: Format isolation — Story format renders text bubble, not meme card
    Given the student selects the "Story" format
    When the AI tutor returns a story response
    Then no MemeCard component is rendered
    And the response is displayed in the standard chat bubble format
    And /api/generate/meme is NOT called

  Scenario: API security — unauthenticated request to /api/generate/meme is rejected
    Given the student is NOT authenticated (no valid session cookie)
    When a POST request is sent to /api/generate/meme with valid body
    Then the API returns HTTP 401
    And the response body contains { "error": "Unauthorized" }
    And no fal.ai API call is made

  Scenario: Meme text is rendered in Impact-style uppercase font
    Given the student selects the "Meme" format
    When a MemeCard is rendered with any topText and bottomText
    Then the text is displayed in Impact font (or Arial Black fallback)
    And the text has a black stroke/shadow for readability against any background

  Scenario: Share button copies image URL to clipboard
    Given a MemeCard is rendered with a valid imageUrl
    When the student clicks "🔗 Share meme"
    Then the imageUrl is written to the clipboard
    And the button text changes to "✅ Copied!" for 2 seconds
    And then reverts to "🔗 Share meme"
```

---

## Phase Breakdown

### Phase 1 — API Route (Kit can build and test independently)

**Goal:** Working `POST /api/generate/meme` that authenticates, calls fal.ai, and returns `{ imageUrl }`.

**Files:**
- Create: `src/app/api/generate/meme/route.ts`

**Steps:**
1. Create the directory: `src/app/api/generate/meme/`
2. Implement the route (see full skeleton above)
3. Read `FAL_API_KEY` from `process.env.FAL_API_KEY`
4. Auth check with `getSession()` → 401 if null
5. Validate `{ topic, topText, bottomText }` → 400 if missing
6. Call fal.ai REST endpoint with native fetch
7. Return `{ imageUrl }` or `{ imageUrl: null, error }` (never 500 from fal.ai failures)

**Smoke test:**
```bash
# Should return 401
curl -X POST http://localhost:3000/api/generate/meme \
  -H "Content-Type: application/json" \
  -d '{"topic":"test","topText":"hi","bottomText":"bye"}'

# With valid session cookie:
curl -X POST http://localhost:3000/api/generate/meme \
  -H "Content-Type: application/json" \
  -H "Cookie: ql_session=<valid_jwt>" \
  -d '{"topic":"Photosynthesis","topText":"When plants eat sunlight","bottomText":"Solar panels shaking"}'
# → { "imageUrl": "https://..." }
```

**Done when:** 401 for unauthenticated, valid imageUrl returned for authenticated request with FAL_API_KEY set.

---

### Phase 2 — MemeCard Component (Kit can build independently after Phase 1)

**Goal:** Working `<MemeCard>` that renders correctly in both image and fallback modes.

**Files:**
- Create: `src/components/learn/MemeCard.tsx`

**Steps:**
1. Create component with props: `{ topText, bottomText, imageUrl, topic, isLoading? }`
2. Implement loading skeleton (pulse animation)
3. Implement image mode (imageUrl not null)
4. Implement fallback mode (imageUrl null → dark gradient bg)
5. Implement Impact-style text overlay (inline style, no new package)
6. Implement Share button with clipboard + "Copied!" feedback
7. Export as named export `MemeCard`

**Verification:** Render a Storybook or quick test page with `imageUrl={null}` and `imageUrl="https://picsum.photos/512"` to check both modes visually.

**Done when:** Component renders correctly in both modes, Share button works.

---

### Phase 3 — LearnContent Wiring (Kit should do after Phases 1 + 2)

**Goal:** Wire the meme API call and MemeCard into `LearnContent.tsx`, and update the AI prompt.

**Files:**
- Modify: `src/components/learn/LearnContent.tsx`
- Modify: `src/lib/curricullm-client.ts`

**Steps (in order):**

1. **`curricullm-client.ts`:** Update the `meme` case in `getSystemPrompt()`:
   - Change the body format instruction from `TITLE: / PUNCHLINE: / CAPTION:` to `TOP: / BOTTOM: / CAPTION:`
   - Keep CAPTION for explanation text
   - Keep all other meme prompt rules unchanged

2. **`LearnContent.tsx`:** Add import for `MemeCard`

3. **`LearnContent.tsx`:** Add 4 new state variables (`memeImageUrl`, `memeTopText`, `memeBottomText`, `memeLoading`)

4. **`LearnContent.tsx`:** Add `parseMemeBody()` helper function

5. **`LearnContent.tsx`:** Add `generateMemeImage()` async function

6. **`LearnContent.tsx`:** In the `load()` useEffect function:
   - Reset meme state at the top
   - After `setContent(contentData)`, check `format === 'meme'` and trigger `generateMemeImage()`

7. **`LearnContent.tsx`:** In the left-panel JSX, add the meme branch:
   - Condition: `format === 'meme' && !loadingContent && content`
   - Render `<MemeCard>` with current state
   - Show CAPTION text below the card
   - Keep all other branches (loadingContent, flashcards, concept_map, etc.) **unchanged**

**Critical:** Do NOT modify the right-panel (tutor/chat) — meme format should still show the Socratic dialogue in the right panel.

**Done when:** Selecting Meme format loads content, shows loading MemeCard, then renders with image (or fallback). Other formats are unaffected.

---

## Rollback Notes

This feature is **entirely additive**:
- The API route is new — deleting `src/app/api/generate/meme/` fully removes it
- The MemeCard component is new — deleting `src/components/learn/MemeCard.tsx` fully removes it
- LearnContent.tsx changes are gated by `format === 'meme'` — reverting the 4c–4f additions restores original behaviour
- The `curricullm-client.ts` prompt change only affects the `meme` format — reverting the body format line restores the original TITLE/PUNCHLINE format

If rollback is needed:
1. Revert `src/lib/curricullm-client.ts` to `TITLE: / PUNCHLINE: / CAPTION:` format
2. Remove meme state vars and `parseMemeBody` / `generateMemeImage` from `LearnContent.tsx`
3. Remove the meme branch from the left-panel JSX
4. Remove the `MemeCard` import
5. Delete `src/components/learn/MemeCard.tsx`
6. Delete `src/app/api/generate/meme/route.ts`
7. Remove `FAL_API_KEY` from env (or leave it — it's unused without the route)

No DB schema changes. No migrations. No dependencies to remove.

---

## Kit Instructions

Kit, here's everything you need to build this without asking questions:

### Environment
- Repo: `/Users/loki/projects/questlearn`
- Stack: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- Auth: `import { getSession } from '@/lib/auth'` — returns `{ sessionId, userId }` or `null`
- shadcn components available: `Button`, `Card`, `CardContent`, `CardHeader`, `CardTitle`, `Badge`, `Skeleton`, `Textarea`, `ScrollArea`, `Separator`
- No new npm packages — use native `fetch` for fal.ai

### Env var for fal.ai
`FAL_API_KEY` must exist in `.env.local`. At runtime (CI/prod): `op read "op://OpenClaw/Fal.ai API Credentials/credential"`.

### Build order
1. Phase 1 first (API route) — it's self-contained and testable
2. Phase 2 second (MemeCard) — it's self-contained and testable
3. Phase 3 last (wiring) — depends on Phase 1 and Phase 2

### Do NOT
- Add `NEXT_PUBLIC_` prefix to `FAL_API_KEY`
- Modify any other API routes
- Change the right-panel (chat/tutor) in `LearnContent.tsx`
- Add any npm packages
- Touch DB schema or migrations
- Modify any non-meme format paths

### Testing
After Phase 3, manually verify:
1. Log in → select a topic → select Meme format
2. Left panel shows `MemeCard` loading skeleton, then resolves to image + text
3. Switch to Story format → left panel shows text card (no MemeCard)
4. Switch back to Meme → MemeCard loads again
5. Share button copies image URL and shows "Copied!" toast

If `FAL_API_KEY` is not set in `.env.local`, the API route returns `{ imageUrl: null }` and MemeCard renders the dark gradient fallback — this is expected and correct behaviour.

---

## Open Questions / Notes for Nissan

1. **Image content moderation:** fal.ai flux-schnell has basic safety filters. For a school product, consider adding explicit prompt safety suffixes (e.g., `"safe for school, educational, no violence"`). This can be added to the image prompt in the API route.

2. **Rate limiting:** fal.ai charges per image. No rate limiting is currently in the API route. Consider adding per-user rate limiting (e.g., 5 memes/hour) via a Redis counter or in-memory map in a follow-up.

3. **Image hosting:** fal.ai returns a CDN URL that expires. If the Share button should share a permanent link, a future phase could download + re-host to Vercel Blob or similar. For now, the Share button shares the fal.ai URL as-is.

4. **CAPTION rendering:** The CAPTION from the meme format is rendered as a small text block below the card. If this is unwanted, remove the CAPTION regex match in the JSX (one line).
