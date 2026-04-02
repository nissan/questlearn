# QuestLearn 🎯

> **AI-powered adaptive learning that meets students where their curiosity already lives.**

Cambridge EduX Hackathon 2026 (Oceania Edition) · **Challenge 2: Designing AI-Incorporated Learning Experiences that Support Active Learning**

---

## The Idea

A Year 9 student stuck on photosynthesis doesn't open a textbook. They pick a format — a **meme**, a **story**, a **puzzle**, a **game**, or a **short film** — and our AI generates curriculum-aligned content in that format, instantly. Then it asks them questions back. Not to test them. **To make them think.**

A student in Bourke gets the same experience as a student in Bondi.

## The Gap We're Closing

| Metric | Indigenous/Remote | Urban/National | Gap |
|--------|------------------|----------------|-----|
| NAPLAN "Strong/Exceeding" | 24% | 70.7% | **46.7 pp** |
| Year 12 completion | 57% | 79.9% | **22.9 pp** |
| School attendance ≥90% days | 36.8% | 61.6% | **24.8 pp** |
| Teacher turnover (remote) | 40–60%/yr | ~10%/yr | **40–50 pp** |

## Learning Framework

Each format maps to one of Laurillard's 6 Conversational Learning Types:

| Format | Learning Type | What it activates |
|--------|--------------|-------------------|
| 🎮 Game | Practice | Apply knowledge in context |
| 📖 Story | Acquisition | Absorb new concepts |
| 😂 Meme | Production | Create to demonstrate understanding |
| 🧩 Puzzle | Investigation | Explore and discover |
| 🎬 Short Film | Discussion | Reflect and dialogue |

## Design Principles

- **No leaderboards** — personal progress only, never competitive
- **Wrong answers get memes, not buzzers** — encouragement + explanation, no fail states
- **Student agency is the feature** — we never assign a format, student always chooses
- **Privacy by design** — no persistent student data, teacher sees aggregated heatmap only

## Tech Stack

- **Frontend:** Next.js 14 + Tailwind CSS
- **AI:** [CurricuLLM-AU](https://curricullm.com) — OpenAI-compatible API, Australian Curriculum v9 native
- **Deploy:** Vercel
- **Prototype:** [humble-reef-v4xf.here.now](https://humble-reef-v4xf.here.now/)

## Repository Structure

```
questlearn/
├── README.md
├── docs/
│   ├── BUILD_PLAN.md              # 6-phase build plan
│   ├── CURRICULLM-SPEC.md         # CurricuLLM integration spec + system prompts
│   ├── architecture/
│   │   └── ARCHITECTURE.md        # Mermaid architecture diagrams
│   ├── features/
│   │   ├── student-flow.feature   # BDD scenarios — student journey
│   │   ├── teacher-dashboard.feature
│   │   └── content-generation.feature
│   └── research/
│       ├── TOOLS-COGNITI-CURRICULLM.md   # Partner tool deep-dive
│       └── EDUCATION-GAP-STATS.md        # Australian education gap statistics
└── landing/
    └── index.html                 # Landing page (also at frosty-jetty-s7ny.here.now)
```

## Team

- **Nissan** — Backend, LLM integration, architecture
- **Anusha** — Frontend, UX, design

## Hackathon Timeline

| Date | Milestone |
|------|-----------|
| Apr 2 | Opening Ceremony @ Microsoft Sydney ✅ |
| Apr 3 | Track selection deadline (11:59 PM) |
| Apr 3–8 | Build sprint |
| Apr 8 | Submission deadline — demo video + pitch deck (11:59 PM) |
| Apr 9 | Final Expo & Showcase @ UTS Building 11 (1:30–6 PM) |

---

*Built with ❤️ for students everywhere — Bourke to Bondi.*
