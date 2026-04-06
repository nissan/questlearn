# QuestLearn EduX Presentation Strategy — Enhanced

**Last updated:** 2026-04-06 15:20 AEST  
**Status:** Ready for demo recording  
**Audience:** EduX Hackathon judges (academic + technical + EdTech)  

---

## **Narrative Arc (3-Layer Story)**

### **Layer 1: Content Generation**
**"Curricullm generates expert-backed lesson plans"**
- Australian Curriculum v9 mapped to learning objectives
- AI generates personalized content per topic
- Traditional LLMs wrap engagement format (story, game, meme, puzzle, short film)

### **Layer 2: Student Engagement**
**"Cogniti agents power interactive learning formats"**
- Meme Generator: Custom app showing Cogniti integration
- Flashcards, Debate, Concept Map: Multi-format Cogniti mini-apps
- Socratic dialogue: AI asks questions, student builds understanding (no points, no grades)

### **Layer 3: Teacher Intelligence**
**"Learning Management → Learning Intelligence"**
- Real-time engagement heatmap (topic × format × depth)
- Live activity feed (who's studying what, right now)
- AI-generated insights: Cogniti Flashcard analytics
  - Top topics by engagement
  - Average confidence per topic (red/yellow/green)
  - Answer accuracy (warns if <50%)

---

## **Presentation Flow (Slides 1–12)**

### **Slide 1: Title Slide**
- **QuestLearn — Socratic dialogue powered by AI**
- Subtags: 🎓 Learning Platform, 🤖 AI Tutor
- EduX Hackathon 2026

### **Slides 2–10: Problem → Solution → Tech Stack**
(Existing pitch content — keep as-is)

### **Slide 11: Demo Walkthrough** ← NEW / ENHANCED
**"Watch the three layers in action"**

Grid of 6 demo cards:
1. **🎓 Student Journey — Photosynthesis** (Meme + Socratic)
2. **📚 Student Journey — Newton's Laws** (Story + Socratic)
3. **✏️ Student Journey — French Verbs** (Flashcards + Cogniti)
4. **📊 Teacher Dashboard — Live Monitor** (Live activity + engagement heatmap)
5. **📈 Teacher Dashboard — Analytics** (Cogniti insights: confidence, accuracy)
6. **🧩 Mini Apps Walkthrough** (Debate, Concept Map, Flashcards)

Each card clickable → full-screen video

### **Slide 12: Close**
- **Thank you**
- Links: questlearn-nu.vercel.app, github.com/nissan/questlearn

---

## **Master Script (Consolidated)**

### **Opening (Judges Attention)**
"In remote New South Wales, Aboriginal students fall three years behind city peers by Year Nine — not because they're less capable, but because consistent, quality teaching is hard to reach.

QuestLearn solves this with three layers of AI.

**First:** Curricullm generates curriculum-aligned lesson plans mapped to Australian standards.

**Second:** Cogniti agents power five learning formats — Meme, Story, Game, Puzzle, Short Film. Students choose their format. The AI asks Socratic questions. No points. No grades. Just dialogue.

**Third:** Teachers see learning intelligence in real time. A heatmap shows which topics and formats drive engagement. Confidence metrics warn where students struggle. A student in Bourke gets the same AI tutor as a student in Bondi.

Let me show you how it works."

---

## **Video Recording Requirements**

### **Layer 1: Student Experience (3 videos)**

**Video 1: Photosynthesis (Meme + Socratic)**
- **Duration:** 60–90 seconds
- **Flow:**
  1. Topic entry: "photosynthesis"
  2. Format selection: "Meme" (click)
  3. Meme loads with AI-generated text overlay
  4. First Socratic question appears
  5. Student types an answer
  6. AI response: warm, encouraging, follows up with another question
  7. Chat shows 2–3 turns of dialogue
  8. Completion screen with confidence ratings
- **Narration:** "The AI generates a curriculum-aligned meme, then asks a Socratic question. Wrong answers don't lose points — the AI just asks another question to deepen understanding."
- **Key frames:** Meme rendering, Socratic chat, confidence dots, no red indicators anywhere

**Video 2: Newton's Laws (Story + Socratic)**
- **Duration:** 60–90 seconds
- **Flow:** Same as Video 1, but with "Story" format
- **Narration:** "Same approach with different formats. A story instead of a meme. The pedagogy is identical: dialogue, not delivery."

**Video 3: French Verbs (Flashcards + Attempt Tracking)**
- **Duration:** 60–90 seconds
- **Flow:**
  1. Topic: "French conjugation"
  2. Format: "Flashcards"
  3. Card 1: "Conjugate 'to be' in present tense"
  4. Student's first attempt: "je suis, tu sois..." (incorrect)
  5. AI feedback: "You got the first person right, but let me ask: what changes in the second person?"
  6. Second attempt: "tu es"
  7. AI: "Good! What's the pattern you're seeing?"
  8. Third attempt: Full conjugation correct
  9. AI: "Perfect! Here's the pattern..." (gives answer + explanation after 3rd attempt)
- **Narration:** "Flashcards with AI feedback. The AI guides with questions, but after three attempts, it gives the answer directly — no frustration, just clarity."
- **Key frames:** Card flip, attempted answers, confidence ratings, **no red markers**, progression through attempts

---

### **Layer 2: Teacher Experience (2 videos)**

**Video 4: Teacher Dashboard — Live Monitor**
- **Duration:** 60 seconds
- **Flow:**
  1. `/teacher` page loads
  2. Today's Quest section: Teacher pins "Photosynthesis (Meme)" for Year 9
  3. Live Activity feed appears: Real-time list of students + topics + formats
  4. Auto-refresh shows new activity (2–3 students join)
  5. Engagement heatmap loads below
  6. Pan across heatmap slowly — show multiple topics × formats, with color depth indicating engagement
  7. Hover on a hot cell to show engagement count
- **Narration:** "The teacher pins a topic and format for the class. In real time, they see which students are studying which topics, and how deep they're engaging. The heatmap shows the whole class pattern: which topic-format combinations are driving the most dialogue."
- **Key frames:** Today's Quest form, Live Activity list, Engagement heatmap with color legend, hover state

**Video 5: Teacher Dashboard — AI Insights**
- **Duration:** 60 seconds
- **Flow:**
  1. Scroll down past heatmap to "🃏 Cogniti Flashcard Engagement"
  2. Show three cards: Top Topics, Avg Confidence (with color dots), Answer Accuracy (with ⚠️ alerts)
  3. Hover on a topic with low confidence (red dot) to highlight
  4. Show a topic with <50% accuracy (⚠️ badge)
- **Narration:** "Below the heatmap, the teacher sees AI-generated insights. Top Topics by card flips. Confidence ratings per topic — red, yellow, or green. Answer accuracy — with warnings if students are struggling. All generated by Cogniti. The teacher knows exactly where to focus."
- **Key frames:** Three insight cards, color-coded confidence dots, accuracy percentages, ⚠️ badges

---

### **Layer 3: New Mini-Apps (1 video)**

**Video 6: Mini-Apps Walkthrough**
- **Duration:** 90–120 seconds
- **Flow:**
  1. **Flashcards:** Quick walkthrough (already covered in Video 3, but show the UI polish — confidence buttons: Again/Hard/Good/Easy)
  2. **Debate:** Topic selection → "Social media does more harm than good" → choose position (For/Against) → 3 rounds of argumentation → verdict screen
  3. **Concept Map:** Drag nodes, draw connections, AI feedback on each connection ("Good link!", "What's the connection between X and Y?"), full-map feedback with suggested missing connection
- **Narration:** "We've ported three Cogniti mini-apps to QuestLearn as evidence of Cogniti integration: Flashcards (with spaced repetition + confidence tracking), Debate (3-round structured dialogue with AI opponent), and Concept Maps (node-based knowledge graphing with AI-guided connections). All powered by Cogniti agents. All fully native to QuestLearn."
- **Key frames:** Flashcards confidence buttons, Debate position selection, Debate verdict screen (round 3), Concept Map with draggable nodes, AI feedback appearing in real-time

---

## **Recording Checklist**

### **Student Layer**
- [ ] Video 1: Meme + Socratic dialogue (photosynthesis)
  - [ ] Meme renders without fallback
  - [ ] AI Socratic questions are warm + encouraging
  - [ ] NO red indicators (no failed states, no scores)
  - [ ] Confidence rating buttons visible + usable
  - [ ] Completion screen shows progress

- [ ] Video 2: Story + Socratic dialogue (Newton's Laws or similar)
  - [ ] Story renders with curriculum tag
  - [ ] Socratic flow matches Video 1 pattern
  - [ ] NO red indicators

- [ ] Video 3: Flashcards + attempt tracking (French conjugation or similar)
  - [ ] Flashcard flip animation smooth
  - [ ] Attempt 1 + AI feedback (question)
  - [ ] Attempt 2 + AI feedback (question)
  - [ ] Attempt 3 + AI feedback (answer + explanation) — **KEY FEATURE**
  - [ ] Confidence buttons responsive (Again/Hard/Good/Easy)

### **Teacher Layer**
- [ ] Video 4: Live Monitor + Heatmap
  - [ ] Today's Quest form is visible + functional
  - [ ] Form submission: topic input + format selector
  - [ ] Live Activity feed shows real students (or test data)
  - [ ] Activity auto-refreshes (visual indicator: "↻ auto-refreshing")
  - [ ] Engagement Heatmap loads with color legend
  - [ ] Heatmap axis labels readable (Topic, Format, Depth)
  - [ ] Hot cells (high engagement) are visibly colored (emerald)
  - [ ] Hover state on a cell shows engagement count + tooltip

- [ ] Video 5: AI Insights
  - [ ] "🃏 Cogniti Flashcard Engagement" section loads
  - [ ] Three cards visible: Top Topics, Avg Confidence, Answer Accuracy
  - [ ] Confidence color dots: red (Not sure), yellow (Getting there), green (Got it!)
  - [ ] Accuracy percentages readable
  - [ ] ⚠️ badge visible on topics <50% accuracy
  - [ ] All text legible in final video

### **Mini-Apps Layer**
- [ ] Video 6: Mini-Apps Walkthrough
  - [ ] Flashcards: Confidence buttons work (click = state change)
  - [ ] Debate: Position selection (For/Against) with color coding
  - [ ] Debate: 3 rounds complete, verdict shows in round 3
  - [ ] Debate: Verdict format: "VERDICT: [who won] [improvement]" (2 sentences)
  - [ ] Concept Map: Nodes draggable, connections draweable
  - [ ] Concept Map: AI feedback appears on connection (Socratic or affirmation)
  - [ ] Concept Map: Full-map evaluation shows suggested connection

---

## **Narration (Master Read)**

**For Kokoro TTS:**
- Voice: Warm female, measured pace (115–120 WPM)
- Pauses: 0.5s between paragraphs
- Tone: Educational, hopeful, grounded (not hype-y)

**Script:**

---

In remote New South Wales, Aboriginal students fall three years behind their city peers by Year Nine. Not because they're less capable — because consistent, quality teaching is hard to reach.

QuestLearn solves this with three layers of AI.

**First: Content.** Curricullm generates curriculum-aligned lesson plans mapped to Australian standards. Every topic is rooted in pedagogy.

**Second: Engagement.** Cogniti agents power five learning formats: Meme, Story, Game, Puzzle, Short Film. The student chooses. The AI asks Socratic questions. No points. No grades. Just dialogue that builds understanding.

Here's what that looks like. A student picks a topic — photosynthesis. Chooses a format — meme. The AI generates a curriculum-aligned meme, then asks a question. The student answers. The AI responds warmly, asks another question. Wrong answers don't lose points. They deepen dialogue.

Five formats. Same Socratic engine. Game. Story. Meme. Puzzle. Short Film. The pedagogy is the same. The format is the student's choice.

**Third: Intelligence.** Teachers see learning in real time. A heatmap shows which topics and formats drive engagement. Confidence metrics warn where students struggle. An answer-accuracy dashboard flags topics that need reteaching. All generated by Cogniti.

The teacher pins a topic for the class, and watches live as students flow through the formats they choose. The teacher's dashboard is no longer a gradebook. It's learning intelligence.

A student in Bourke gets the same AI tutor as a student in Bondi. QuestLearn.

---

**Timing:** ~155 words, 90 seconds at 115 WPM

---

## **Slides Enhancement Notes**

### **Slide 11 Update:**
Current slide shows demo cards. **Enhance with:**
- Add a brief intro line above: "Three layers. Watch them in action."
- Card order matches video order:
  1. Photosynthesis (Meme)
  2. Newton's Laws (Story)
  3. French Verbs (Flashcards)
  4. Teacher Dashboard — Monitor
  5. Teacher Dashboard — Analytics
  6. Mini-Apps Walkthrough
- Each card has a **small play icon** (▶️) to signal they're clickable
- Clicking card opens modal with embedded video (full-screen, with back button)

### **Slide Layout (Existing Presentation)**
- Keep slides 1–10 as-is (existing pitch structure is solid)
- Replace slide 11 demo cards with enhanced version (video grid above)
- Keep slide 12 (close) as-is

---

## **Demo Video File Paths**

Create or symlink these in `/public/showcase/`:
```
/public/showcase/
  ├── S1-photosynthesis-meme.mp4
  ├── S2-newtons-laws-story.mp4
  ├── S3-french-flashcards.mp4
  ├── T1-teacher-monitor.mp4
  ├── T2-teacher-analytics.mp4
  └── M1-mini-apps-walkthrough.mp4
```

---

## **Recording Schedule**

**Tomorrow (2026-04-07):**
- 08:00–09:00: Record 3 student videos (S1, S2, S3)
- 09:00–10:00: Record 2 teacher videos (T1, T2)
- 10:00–11:00: Record mini-apps video (M1) + polish
- 11:00–12:00: TTS narration read, music sync, final edits
- 12:00: Presentation ready for rehearsal with Anusha

---

## **Key Decision: Script Consolidation**

**Old approach:** Three separate scripts (A/B/C) for different audiences.  
**New approach:** One unified script that works for EduX judges + general audience.

**Why:** The three-layer narrative (Content → Engagement → Intelligence) is strong enough to work across all audiences. We're not fragmenting.

**Script reads to:** Judges who care about pedagogy (Layer 1 = Curricullm), engagement design (Layer 2 = Cogniti agents), and teacher ROI (Layer 3 = learning intelligence).

---

## **Boundaries Locked**

✅ No new features — only bug fixes for demo blockers  
✅ No scope creep — presentation mode activated  
✅ Code is shipped (PR #41 + #42 merged)  
✅ Demo recordings happen tomorrow  
✅ Rehearsal with Anusha after recordings  

---

**Next step:** @redditech approves this plan, then Finn starts recording at 08:00 tomorrow. 🎬

