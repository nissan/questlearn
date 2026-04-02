# EduX Tool Research — Cogniti & CurricuLLM
_Researched by Archie — 2026-04-02_

---

## Cogniti

### What it is

**Cogniti** is an AI agent platform built *by educators, for educators* at the University of Sydney (developed by Professor Danny Liu, Educational Innovation team). It won the AFR AI Award in 2025 and is used by 30+ institutions across Australia, NZ, and Singapore.

**Core concept:** Teachers create custom "AI agents" (steerable chatbots) with system prompts that shape how the LLM behaves. Students interact with those agents — they never see the underlying prompt. It's a no-code front-end over GPT-4, Claude 3, Gemini, etc.

**Key features:**
- **System message steering** — educator writes a natural-language prompt that steers AI behavior (e.g. "Act as a Socratic tutor, never give the answer")
- **RAG over resources** — upload lecture notes, PDFs, web pages; agent does semantic search retrieval before answering
- **Knowledge injection** — alternative to RAG: smaller docs are injected verbatim every turn (entire doc, always read)
- **Conversation starters** — preset buttons to help students kick off sessions
- **LMS embedding** — agents embed directly into Canvas, Moodle, Brightspace, Schoolbox via LTI 1.3
- **Teacher visibility** — educators can see all student conversations
- **Multi-model** — GPT-4, Claude 3, Gemini, Mistral; model switchable per org
- **Multilingual** — 100+ languages supported

**What it is NOT:**
- Not a REST API for programmatic content generation
- Not a tool you call from backend code
- It's a *platform* — users log in and interact with pre-built agents via the web UI

**Access for hackathon:**
- Platform: https://app.cogniti.ai/
- Register for advanced functions: https://forms.office.com/e/VZgACZAhhY
- 1 account per team, unlimited access during hackathon

### API / Technical Docs

Cogniti does **not expose a public REST API** for programmatic access. It is a web platform. Key technical notes:

- **Authentication:** Australian Access Federation (AAF for universities), Microsoft (institutional or personal), or Google OAuth
- **LTI 1.3:** Canvas, Moodle, Brightspace, Schoolbox integration — add as LTI plugin, then embed agents in course pages
- **API key format for orgs (admin only):**
  - OpenAI hosted by OpenAI: `sk-...` (standard OpenAI key)
  - OpenAI hosted by Azure: `<deployment>:<key>@<endpoint URL>`
  - Azure via APIM: `apim::<deployment>:<key>@https://<apim endpoint>.azure-api.net/<suffix>`
  - Azure Speech: `<location>:<key>@<endpoint>`
- **Canvas API integration** is supported (Brightspace API coming soon)
- **Infrastructure:** Microsoft Azure (app, database, embeddings)
- **RAG internals:** Semantic + text search over resources → snippets retrieved → injected into prompt (RAG pattern)

**Docs index:** https://cogniti.ai/docs/

Key doc pages:
- https://cogniti.ai/docs/why-cogniti/
- https://cogniti.ai/docs/how-does-cogniti-work/
- https://cogniti.ai/docs/how-do-i-create-an-agent/
- https://cogniti.ai/docs/how-do-i-configure-an-agent/
- https://cogniti.ai/docs/how-do-i-design-a-good-system-message/
- https://cogniti.ai/docs/how-are-resources-used-by-agents/
- https://cogniti.ai/docs/what-is-the-difference-between-agent-resources-and-knowledge/
- https://cogniti.ai/docs/how-do-i-set-my-organisations-api-keys/

### GitHub / Open Source

Cogniti does **not have a public GitHub repository**. It is a closed-source platform developed by University of Sydney. No SDK found.

### Integration with QuestLearn

Since Cogniti has no API, the integration model for QuestLearn is **UI-based or iframe embedding**:

**Option A — Build Cogniti agents for the Socratic feedback loop:**
1. Register the hackathon team account at https://forms.office.com/e/VZgACZAhhY
2. Log into https://app.cogniti.ai/
3. Create one agent per learning format, e.g.:
   - "QuestLearn Socratic Tutor — Game Mode" (system prompt: Socratic for gamified topics)
   - "QuestLearn Story Explainer" (narrative-style responses)
   - "QuestLearn Meme Explainer" (casual, relatable language)
4. Set system message to enforce Socratic questioning, curriculum grounding, Years 8–10 level
5. Upload NSW/Australian Curriculum content as Resources
6. Embed via `<iframe>` or direct link in QuestLearn front-end

**Option B — Use Cogniti for teacher-facing features:**
- Build a "Teacher Heatmap Advisor" agent — teacher pastes class data, agent gives pedagogical insights
- Build a "Topic Suggester" agent — teacher asks what topics are trending for their cohort

**What Cogniti gives you for QuestLearn:**
- ✅ Socratic LLM feedback loop (system prompt enforces no-answer-giving behavior)
- ✅ Curriculum grounding (upload AC v9 content as resources)
- ✅ Teacher visibility over student conversations (maps to heatmap concept)
- ✅ Safe, moderated AI interaction for students (ages 13–15)
- ❌ Cannot be called programmatically from backend
- ❌ Cannot dynamically inject topic/format from QuestLearn's UI → need to build per-format agents

**Recommended integration pattern:**
```
Student selects format + topic in QuestLearn UI
→ QuestLearn opens appropriate Cogniti agent (iframe or redirect)
→ Cogniti agent has pre-baked system prompt for that format + Socratic rules
→ Student chats with agent
→ Teacher sees conversation log in Cogniti dashboard
```

### Limitations & Gotchas

- **1 account per team** — can create multiple agents under that account
- **Agent quota** — may need to contact Cogniti admin (hello@cogniti.ai) to increase quota
- **No direct API** — can't inject dynamic context from QuestLearn's database (topic, student level, format) into the prompt at request time — must bake it in at agent creation time
- **Resources are not fully read** — RAG-based, so agent only retrieves snippets relevant to student query; don't expect complete curriculum coverage from uploads
- **Knowledge documents are always injected** — entire doc every turn → context window limits apply (good for short docs like syllabus, bad for full curriculum PDF)
- **No conversation persistence across Cogniti ↔ QuestLearn** — you can't easily pull student conversation data into QuestLearn's teacher heatmap
- **Early-stage / active development** — occasional downtime expected
- **Team registration required** — must submit the Microsoft Forms link before getting advanced agent creation features

---

## CurricuLLM

### What it is

**CurricuLLM** is a curriculum-aware AI infrastructure platform built specifically for K-12 education in Australia and New Zealand. It has **two products**:

1. **Consumer app** (https://app.curricullm.com/) — free for teachers, no-code chat interface with curriculum alignment built-in. Features: Studio (generate flashcards/quizzes from uploads), Live Class View, student progress analytics, whole-school reporting.

2. **Developer API** (https://api.curricullm.com/v1) — **OpenAI-compatible API** that adds curriculum intelligence. This is the hackathon-relevant product.

**What makes it special:**
- **Curriculum tokens** — proprietary tokens the model uses to deeply understand Australian/NZ educational standards. These are automatically inserted when the model references curriculum knowledge.
- **Curriculum alignment by default** — responses naturally reference AC v9 outcomes, content descriptors, etc.
- **Personalised to student progress** — adapts based on what the student knows and needs to practice
- **K-12 safe** — content filtering tuned for school use (blocks inappropriate content while allowing historical/literary topics)

**Supported curricula:**
| Model name | Curriculum |
|---|---|
| CurricuLLM-AU | Australian Curriculum v9 |
| CurricuLLM-NZ | New Zealand Curriculum |
| CurricuLLM-AU-VIC | Victorian Curriculum |
| CurricuLLM-AU-WA | Western Australian Curriculum |

**Hackathon access:**
- Console (API keys + playground): https://console.curricullm.com/
- Developer portal: https://curricullm.com/developers
- Register for credits: https://forms.office.com/e/9ZWQ2pVy1t
- AUD $15 credits per team, 1 account per team

### API / Technical Docs

**This is the key integration path for QuestLearn.** CurricuLLM is a **drop-in OpenAI replacement**.

**Base URL:** `https://api.curricullm.com/v1`

**Authentication:** API key (obtained from https://console.curricullm.com/ after registration)

**Integration — Python:**
```python
from openai import OpenAI

client = OpenAI(
    api_key="your-curricullm-api-key",
    base_url="https://api.curricullm.com/v1"
)

response = client.chat.completions.create(
    model="CurricuLLM-AU",  # Australian Curriculum v9
    messages=[
        {"role": "system", "content": "You are a curriculum-aligned tutor for Year 9 students..."},
        {"role": "user", "content": "Explain photosynthesis in the style of a story"}
    ]
)
print(response.choices[0].message.content)
```

**Integration — JavaScript:**
```javascript
const openai = new OpenAI({
    apiKey: "your-curricullm-api-key",
    baseURL: "https://api.curricullm.com/v1"
});
```

**Available via:** Console playground (interactive testing, code snippets, usage analytics, API key management) at https://console.curricullm.com/

**Supported operations:** Chat completions (same as OpenAI `/v1/chat/completions`)

**Curriculum tokens:** Automatically used by the model — no special parameters needed. You pay for them when the model references curriculum content.

### GitHub / Open Source

⚠️ **Note:** There is a GitHub repo `labicon/CurricuLLM` but this is a **completely different project** — it's an academic robotics paper ("Automatic Task Curricula Design for Learning Complex Robot Skills using Large Language Models") from UC Berkeley. **Not related** to the EdTech CurricuLLM.

The EdTech CurricuLLM (curricullm.com) does **not have a public GitHub repo**. It is a closed commercial platform.

Code examples are available in the developer console at https://console.curricullm.com/.

### Integration with QuestLearn

CurricuLLM is the **primary recommended API** for QuestLearn. It should power:

1. **Content generation per format:**
```python
def generate_content(topic: str, format: str, year_level: int) -> str:
    """Generate curriculum-aligned content in the chosen learning format."""
    format_prompts = {
        "Game": "Create an interactive quiz game about {topic} for Year {year} students...",
        "Story": "Write an engaging narrative story that teaches {topic} for Year {year}...",
        "Meme": "Create 3 educational meme concepts explaining {topic} for Year {year}...",
        "Puzzle": "Design a logic puzzle or crossword about {topic} for Year {year}...",
        "Short Film": "Write a script/storyboard for a 2-min explainer video about {topic} for Year {year}..."
    }
    
    client = OpenAI(api_key=CURRICULLM_KEY, base_url="https://api.curricullm.com/v1")
    response = client.chat.completions.create(
        model="CurricuLLM-AU",
        messages=[
            {"role": "system", "content": f"You are a curriculum expert for Year {year_level} students aligned to Australian Curriculum v9."},
            {"role": "user", "content": format_prompts[format].format(topic=topic, year=year_level)}
        ]
    )
    return response.choices[0].message.content
```

2. **Socratic feedback loop** (combine with Cogniti OR implement directly):
```python
def socratic_response(student_message: str, topic: str, conversation_history: list) -> str:
    """Respond with Socratic questioning, never giving direct answers."""
    system = f"""You are a Socratic tutor for Year 9 students studying {topic}.
    Aligned to Australian Curriculum v9.
    RULES:
    - Never give the answer directly. Always respond with a guiding question.
    - Keep language appropriate for ages 13-15.
    - Reference relevant curriculum outcomes when helpful."""
    
    client = OpenAI(api_key=CURRICULLM_KEY, base_url="https://api.curricullm.com/v1")
    messages = [{"role": "system", "content": system}] + conversation_history + [{"role": "user", "content": student_message}]
    response = client.chat.completions.create(model="CurricuLLM-AU", messages=messages)
    return response.choices[0].message.content
```

3. **Teacher heatmap data enrichment** — call CurricuLLM to analyze which curriculum strands are being covered most in student sessions, generate insights about knowledge gaps.

### How the AUD $15 credits work

- **Pre-paid credits** assigned to your team account on the CurricuLLM console
- **Pricing (USD per million tokens):**
  - Input tokens: $2/M
  - Output tokens: $8/M
  - Curriculum tokens: $2/M (auto-added when model references curriculum knowledge)
- AUD $15 ≈ USD ~$9.50 at current rates
- Estimated capacity at average call sizes (~500 input + 500 output + 200 curriculum tokens):
  - ~$0.0079 per call → roughly **1,200+ calls** with AUD $15 budget
  - More than enough for a hackathon demo with real usage
- **No surprise bills** — pre-paid means it caps when credits run out
- Monitor usage at https://console.curricullm.com/ (usage analytics dashboard)
- **Get API key:** Register via https://forms.office.com/e/9ZWQ2pVy1t → login to console → generate key

### Limitations & Gotchas

- **Not fully documented publicly** — API docs are primarily in the interactive console, not a full OpenAPI spec
- **Limited to AU/NZ curricula** — won't work for UK/US curriculum alignment (not an issue for Oceania hackathon)
- **Credits are pre-paid** — once AUD $15 is exhausted, API calls fail; monitor usage actively during hackathon
- **Curriculum tokens add ~10-15% cost overhead** — factor into token budget
- **OpenAI-compatible but not identical** — not all OpenAI parameters may be supported (test in playground first)
- **Rate limits unknown** — not publicly documented; test under load before demo day
- **AUD $15 per team only** — cannot request more credits; be efficient with prompts
- **1 account per team** — share API key carefully, don't leak it
- **GitHub "CurricuLLM"** — be aware the robotics paper repo is a different thing; don't confuse

---

## Manifest

### What it is

**Manifest** (by Taqtile) is an **AI-powered Digital Work Instructions platform** designed for industrial and enterprise contexts — NOT a classroom/curriculum tool. It focuses on step-by-step guided procedures for workers, using AR (augmented reality), mobile, and tablet interfaces.

Key features:
- **AI-generated step-by-step instructions** from PDFs or videos
- **AR support** — works on AR headsets as well as iPads/phones
- **Remote expert collaboration** — live streaming of worker POV with guided assistance
- **Open APIs** for integration with existing IT systems
- **Offline mode** — procedures downloadable for disconnected environments
- **Analytics** — job performance history, audit trails, inspection reports
- **Customers:** USAF, Google, and industrial enterprises

This is an **enterprise work instruction platform** — it is NOT designed for K-12 education content delivery in the traditional sense.

### Challenge 3 relevance

The EduX Hackathon toolkit page indicates:
- **15 accounts total available** (very limited)
- **Priority for Challenge 3 participants** (check challenge tracks at https://cambridge-edtech-society.org/edux/edux-challenges.html)
- Register via same form: https://forms.office.com/e/9ZWQ2pVy1t
- Credentials delivered via WhatsApp after registration

**Challenge 3 hypothesis:** Challenge 3 likely involves **practical skills training, vocational education, or procedural learning** where Manifest's step-by-step guided instruction format is relevant. If QuestLearn doesn't target Challenge 3, **Manifest is low priority** — don't apply for limited slots unless the project scope requires it.

**Potential use in QuestLearn (speculative):**
- If one of the 5 learning formats (Game/Story/Meme/Puzzle/Short Film) were to include **interactive procedure walkthroughs** for STEM experiments (e.g. "Build a circuit — follow these steps"), Manifest could theoretically power that. But this is a significant scope stretch.
- **Recommendation: Skip Manifest unless targeting Challenge 3.** Focus credits and effort on CurricuLLM.

---

## Recommended Integration Strategy for QuestLearn

### Core recommendation: CurricuLLM as the AI backend, Cogniti for Socratic chat UI

```
QuestLearn Architecture:
┌────────────────────────────────────────┐
│         Student UI (Next.js / React)   │
│  [Topic input] [Format selector]       │
│  [Content display] [Chat interface]    │
└──────────┬────────────────────┬────────┘
           │                    │
           ▼                    ▼
┌──────────────────┐  ┌─────────────────────┐
│  CurricuLLM API  │  │   Cogniti (iframe)  │
│  (content gen)   │  │  (Socratic chat)    │
│  /v1/chat/...    │  │  app.cogniti.ai     │
└──────────────────┘  └─────────────────────┘
           │
           ▼
┌──────────────────┐
│ Teacher Dashboard│
│ (heatmap + data) │
│ Powered by       │
│ CurricuLLM audit │
└──────────────────┘
```

### Step-by-step integration plan:

**Phase 1 — Register (Day 1, Apr 2):**
1. Submit https://forms.office.com/e/VZgACZAhhY → get Cogniti access
2. Submit https://forms.office.com/e/9ZWQ2pVy1t → get CurricuLLM API credits
3. Get CurricuLLM API key from https://console.curricullm.com/
4. Test both in their respective playgrounds

**Phase 2 — CurricuLLM content generation (Days 1-3):**
- Build `generate_content(topic, format, year_level)` function using CurricuLLM API
- Model: `CurricuLLM-AU` for Australian Curriculum v9
- Base URL: `https://api.curricullm.com/v1`
- One call per student format request
- Store generated content in DB (don't re-generate same topic/format combos)

**Phase 3 — Socratic feedback (Days 2-4):**
- **Option A (simpler):** Implement Socratic chat directly with CurricuLLM API (same key, same endpoint) — write system prompt with Socratic rules + curriculum constraints → call CurricuLLM for each student message
- **Option B (richer):** Embed Cogniti agents as iframe for Socratic sessions — build 5 agents (one per format), set system prompt per format, embed in QuestLearn UI
- **Recommendation: Option A first** (faster to build, uses existing CurricuLLM integration, stays in your code stack). Use Option B if the embedded agent UX is superior.

**Phase 4 — Teacher heatmap (Days 3-5):**
- Log every topic + format + student interaction to DB
- Use CurricuLLM to generate curriculum strand analysis from session data
- Display as heatmap: topic coverage × student engagement

### Which tool does what:
| Feature | Tool | Notes |
|---|---|---|
| Content generation (all 5 formats) | **CurricuLLM API** | Core backend call |
| Curriculum alignment | **CurricuLLM API** | Built-in via curriculum tokens |
| Socratic feedback loop | **CurricuLLM API** (or Cogniti) | CurricuLLM simpler to integrate |
| Safe content for students | **CurricuLLM API** | K-12 content filtering built-in |
| Teacher visibility / logs | **QuestLearn DB** (+ Cogniti dashboard) | Log all calls server-side |
| Teacher heatmap AI insights | **CurricuLLM API** | Prompt with session summary data |
| Vocational/procedural (if needed) | **Manifest** | Only if targeting Challenge 3 |

### Token budget estimate for AUD $15:
- Content generation: ~800 tokens per call → $0.008 USD per call
- Socratic turn: ~300 tokens per call → $0.003 USD per call
- AUD $15 ≈ USD $9.50 → ~1,000+ content generation calls or ~3,000+ Socratic turns
- **Plenty for hackathon demo.** Cache generated content to stretch budget.

---

## Sources

| URL | Content |
|---|---|
| https://cambridge-edtech-society.org/edux/edux-toolkit.html | Hackathon toolkit — all three tools access details |
| https://cogniti.ai/ | Cogniti main page |
| https://cogniti.ai/docs/ | Cogniti docs index |
| https://cogniti.ai/docs/why-cogniti/ | Why Cogniti — benefits, philosophy |
| https://cogniti.ai/docs/how-does-cogniti-work/ | Technical overview — RAG, system messages |
| https://cogniti.ai/docs/how-do-i-create-an-agent/ | Agent creation guide |
| https://cogniti.ai/docs/how-do-i-configure-an-agent/ | Agent configuration — resources, knowledge |
| https://cogniti.ai/docs/how-do-i-design-a-good-system-message/ | System prompt design guide |
| https://cogniti.ai/docs/how-are-resources-used-by-agents/ | RAG resource docs |
| https://cogniti.ai/docs/what-is-the-difference-between-agent-resources-and-knowledge/ | Resources vs Knowledge |
| https://cogniti.ai/docs/how-do-i-set-my-organisations-api-keys/ | API key formats for orgs |
| https://cogniti.ai/docs/how-can-i-start-using-cogniti-at-my-institution/ | LTI/Canvas/Moodle integration |
| https://cogniti.ai/try-it-out/ | Try Cogniti (student perspective) |
| https://curricullm.com/ | CurricuLLM main page |
| https://curricullm.com/developers | CurricuLLM developer API docs |
| https://curricullm.com/training | CurricuLLM training hub |
| https://console.curricullm.com/ | CurricuLLM API playground |
| https://taqtile.com/manifest/ | Manifest by Taqtile |
| https://media-and-learning.eu/subject/artificial-intelligence/cogniti-ai-agents-designed-by-for-educators/ | External Cogniti review |
| https://www.sydney.edu.au/news-opinion/news/2025/06/03/cogniti-an-ai-stunt-double-for-teachers-wins-afr-ai-award.html | AFR award article on Cogniti |
| Tavily searches | Cogniti API, CurricuLLM API, Manifest EdTech, GitHub repos |
| Firecrawl crawl | cogniti.ai/docs/ — 15 pages scraped |
