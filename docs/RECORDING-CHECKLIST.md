# Demo Recording Checklist — EduX Hackathon

**Date:** 2026-04-07  
**Duration:** ~3-4 hours total  
**Coordinator:** Finn (video pipeline)  
**Subject:** Anusha (testing + walkthrough)  
**Tech:** Screen recording (Peekaboo or ScreenFlow), Kokoro TTS, music sync  

---

## **Pre-Recording Setup (30 min)**

- [ ] Test environment is live: questlearn-nu.vercel.app
- [ ] Database has sample data: students, topics, formats, completed cards
- [ ] Teacher account can access `/teacher` dashboard
- [ ] All 5 student formats (Meme, Story, Game, Puzzle, Short Film) are available
- [ ] Cogniti API endpoints responding (check Network tab)
- [ ] Browser zoom set to 100% (not 90% or 110%)
- [ ] Screen resolution locked at 1920×1080 (or native full-screen)
- [ ] Dark mode enabled (slides use dark background)
- [ ] Sound check: Microphone ready (if recording voice) OR ready for TTS

---

## **Video 1: Photosynthesis (Meme + Socratic)**

**Setup:**
- [ ] Clear URL bar, start at `/learn` (landing page)
- [ ] Fresh session (no previous cards loaded)
- [ ] Topic input focused, cursor visible

**Recording (60–90 sec):**

1. **Topic Entry (5 sec)**
   - [ ] Type "photosynthesis" slowly (viewers should read it)
   - [ ] Wait 1 second after typing
   - [ ] Observe format selector appears (Meme, Story, Game, Puzzle, Short Film)

2. **Format Selection (5 sec)**
   - [ ] Click "Meme" format button
   - [ ] Button highlights/animates
   - [ ] UI transitions to loading state (spinner or skeleton)

3. **Content Load (10 sec)**
   - [ ] Meme card renders (🧪 Demo stub badge visible)
   - [ ] Curriculum alignment tag visible ("Australian Curriculum v9")
   - [ ] Meme image renders (not blank, not broken link)
   - [ ] Text overlay visible on meme (AI-generated caption)
   - [ ] Hold full card in frame for 4–5 seconds (let viewers read)

4. **First Socratic Question (5 sec)**
   - [ ] Question appears below meme (or in chat thread)
   - [ ] Text is readable, warm tone (no red indicators)
   - [ ] Question prompts thinking, doesn't ask for definition

5. **Student Answer (10 sec)**
   - [ ] Click input field (or text entry)
   - [ ] Type an answer (can be correct or incorrect)
   - [ ] Hit submit
   - [ ] AI response loads

6. **AI Response #1 (10 sec)**
   - [ ] Response is warm + encouraging
   - [ ] NO red failure indicators, NO score deduction, NO X marks
   - [ ] AI asks another Socratic question
   - [ ] Chat thread shows both student answer + AI response in context

7. **Second Socratic Loop (10 sec)**
   - [ ] Student types new answer
   - [ ] AI responds with another question (not giving answer yet)
   - [ ] Confidence rating buttons visible somewhere on screen (Again/Hard/Good/Easy)

8. **Completion Screen (15 sec)**
   - [ ] Scroll to show completion state
   - [ ] Confidence dots/buttons visible (colored indicators)
   - [ ] Progress tracker shows card completion
   - [ ] NO score or grade anywhere visible
   - [ ] Option to review or continue visible

**Key visual checks:**
- ✅ Meme image loads correctly (no placeholder, no 404)
- ✅ Text overlay is legible (good contrast, readable font size)
- ✅ Socratic dialogue is warm (exclamation marks, affirmations)
- ✅ NO red indicators anywhere (no failed states, no scoring)
- ✅ Confidence buttons work (click shows state change)

---

## **Video 2: Newton's Laws (Story + Socratic)**

**Setup:**
- [ ] Clear previous cards / start fresh session
- [ ] `/learn` page again

**Recording (60–90 sec):**

1. **Topic Entry (5 sec)**
   - [ ] Type "Newton's laws of motion"
   - [ ] Format selector appears

2. **Format Selection (5 sec)**
   - [ ] Click "Story" format button
   - [ ] Button highlights

3. **Content Load (10 sec)**
   - [ ] Story content card renders
   - [ ] Curriculum tag visible
   - [ ] Story text is readable (not too small)
   - [ ] Hold for 4–5 seconds

4. **Socratic Dialogue (30 sec)**
   - [ ] Follow same pattern as Video 1: Q → A → Q → A
   - [ ] Show 2–3 turns of dialogue
   - [ ] Story format should feel different from meme, but pedagogy identical

5. **Completion (10 sec)**
   - [ ] Confidence buttons visible + usable

**Key difference from Video 1:**
- Format is "Story" not "Meme" → different visual design, same dialogue engine
- **Narration should emphasize:** "Same Socratic approach, different format. Student chooses the format."

---

## **Video 3: French Verbs (Flashcards + Attempt Tracking)**

**Setup:**
- [ ] Clear session
- [ ] `/learn` page

**Recording (60–90 sec):**

1. **Topic Entry (5 sec)**
   - [ ] Type "French conjugation" or "French verb tenses"
   - [ ] Format selector appears

2. **Format Selection (5 sec)**
   - [ ] Click "Flashcards" format
   - [ ] Button highlights

3. **First Card (5 sec)**
   - [ ] Flashcard loads with question: "Conjugate 'to be' in present tense"
   - [ ] Card visible, readable

4. **Attempt 1 — Wrong Answer (10 sec)**
   - [ ] Click card to flip (or show input field)
   - [ ] Student attempts: "je suis, tu sois, il est..."
   - [ ] Submit
   - [ ] **KEY:** AI gives feedback question: "You got the first person right, but what happens in the second person?" (NOT the answer)
   - [ ] NO ❌ or 0/10 or -5 points
   - [ ] Confident rating buttons appear (Again/Hard/Good/Easy) but student hasn't chosen yet

5. **Attempt 2 — Partial (10 sec)**
   - [ ] Student tries again: "tu es"
   - [ ] AI feedback: "Good! What's the pattern you're seeing? Look at all three persons so far."
   - [ ] Still NO failure indicators

6. **Attempt 3 — Correct (10 sec)**
   - [ ] Student fills in complete conjugation
   - [ ] AI responds: **"Perfect! Here's the pattern: 'Je suis, Tu es, Il/elle est...'"** ← **GIVES ANSWER AFTER 3 ATTEMPTS**
   - [ ] Explanation provided
   - [ ] Confidence buttons shown, student clicks one (e.g., "Easy")

7. **Completion (5 sec)**
   - [ ] Move to next card or show completion
   - [ ] Progress tracker visible (Card 1/10 or similar)

**Key feature to showcase:**
- ✅ Attempt 1-2: Socratic guidance (questions)
- ✅ Attempt 3+: Direct answer + explanation
- ✅ NO red indicators at any stage
- ✅ Confidence tracking (not points/grades)

---

## **Video 4: Teacher Dashboard — Live Monitor**

**Setup:**
- [ ] Log in as teacher account
- [ ] Navigate to `/teacher`

**Recording (60 sec):**

1. **Page Load (5 sec)**
   - [ ] Dashboard loads
   - [ ] Title: "Class Dashboard"
   - [ ] "Year 9" badge visible

2. **Today's Quest Section (15 sec)**
   - [ ] "📌 Today's Quest" card visible
   - [ ] Click "Set Quest" button
   - [ ] Form appears: Your name, Topic, Format, Grade level, Message
   - [ ] Fill form: Teacher name = "Ms Johnson", Topic = "Photosynthesis", Format = "Meme", Grade = "Year 9"
   - [ ] Click "Pin Quest"
   - [ ] Form submits, quest displays below with badge showing who pinned it

3. **Live Activity Feed (20 sec)**
   - [ ] Scroll to "🟢 Live Activity" section
   - [ ] Shows list of students currently studying (or test data)
   - [ ] Each row shows: Student name, Topic, Format, Turn count, "X min ago"
   - [ ] "↻ auto-refreshing" indicator visible
   - [ ] Watch feed for 5-10 seconds (should see updates or simulate)

4. **Engagement Heatmap (20 sec)**
   - [ ] Scroll to "Engagement Heatmap" section
   - [ ] Full table visible: Topic rows × Format columns
   - [ ] Color legend at bottom: None (grey) → Low (light green) → High (dark green)
   - [ ] Show at least 3-4 topics with engagement color depth
   - [ ] Hover on a cell to show tooltip with engagement count (e.g., "2 students, 15 turns")
   - [ ] **Pause on the heatmap for 10+ seconds** — this is the key visual

**Key visual checks:**
- ✅ Today's Quest form looks professional + functional
- ✅ Live Activity shows real or realistic student names + topics
- ✅ Engagement Heatmap has visible color gradation (some cells hot, some cold)
- ✅ All text legible (topic names, format icons, numbers)
- ✅ Heatmap labels readable (don't zoom in too far, keep context)

---

## **Video 5: Teacher Dashboard — AI Insights**

**Setup:**
- [ ] Still on `/teacher` page, scrolled to bottom

**Recording (60 sec):**

1. **Scroll to AI Insights (5 sec)**
   - [ ] Scroll down past heatmap
   - [ ] Reveal "🃏 Cogniti Flashcard Engagement" section
   - [ ] Three cards below: "Top Topics", "Avg Confidence", "Answer Accuracy"

2. **Top Topics Card (10 sec)**
   - [ ] Shows table: Topic name, Card flips count
   - [ ] At least 3 topics with data
   - [ ] Numbers are readable

3. **Avg Confidence Card (20 sec)**
   - [ ] Shows list of topics with colored dots
   - [ ] 🔴 Red dots (Not sure / <1.5 rating)
   - [ ] 🟡 Yellow dots (Getting there / 1.5–2.5)
   - [ ] 🟢 Green dots (Got it! / >2.5)
   - [ ] At least one red + one green visible
   - [ ] Topic names + ratings readable

4. **Answer Accuracy Card (20 sec)**
   - [ ] Shows topics with percentage
   - [ ] Topics with <50% accuracy have ⚠️ badge
   - [ ] Example: "Photosynthesis 62%", "French Verbs ⚠️ 38%"
   - [ ] Hover on a low-accuracy topic to highlight

5. **Overall Section View (5 sec)**
   - [ ] Zoom out slightly to show all three cards at once
   - [ ] "This is learning intelligence: confidence, accuracy, engagement — all AI-generated"

**Key visual checks:**
- ✅ All three cards load data (not "No data" placeholders)
- ✅ Confidence color dots are clearly visible + distinct
- ✅ Accuracy percentages are readable
- ✅ ⚠️ badges appear on low-accuracy topics
- ✅ No scrolling needed (all 3 cards fit in one screen view if possible)

---

## **Video 6: Mini-Apps Walkthrough**

**Setup:**
- [ ] Fresh student session
- [ ] Start at `/learn` page

**Recording (90–120 sec):**

### **Part A: Flashcards (30 sec)**
- [ ] Topic: "French Conjugation" (or re-use Video 3 data)
- [ ] Format: "Flashcards"
- [ ] Show card flip, one attempt cycle, confidence button click
- [ ] Narration: "Flashcards with AI feedback and confidence tracking. The AI guides with questions, but gives the answer after a few attempts — no frustration, just clarity."

### **Part B: Debate (40 sec)**
- [ ] Format: "Debate" (new app)
- [ ] Topic: "Social media does more harm than good"
- [ ] Click "FOR" or "AGAINST" button
- [ ] Show position selected (colored badge)
- [ ] First round: Student types an argument (30–50 words)
- [ ] Submit
- [ ] AI counter-argument loads (green or red tint for position)
- [ ] "Can you strengthen that?" prompt appears
- [ ] **Jump to Round 3:** Show the VERDICT screen
  - [ ] Counter-argument from AI
  - [ ] "VERDICT:" header
  - [ ] Two sentences: (1) who argued more effectively, (2) one improvement suggestion
  - [ ] Full verdict visible, legible

**Key frames:**
- ✅ Position selection shows user position + AI position clearly (color-coded)
- ✅ Debate chat shows alternating turns (user vs AI)
- ✅ VERDICT format correct: "VERDICT: [assessment] [improvement]"
- ✅ All text legible (no tiny fonts)

### **Part C: Concept Map (30 sec)**
- [ ] Format: "Concept Map" (new app)
- [ ] Topic: Any topic (e.g., "Photosynthesis")
- [ ] Show:
  - [ ] Canvas with draggable nodes (e.g., "Sunlight", "Glucose", "Chloroplasts")
  - [ ] Draw a connection between two nodes
  - [ ] Relationship label appears (e.g., "provides energy for")
  - [ ] AI feedback appears: "Good link!" or Socratic question
  - [ ] Scroll to show "Evaluate Map" button (full-map evaluation)
  - [ ] Click button
  - [ ] Full-map feedback appears: "Your connections are solid. You might add one more connection between [X] and [Y] because..."
  - [ ] Suggested connection visible + clickable

**Key frames:**
- ✅ Nodes are draggable (show drag + drop animation)
- ✅ Connections are drawable (show line being drawn)
- ✅ AI feedback appears in real-time (no lag)
- ✅ Both connection-level + map-level feedback visible
- ✅ All UI elements (buttons, labels, feedback) legible

---

## **Post-Recording (Narration + Music)**

**Once all 6 videos recorded:**

1. **TTS Narration** (Master script above)
   - [ ] Feed master script to Kokoro
   - [ ] Voice: Warm female, 115 WPM, measured pace
   - [ ] Output: Single MP3 track, well-normalized audio level
   - [ ] Duration: ~90 seconds

2. **Music Sync**
   - [ ] Choose royalty-free track (piano or ambient)
   - [ ] Audio level: -18dB under narration (doesn't compete)
   - [ ] Start: ~2 seconds before narration begins
   - [ ] End: ~3 seconds after narration finishes (hold for logo)

3. **Video Editing** (Finn)
   - [ ] Cut/arrange 6 videos in sequence:
     - Video 1: 0–90s (Meme + Socratic)
     - Video 2: 90–180s (Story + Socratic)
     - Video 3: 180–270s (Flashcards + attempts)
     - Video 4: 270–330s (Teacher monitor)
     - Video 5: 330–390s (Teacher insights)
     - Video 6: 390–510s (Mini-apps walkthrough)
   - [ ] Sync narration to video cuts (beat points: "First layer" → Layer 1 videos, etc.)
   - [ ] Add transitions: Dissolves between sections, hard cuts within sections
   - [ ] Color grade: Match Presentation slide aesthetic (dark backgrounds)
   - [ ] Add text overlays if needed (section headers: "Layer 1: Content", "Layer 2: Engagement", "Layer 3: Intelligence")
   - [ ] Final output: MP4, 1920×1080, H.264, -3dB normalized audio

4. **Quality Check**
   - [ ] Watch full video (8–9 min runtime)
   - [ ] Narration sync is tight (speech matches on-screen actions)
   - [ ] No jarring transitions or audio glitches
   - [ ] All text readable (no small fonts in final output)
   - [ ] Music doesn't overpower narration
   - [ ] Logo holds for 3+ seconds at end

---

## **Presentation Integration**

Once final video complete:

- [ ] Upload to `/public/showcase/QuestLearn-EduX-Final-Demo.mp4`
- [ ] Test playback on Presentation slide 11
- [ ] Verify full-screen modal works (click demo card → video plays)
- [ ] Back button returns to slide
- [ ] Video plays on loop if needed

---

## **Rehearsal with Anusha**

After videos + narration complete:

- [ ] Watch full demo video (8–9 min)
- [ ] Anusha reviews narration + flow
- [ ] Anusha practices pitch (if needed)
- [ ] Note any gaps or corrections
- [ ] Test presentation deck (all slides, all interactions)

---

## **Boundary: No Re-records**

✅ First take is good enough (perfectionism kills momentum)  
✅ Only re-record if there's a technical glitch (404 link, broken image, app crash)  
✅ Minor UI polish (colors, fonts) can wait for post-launch  
✅ Focus: **Clear demos of the 3-layer story**  

---

**Timeline:**
- 08:00–09:30: Videos 1–2
- 09:30–10:30: Videos 3–4
- 10:30–11:30: Videos 5–6
- 11:30–12:00: TTS narration + music sync
- 12:00–13:00: Editing + QC
- 13:00: Ready for rehearsal with Anusha

**Go live:** 📺 Tomorrow at 08:00. Let's capture this. 🎬

