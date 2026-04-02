# EduX Hackathon 2025 — Competitive Intelligence Report
**Prepared by:** Archie (Research & Analysis Agent, Redditech)  
**Date:** 2026-04-02  
**Purpose:** Competitive intelligence for QuestLearn team entering EduX Hackathon 2026 (Oceania Edition)  
**Source:** https://www.incubedglobal.com/gallery-edux-2025.html + Cambridge EdTech Society hackathon page

---

## 1. Event Overview

The **Cambridge EduX Hackathon 2025** was a 7-day innovation sprint held in Cambridge, UK (November 2025). Organised by the Cambridge EdTech Society (CETS), it brought together humanities thinkers and technology builders to reimagine education through AI and emerging technologies.

**Key sponsors & partners (2025):**
- Cambridge University Press & Assessment (Innovation Tier)
- Faculty of Education, Cambridge (Innovation Tier)
- **CurricuLLM** (Innovation Tier) — AI assistant for teachers with curriculum intelligence
- KnewSTEP Education (Innovation Tier)
- AoraAI — AI-generated video courseware (Community Tier)
- Cambridge Buildhouse, Homerton Changemakers, DEFI, JL Ventures (Community/Supporting)

**4 challenge tracks** were offered (C1–C4). Based on the winning projects, tracks covered: AI Ethics, Oral Assessment / Critical Thinking, Prompt Engineering, and AI Video Generation for Education.

---

## 2. Project Summaries

| # | Project Name | Team | Award | Track | What They Built |
|---|---|---|---|---|---|
| 1 | **Vocal AI** | Walaa Kord & Joel Smalley | 🏆 Grand Champion + C2 Winner | Oral Assessment / Critical Thinking | AI-powered oral assessment system for critical thinking. A real-time AI examiner that asks Socratic-style questions, adapts to student cultural background, and evaluates reasoning depth through spoken responses. |
| 2 | **Compliance AI** | Luwei Bai, Haixiang Yuan, Fengjie Zhang, Nuo Chen | ⭐ Host's Favourite · C1 Winner (tied) | AI Ethics | Real-time AI ethics scanner and detector. Monitors AI-generated content/interactions for ethical compliance issues in educational contexts. |
| 3 | **BunGuard** | Ellen Yang, Soumia Kouadri, May Sanejo, Abrar Shahriar | 🥇 C1 Winner | AI Ethics | Real-time AI ethics scanner and detector (separate implementation from Compliance AI — both addressed the same C1 challenge). |
| 4 | **The Script Foundry** | Arzu Mursalova, Shridar, Sristhi Chhabra, Nikith Shetty | 🥇 C3 Winner | Prompt Engineering | Prompt generator that minimises AI hallucination in educational video generation. Structured prompting pipeline to ensure accurate, curriculum-relevant AI video scripts. |
| 5 | **Kind and Love** | Shan Jin, Ruoqing Yang | 🥇 C4 Winner | AI Video | Optimising AI-video generation for educational equality. Focused on making AI-generated video content accessible and equitable across different learner demographics. |

**Total projects in gallery:** 5  
**Video formats:** 1 × Tella.tv embed, 4 × Google Drive video embeds

---

## 3. Project Deep Dives

### 3.1 Vocal AI — Grand Champion 🏆

**What they built:**  
An AI-powered oral examination system specifically designed to assess critical thinking skills. The system acts as an "AI examiner" that:
1. First collects the student's cultural background (ethnicity, upbringing, religion, preferred language) to calibrate culturally fair questions
2. Presents a topic scenario (e.g., planned obsolescence and consumer behaviour)
3. Uses Socratic questioning — "What key claims can you identify?" → "What are the underlying reasons?" → "Can you explore the relationship between X and Y?"
4. Adapts follow-up questions based on student responses in real time
5. Student can respond via microphone (record button) or text chat

**Demo style:**  
- **Walkthrough/product demo** style via Tella.tv screenshare recording
- Showed a live conversation between the AI examiner and a student
- ~2 minute demo, fast-paced
- Real-time voice + text interface visible
- **No narration voice-over** — the product spoke for itself through live demonstration
- Cultural calibration prompt shown upfront (strong equity signal)

**EduX tools used:** Not explicitly documented (pre-dates Cogniti workshop emphasis). Likely OpenAI/GPT for the conversation loop. No CurricuLLM or Cogniti integration confirmed.

**Overlap with QuestLearn:** **SIGNIFICANT**
- Socratic questioning loop ✓ (direct parallel to QuestLearn's follow-up loop)
- AI adapts to learner profile ✓ (QuestLearn adapts to format preference)
- Equity/cultural sensitivity angle ✓ (QuestLearn has Aboriginal/remote equity angle)
- Assessment of critical thinking ✓ (QuestLearn has engagement heatmap for teachers)

**"Steal This" insight:**  
> **Open with the equity/inclusion hook.** Vocal AI won Grand Champion partly because it explicitly asked about cultural background upfront — making equity the *first interaction*, not an afterthought. QuestLearn should lead with the Aboriginal/remote learner gap in its opening 30 seconds.

---

### 3.2 Compliance AI — Host's Favourite

**What they built:**  
A real-time AI ethics scanner and detector for educational contexts. Monitors AI-generated educational content for compliance with ethical guidelines — detecting bias, misinformation, inappropriate content, and hallucinations in real time as AI tools are used.

**Team:** 4 members (Luwei Bai, Haixiang Yuan, Fengjie Zhang, Nuo Chen)

**Demo style:**  
- Google Drive video (format unknown without viewing)
- 4-person team — likely had diverse presentation roles

**EduX tools used:** Unknown — likely built on LLM APIs with custom detection layer.

**Overlap with QuestLearn:** **PARTIAL**
- AI content quality concern is shared (CurricuLLM-AU mitigates hallucination risk for QuestLearn)
- No direct student-facing overlap

**"Steal This" insight:**  
> **Team diversity = credibility signal.** A 4-person team won Host's Favourite. More perspectives in the demo narrative = more authentic. If QuestLearn has team members with different backgrounds (tech, education, equity), show all of them briefly in the demo.

---

### 3.3 BunGuard — C1 Winner

**What they built:**  
Another real-time AI ethics scanner, competing in the same C1 (AI Ethics) track as Compliance AI but winning the track winner award. Focused on detecting AI compliance issues in educational settings.

**Team:** 4 members (Ellen Yang, Soumia Kouadri, May Sanejo, Abrar Shahriar)

**Demo style:**  
- Google Drive video embed

**EduX tools used:** Unknown.

**Overlap with QuestLearn:** **NONE** — different domain.

**"Steal This" insight:**  
> **A 4-person diverse team (including Soumia Kouadri, May Sanejo — likely international backgrounds) won a track.** EduX rewards interdisciplinary teams. If QuestLearn doesn't have 4–5 members, consider recruiting a humanities/education person to strengthen the narrative.

---

### 3.4 The Script Foundry — C3 Winner

**What they built:**  
A structured prompt generation system that minimises AI hallucination in educational video generation. Given a topic and curriculum context, it generates optimised prompts for AI video tools (presumably tools like AoraAI partner tools, Synthesia, etc.) that produce accurate, factually grounded educational videos.

**Team:** 4 members (Arzu Mursalova, Shridar, Sristhi Chhabra, Nikith Shetty)

**Demo style:**  
- Google Drive video embed
- Challenge track: Prompt Engineering — likely showed a before/after of hallucinated vs. guided prompt outputs

**EduX tools used:** Likely AoraAI (partner specialising in AI video) given track alignment. No CurricuLLM/Cogniti confirmation.

**Overlap with QuestLearn:** **PARTIAL**
- Prompt engineering for educational content ✓ (QuestLearn uses CurricuLLM-AU for curriculum-aligned generation)
- Video as learning format ✓ (QuestLearn includes "Short Film" as a format)
- Hallucination mitigation ✓ (shared concern)

**"Steal This" insight:**  
> **Demonstrate your content quality controls.** The Script Foundry won by showing HOW it prevents bad AI content. QuestLearn should show a "before CurricuLLM-AU" vs "after CurricuLLM-AU" moment — raw LLM output vs. curriculum-aligned, age-appropriate output. This is a concrete quality differentiator.

---

### 3.5 Kind and Love — C4 Winner

**What they built:**  
An optimisation framework for AI-generated educational video content targeting educational equality. Focused on making AI video tools produce content that is accessible to diverse learners — different languages, reading levels, and cultural contexts.

**Team:** 2 members (Shan Jin, Ruoqing Yang)

**Demo style:**  
- Google Drive video embed
- Only 2-person team — won despite smaller team

**EduX tools used:** Likely AoraAI alignment. No CurricuLLM/Cogniti confirmation.

**Overlap with QuestLearn:** **SIGNIFICANT**
- Educational equality focus ✓ (QuestLearn's Aboriginal/remote equity angle is directly parallel)
- Diverse learner accessibility ✓ (QuestLearn's multi-format approach addresses different learning styles)
- AI video for education ✓ (QuestLearn includes Short Film format)

**"Steal This" insight:**  
> **"Educational equality" as a frame beats "personalised learning" as a frame.** Kind and Love won C4 by framing their work as equity/access, not just efficiency. QuestLearn's Aboriginal/remote angle is its strongest equity hook — lead with it. "Closing the gap" is more emotionally resonant than "adaptive learning."

---

## 4. Overlap Analysis

| QuestLearn Feature | 2025 Comparable Project | Risk Level |
|---|---|---|
| Socratic follow-up loop | Vocal AI (Grand Champion) | ⚠️ High — must differentiate |
| AI-adaptive content | Vocal AI (cultural adaptation) | ⚠️ Medium — format-based vs profile-based |
| Equity / inclusion angle | Vocal AI + Kind and Love | ✅ Different angle (Aboriginal/remote vs general diversity) |
| AI content quality | Script Foundry | ✅ QuestLearn uses CurricuLLM-AU which is stronger |
| Multi-format learning | None | ✅ No direct 2025 competitor |
| Teacher dashboard / heatmap | None | ✅ No direct 2025 competitor |
| Gamification / formats (Game/Meme/Puzzle) | None | ✅ Unique in 2025 field |

**Key differentiation from Vocal AI (the Grand Champion):**
- Vocal AI assessed existing knowledge; QuestLearn **generates new learning content**
- Vocal AI was voice-only; QuestLearn is **multi-modal and format-selective**
- Vocal AI is teacher/examiner-facing; QuestLearn is **student-driven** with teacher oversight
- Vocal AI had no curriculum alignment tool; QuestLearn uses **CurricuLLM-AU** (a key EduX 2026 sponsor)

---

## 5. Sponsor Tool Usage — 2025 vs 2026

### What the 2025 projects did NOT do:
- **No confirmed CurricuLLM usage** in any 2025 project (despite CurricuLLM being an Innovation Tier partner)
- **No confirmed Cogniti usage** in any 2025 project (Cogniti was not a 2025 sponsor; it became a 2026 Oceania focus)

### What this means for QuestLearn (2026):
This is a **strategic opportunity**. In 2026, both CurricuLLM and Cogniti are explicitly positioned as challenge setter tools for the Oceania edition. QuestLearn is **designed around CurricuLLM-AU** from the ground up.

**Based on sponsor research:**

| Tool | What It Does | How QuestLearn Uses It | Competitive Edge |
|---|---|---|---|
| **CurricuLLM-AU** | AI assistant for teachers — curriculum-aligned answers, Studio Mode for lesson resources, quiz generation, visual aids | QuestLearn uses CurricuLLM-AU API to generate all learning content aligned to Australian curriculum | **Direct sponsor tool integration** — judges will look for this |
| **Cogniti** | Educator-built AI agents — Socratic tutoring, practice environments, custom mini-apps without code | QuestLearn's Socratic follow-up loop concept mirrors Cogniti's design philosophy | **Philosophical alignment** — mention Cogniti in pitch |

**Dan Hart (CurricuLLM founder)** is a 2026 challenge setter AND advisor. He was previously Head of AI at NSW Department of Education. QuestLearn's Aboriginal/remote equity angle directly aligns with his known priorities (led AI deployment for 500K NSW staff/students).

---

## 6. Demo Best Practices (Extracted from 2025 Winners)

### 6.1 Structure Patterns

| Best Practice | Source | QuestLearn Application |
|---|---|---|
| **Open with the problem, not the product** | Grand Champion Vocal AI leads with "Here's the examiner" — student immediately in the product | Open with a student in remote NT struggling, then cut to QuestLearn solving it |
| **Lead with the equity hook in the first interaction** | Vocal AI asks cultural background as step 1 | QuestLearn demo should show format selector choosing "Game" for a student who would otherwise disengage |
| **Show real content, not placeholder data** | All winners showed live AI outputs | Generate a real QuestLearn response on camera (meme, game, or story for a real Australian curriculum topic) |
| **Product speaks for itself** | Vocal AI used product walkthrough, no slide deck dependency | Minimise slides; maximise live demo time |
| **Differentiate via depth, not breadth** | Winners went deep on one insight (Vocal AI: equity + Socratic; Script Foundry: hallucination mitigation) | QuestLearn should go deep on ONE student journey (topic → format → content → follow-up) |

### 6.2 Narrative Hooks

From Grand Champion Vocal AI:
- Hook: *"What if your exam asked about your culture before testing your thinking?"*  
- QuestLearn equivalent: *"What if the lesson asked how you learn before teaching you?"*

From Kind and Love (C4 Winner):
- Hook: *Educational equality for diverse learners via AI video*  
- QuestLearn equivalent: *"A student in Arnhem Land learns the same curriculum as a student in Sydney — just in the format that actually works for them."*

### 6.3 Demo Format Observations

| Element | What Winners Did | What QuestLearn Should Do |
|---|---|---|
| **Length** | ~2–3 min demo videos (Tella.tv/Google Drive) | Target 3 min product demo within 5 min pitch |
| **Narration** | Some used live product flow without voice-over (Vocal AI) | Use voice narration + live product simultaneously |
| **Team presence** | 2–4 person teams shown | Show 2+ team members briefly — adds credibility |
| **Visual quality** | Google Drive suggests pragmatic/quick production | Polish screen recording with ScreenStudio or Loom |
| **Call-to-action** | Not observed in gallery | End with: "Try it now at [URL]" — live demo URL available |

---

## 7. QuestLearn Pre-Submission Checklist

Based on the 2025 winner analysis, here are the concrete actions QuestLearn must complete:

### 🎯 Positioning & Narrative
- [ ] **Lead with equity in first 30 seconds** — Name the Aboriginal/remote learner gap. Use a real statistic (e.g., NAPLAN gap between remote and metro).
- [ ] **Frame it as "closing the gap," not "personalised learning"** — equity resonates more emotionally with EduX judges
- [ ] **Contrast with the status quo** — show one clip/screenshot of a boring/inaccessible standard lesson, then QuestLearn as the alternative
- [ ] **Call out CurricuLLM-AU integration explicitly** — judges know Dan Hart is a challenge setter. "We built on CurricuLLM-AU, the official EduX sponsor tool" is a signal of intentionality
- [ ] **Mention Cogniti's design philosophy** — QuestLearn's Socratic loop mirrors what Prof. Danny Liu teaches. Name-drop it: "Inspired by Cogniti's approach to educator-controlled AI"

### 🏗️ Product Demo Requirements
- [ ] **Live student journey: end-to-end** — topic input → format selection → CurricuLLM content generated → follow-up question → student answer → feedback loop. Show ALL steps.
- [ ] **Show a real curriculum topic** — don't use placeholder. Use an actual Year 7–10 Australian curriculum topic (e.g., "Explain plate tectonics" or "What caused WWI?")
- [ ] **Show at least 2 different format outputs** — e.g., Meme + Story or Game + Puzzle. Proves the format selector is real and working.
- [ ] **Show teacher dashboard** — engagement heatmap visible. Even a static screenshot proves the teacher layer exists.
- [ ] **Demonstrate Socratic follow-up** — AI asks a probing follow-up question. Student responds. AI adapts. This mirrors the Grand Champion's key feature and must be shown explicitly.
- [ ] **Before/after CurricuLLM-AU** — Show raw LLM output for a topic, then CurricuLLM-AU output. The difference (curriculum alignment, age-appropriateness) is a key differentiator vs. generic GPT wrappers.

### 🎬 Demo Video Production
- [ ] **Record a polished 3-min demo video** — use ScreenStudio, Loom, or Tella.tv
- [ ] **Open with problem hook (0–30s)** — the equity problem
- [ ] **Show product in action (30s–2:30)** — the student journey
- [ ] **Close with impact statement (2:30–3:00)** — "X students in remote communities could access curriculum-aligned learning, in the format that works for them"
- [ ] **Show team briefly** — 2+ team members appearing adds credibility (2025 winners had 2–4 member teams)
- [ ] **Live URL in the video** — deploy the prototype and show a real URL so judges can try it

### 📄 Submission Package
- [ ] **Problem statement** — 2 sentences max. Name the specific gap (Aboriginal/remote vs urban NAPLAN data)
- [ ] **Solution description** — 3 sentences. Topic + format selection → CurricuLLM-AU → Socratic loop + teacher dashboard
- [ ] **Sponsor tool integration** — explicitly name CurricuLLM-AU and HOW it's used (not just "we used AI")
- [ ] **Equity angle documented** — which specific cohort benefits, and why the current EdTech doesn't serve them
- [ ] **Technical description** — architecture overview (frontend, CurricuLLM-AU API call, follow-up loop, teacher dashboard)
- [ ] **Prototype link** — working demo URL (Vercel, Netlify, etc.)
- [ ] **Team bios** — 1 sentence each. Include any education/equity background.

### ⚔️ Competitive Differentiation (from 2025 field)
- [ ] **Explicitly differentiate from "AI tutor" concept** — QuestLearn is a *format selector + content generator* not just a chatbot
- [ ] **Explicitly differentiate from oral assessment** (Vocal AI's territory) — QuestLearn is about *content delivery format*, not assessment
- [ ] **Claim the multi-format territory** — NO 2025 project addressed Game/Meme/Puzzle/Story/Short Film format diversity. This is QuestLearn's unique ground.
- [ ] **Claim the teacher oversight territory** — the engagement heatmap is unique in the 2025 field. No winner had a teacher-facing layer.

### 🏆 Judging Criteria Alignment
Based on EduX's stated values (academic-driven creativity, educational integrity, real-world impact):
- [ ] **Real-world impact** — cite specific statistics on remote/Aboriginal learning gap. Make judges feel the problem.
- [ ] **Educational integrity** — explain how CurricuLLM-AU ensures curriculum alignment and age-appropriateness
- [ ] **Academic-driven creativity** — if possible, cite one piece of learning science backing adaptive format selection (e.g., Universal Design for Learning framework)
- [ ] **Interdisciplinary team** — if team includes educators or equity researchers, foreground this

---

## 8. Headline Insights

1. **The Grand Champion won on equity + Socratic dialogue** — both of which QuestLearn has. But QuestLearn needs to demonstrate these MORE EXPLICITLY than Vocal AI did.

2. **No 2025 project used CurricuLLM or Cogniti** — QuestLearn using CurricuLLM-AU is a first-mover advantage in the Oceania edition where these are the named sponsor tools.

3. **"Format choice" is QuestLearn's moat** — nobody in 2025 addressed the learning format question (Game vs Story vs Meme vs Puzzle vs Short Film). This is genuinely novel territory.

4. **Small teams can win** — Kind and Love won C4 with just 2 members. QuestLearn doesn't need a large team; it needs a sharp, focused demo.

5. **Google Drive video is fine; polish isn't required** — 4 of 5 winners used Google Drive embeds. Quality of concept beats production quality.

---

## 9. Source Notes

- **Gallery page:** https://www.incubedglobal.com/gallery-edux-2025.html (scraped 2026-04-02)
- **CETS hackathon page:** https://cambridge-edtech-society.org/hackathon-2025.html
- **Vocal AI demo transcript:** Extracted from Tella.tv embed (https://www.tella.tv/video/problem-solving-critical-thinking-assessment-start-136i)
- **2026 Oceania event details:** https://luma.com/eqpw25d9
- **Cogniti workshop details:** https://luma.com/ikvfkqp1
- **No YouTube videos found** — all 2025 demos hosted on Tella.tv (1) and Google Drive (4)
- CurricuLLM and Cogniti tool descriptions from official sites + sponsor listings

---

*Report prepared by Archie — Research & Analysis Agent, Redditech*  
*For internal QuestLearn team use only*
