## Developer Feedback

### External Tools Used

| Tool | Role | Why |
|---|---|---|
| **Next.js 14 (App Router)** | Frontend + API layer | Server components made embedding Cogniti iframes trivial; API routes handled telemetry aggregation server-side without exposing Cogniti credentials to the browser. |
| **LibSQL / Turso** | Persistence | Lightweight edge-compatible SQLite. Used to store session events, topic selections, and format preferences for the teacher heatmap. Turso's branching made staging easy. |
| **Tailwind CSS** | Styling | Rapid iteration on the learn-page layout — especially the side-by-side tutor view that needed responsive breakpoints at multiple embed widths. |
| **Playwright** | E2E testing | Used to validate Cogniti iframe load behaviour across embedded contexts and confirm postMessage telemetry events were firing correctly. |
| **Vercel** | Deployment | Zero-config deploys on every push. Preview URLs were useful for sharing Cogniti embed prototypes with the team before main merges. |
| **CurricuLLM-AU** | Curriculum content engine | Our own tool. Generates Australian Curriculum v9–aligned learning content in five student-facing formats: game, story, meme, puzzle, and short film. Acts as the content layer that Cogniti's active learning tools then operate on. |
| **OpenClaw AI agents** | Development tooling | Used internally for code scaffolding, documentation drafting, and BUILD_PLAN generation during the build sprint. Not part of the student-facing product. |

---

### What We'd Love to See Added to Cogniti

These come from real friction points we hit during the build. All of them are solvable — we're flagging them because we think they'd meaningfully expand what developers can do with the platform.

#### 1. URL Parameters for Mini App Initialisation

Right now, injecting context (e.g. the current topic) into a Cogniti interactive requires postMessage after iframe load. This works, but it's fragile — the parent has to time the message correctly, and there's no handshake acknowledgement to confirm receipt.

A `?topic=photosynthesis&strand=biological-sciences` query param on the mini app URL would make static embeds trivial and eliminate the timing problem. Even a simple `?init=<base64-encoded-json>` payload would be a significant improvement.

#### 2. Telemetry Webhooks with a Structured Event Schema

We built `/api/cogniti/telemetry` to poll Cogniti event data for the teacher dashboard. Polling works, but webhooks would be far more reliable — and more importantly, a **documented, versioned event schema** would let us build against it with confidence.

Suggested schema baseline:
```json
{
  "event": "flashcard.rated",
  "interactiveId": "...",
  "sessionId": "...",
  "userId": "...",
  "timestamp": "...",
  "data": {
    "cardId": "...",
    "confidence": 2,
    "responseText": "..."
  }
}
```

This would make Cogniti a first-class data source for LMS integrations, not just a UI embed.

#### 3. Curriculum Tagging for Agents and Mini Apps

There's no native way to associate a Cogniti agent or interactive with a curriculum standard (e.g. AC v9 strand, content descriptor, or year level). We had to manage this mapping ourselves in our own DB.

If Cogniti supported metadata tags like `curriculum: "AC v9"`, `strand: "Biological Sciences"`, `year_level: "9"`, or `content_descriptor: "AC9S9U01"`, it would unlock filtering, reporting, and cross-platform interoperability. This is table stakes for EdTech adoption in Australian schools.

#### 4. Teacher-Facing Analytics in the Cogniti Platform

Cogniti's current analytics surface is student-facing. Teachers need aggregate views: class-level confidence scores, topic coverage gaps, time-on-task per interactive. We built this ourselves via the telemetry API, but it took significant effort and the data model had to be inferred.

A native teacher analytics dashboard — even a simple one with per-session and per-cohort rollups — would make Cogniti usable in classrooms without requiring every developer to rebuild the same reporting layer.

#### 5. Public Embed Permissions with Usage Tracking

Embedding a Cogniti interactive currently requires the viewer to be a member of the org, which creates a significant barrier for open deployments (e.g. a school deploying to all students without individual Cogniti accounts). A **public embed mode** — similar to how Figma or Loom handle public share links — with optional usage analytics (views, completions, average confidence) would dramatically expand adoption.

We'd suggest keeping authenticated embeds for anything with user-specific data persistence, and offering public-mode embeds for read/interact-only contexts.

#### 6. Structured Output Schemas for AI Critique

The AI feedback returned by Cogniti mini apps (e.g. concept map evaluation, flashcard critique) comes back as free text. For a standalone student experience this is fine — but when you're aggregating feedback across a class, you want structure.

Supporting a configurable **function call schema** for interactive AI responses would let developers extract structured fields (e.g. `{ "accuracy": 0.8, "gaps": ["lacks detail on chlorophyll role"], "suggestion": "..." }`) alongside the human-readable text. This would enable teacher dashboards to surface actionable insights rather than just raw AI prose.

---

Overall, Cogniti's embed model is genuinely well-suited for the kind of layered integration we built here. The above are the natural next steps for making it a serious platform for curriculum-aligned, data-aware educational tooling.
