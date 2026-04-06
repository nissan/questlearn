# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Build & Run Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run db:init      # Initialize Turso database schema (requires .env.local)
npm run test         # Run Vitest unit/integration tests
npm run test:watch   # Run Vitest in watch mode
npm run test:ui      # Run Vitest with browser UI
npm run test:e2e     # Run Playwright E2E tests (Desktop Chrome, iPad, iPhone 13)
npm run test:e2e:screenshots  # Run screenshot-only test suite
npm run test:e2e:report       # Open Playwright HTML report
```

## Testing

- **Unit/integration tests**: Vitest with happy-dom, `@testing-library/react`, and `@testing-library/jest-dom`. Tests live in `src/__tests__/` mirroring the source tree. Cogniti connectivity tests are excluded from the default run (see `vitest.config.ts` exclude).
- **E2E tests**: Playwright against 3 viewports (Desktop 1280x800, Tablet 768x1024, Mobile 375x812) with 2 retries. Tests in `tests/`.
- Path alias `@/` → `src/` is configured in both `tsconfig.json` and `vitest.config.ts`.

## Architecture

**QuestLearn** is an Australian Curriculum-aligned (v9) learning platform for Years 8–10 students. Students pick a topic and a learning format, then engage in AI-generated Socratic dialogue.

### Tech Stack
- **Next.js 16** (App Router) with React 19 — deployed on Vercel
- **Turso/LibSQL** (edge SQLite) for persistence — singleton client in `src/lib/db.ts`
- **OpenAI API** via the `openai` SDK — used through CurricuLLM-AU, the content generation engine (`src/lib/curricullm-client.ts`)
- **Zustand** for client state management
- **Tailwind CSS v4** + shadcn/ui components (`src/components/ui/`)
- **React Flow** (`reactflow`) for the interactive Concept Map
- **Sentry** for error tracking, **PostHog** for analytics, **Langfuse** for LLM observability

### Key Modules

- **CurricuLLM client** (`src/lib/curricullm-client.ts`): Generates curriculum-aligned content in multiple formats and Socratic follow-ups. Falls back to stub content when `CURRICULLM_API_KEY` is missing or API errors occur. Stubs in `src/lib/stubs/`.
- **Learning formats** (`src/lib/formats.ts`): 8 format types split into `primary` (meme, flashcards, concept_map, debate) and `secondary` (game, story, puzzle, short_film — marked "Coming Soon").
- **Interactive mini apps** (`src/components/interactive/`): Self-contained React components for Flashcards, ConceptMap, and Debate — these are QuestLearn-native implementations (not Cogniti iframes) backed by dedicated API routes under `src/app/api/questlearn/`.
- **Auth** (`src/lib/auth.ts`): JWT-based sessions using `jose`, stored in `ql_session` cookie. Two auth systems: email-based (`ql_users`) and Lumina OS registration (`lumina_users`).
- **DB schema** (`src/lib/schema.ts`): All tables as raw SQL DDL — `ql_users`, `ql_sessions`, `learning_sessions`, `engagement_events`, `content_cache`, `lumina_users`.

### Page Structure

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/onboarding` | Student onboarding flow |
| `/learn` | Main learning experience (topic + format → AI content + Socratic tutor) |
| `/student-dashboard` | Student progress view |
| `/teacher` | Teacher dashboard (heatmap, engagement, live activity) |
| `/desktop` | Lumina OS — desktop-style UI with windowed apps |
| `/pitch` | Pitch/showcase page |
| `/presentation` | Slide-style presentation |
| `/demo/[slug]` | Demo walkthrough pages |
| `/value-prop` | Value proposition page |
| `/student-journey` | Student journey visualization |
| `/showcase` | Video gallery showcase |
| `/judge-cheatsheet`, `/judge-faq` | Judge-facing reference pages |

### API Routes (`src/app/api/`)

- `auth/` — Logout, Lumina registration
- `learn/` — Content generation and Socratic dialogue endpoints
- `generate/meme`, `generate/meme-text` — Meme image and text generation
- `questlearn/flashcards/` — Flashcard generation and explanation evaluation
- `questlearn/concept-map/` — Concept generation, connection evaluation, map evaluation
- `questlearn/debate/` — Motion generation, argument exchange, conversation start
- `cogniti/telemetry` — Telemetry proxy for Cogniti iframe events
- `upload/video` — Video upload endpoint
- `teacher/`, `student/`, `topics/` — Data endpoints for dashboards
- `health/` — Health check
- `onboarding/` — Onboarding persistence

### Lumina OS

The `/desktop` route renders a simulated desktop OS ("Lumina OS") with draggable/resizable windows (`react-rnd`), a dock, menu bar, and app launcher. Components in `src/components/os/`. Includes a MiniAppsWindow for launching interactive learning tools within the OS.

### Cogniti Integration

Some formats can embed Cogniti mini apps via iframes. Communication uses `postMessage`. Telemetry events are proxied through `/api/cogniti/telemetry`. The primary interactive formats (flashcards, concept map, debate) now have QuestLearn-native implementations in `src/components/interactive/`.

## Environment

Copy `.env.example` to `.env.local`. Secrets are in 1Password (vault: OpenClaw-Agents). The app runs in mock/stub mode when `CURRICULLM_API_KEY` is not set — all LLM features return hardcoded content from `src/lib/stubs/`.

## Important Conventions

- Next.js 16 has breaking changes from earlier versions. Read docs in `node_modules/next/dist/docs/` before writing Next.js code. Heed deprecation notices.
- The `openai` SDK is used with the CurricuLLM-AU key, not directly with OpenAI. The model defaults to `gpt-4o-mini` but is configurable via `CURRICULLM_MODEL`.
- Content generation always has a stub fallback path — never let LLM failures break the student experience.
- Formats have a `tier` field: `primary` formats are fully implemented, `secondary` formats show "Coming Soon" badges.
