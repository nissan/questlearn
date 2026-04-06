# Tomorrow's Mission: Demo Recording & Rehearsal

**Date:** 2026-04-07 (Today: 2026-04-06)  
**Goal:** Capture 6 videos (student + teacher) + TTS narration + music, then rehearse with Anusha  
**Status:** Code shipped ✅ | Strategy locked ✅ | Recording plan ready ✅  

---

## **What Changed Since Last Night**

We consolidated the three separate scripts (A/B/C) into **one unified narrative** that works for EduX judges:

**Old:** "Problem → Product → Walkthrough" OR "Architecture → Testing → Equity" OR "Cinematic story" (three variants for three audiences)

**New:** "Three AI layers" story that hits all three audiences at once:
1. **Content Layer** (Curricullm) → appeals to academic judges
2. **Engagement Layer** (Cogniti agents) → appeals to UX/product judges  
3. **Intelligence Layer** (Teacher dashboard) → appeals to ROI/impact judges

**Why it works:** The same 90-second video works for all judges. No fragmented messaging.

---

## **What We're Recording (6 Videos)**

### **Student Experience (3 videos)**
1. **Photosynthesis (Meme + Socratic)** — Shows engagement + dialogue
2. **Newton's Laws (Story + Socratic)** — Shows format choice + same pedagogy
3. **French Verbs (Flashcards + Attempts)** — Shows attempt tracking + answer after 3 tries

### **Teacher Experience (2 videos)**
4. **Live Monitor** — Shows today's quest + live activity + engagement heatmap
5. **AI Insights** — Shows Cogniti Flashcard analytics (confidence + accuracy)

### **New Mini-Apps Evidence (1 video)**
6. **Mini-Apps Walkthrough** — Shows Flashcards + Debate (NEW) + Concept Map (NEW) as proof of Cogniti integration

---

## **How Videos Sequence in Final Demo**

**Master narration (~90 seconds):**
- 0–25s: Problem intro + thesis ("QuestLearn uses AI at 3 layers")
- 25–45s: Layer 1 (Curricullm content) + Layer 2 (Cogniti engagement) — VIDEO 1 & 2
- 45–60s: Layer 3 student pedagogical details — VIDEO 3
- 60–75s: Layer 3 teacher intelligence — VIDEOS 4 & 5
- 75–90s: Proof of concept (mini-apps are Cogniti-powered) + close — VIDEO 6

**Total runtime:** 8–9 minutes with music + transitions

---

## **Tomorrow's Schedule**

| Time | Task | Owner | Output |
|------|------|-------|--------|
| 08:00–09:30 | Record Videos 1–2 (Student: Meme + Story) | Finn | 2 × 90s clips |
| 09:30–10:30 | Record Videos 3–4 (Flashcards + Teacher Monitor) | Finn | 2 × 60s clips |
| 10:30–11:30 | Record Videos 5–6 (Analytics + Mini-Apps) | Finn | 2 × 60s clips |
| 11:30–12:00 | TTS narration + music sync + rough cut | Finn | 1 × full demo video |
| 12:00–13:00 | Edit + QC + final color grade | Finn | 1 × final demo video |
| 13:00–14:00 | Rehearsal with Anusha (pitch + timing) | Nissan + Anusha | Feedback + adjustments |
| 14:00+ | Breaks, final notes, celebration 🎉 | Team | Ready to submit |

---

## **Critical Quality Checklist**

**Don't submit unless:**
- ✅ NO red failure indicators anywhere (meme/story/flashcard videos)
- ✅ Socratic dialogue is warm + encouraging (questions, not answers in attempts 1–2)
- ✅ Confidence buttons work + are visible (not just points/scores)
- ✅ Teacher heatmap is visually hot (color gradation from grey to emerald)
- ✅ AI Insights cards all load data (Top Topics, Avg Confidence, Answer Accuracy)
- ✅ Debate app shows VERDICT in round 3 (format: "VERDICT: [who won] [improvement]")
- ✅ Concept Map shows both connection-level + map-level feedback
- ✅ All text legible in final video (no tiny fonts, good contrast)
- ✅ Narration syncs with on-screen action (speech + visuals aligned)
- ✅ Music doesn't overpower narration (-18dB or quieter)

---

## **Key Decision Points (If Something Breaks)**

### **If a student video fails (API error, formatting issue):**
- Retake immediately (don't move on)
- If it's a UI bug → Nissan makes the call: retake or work around?
- **Boundary:** No new code during recording. Only workarounds.

### **If teacher dashboard is empty (no test data):**
- Manually create 3–4 test students + activity before recording
- Populate with realistic data (doesn't have to be real students, just believable)
- Use cURL or Postman to seed the database if needed

### **If narration doesn't sync perfectly:**
- First pass: Don't re-record narration. Edit the video cuts to match the narration.
- If narration is clearly wrong (factual error) → quick re-record one section
- **Priority:** Get it done, not perfect.

### **If Anusha's rehearsal finds pacing issues:**
- Minor tweaks: Trim 2–3 seconds from a video, compress transitions
- Major issues: Schedule a quick re-shoot for next morning (April 8)
- **Don't delay submission.** If videos are good, rehearsal feedback is refinement, not redesign.

---

## **What NOT to Do**

❌ **Don't add new features** (no matter how good the idea)  
❌ **Don't perfectionism-loop** (first take is good enough)  
❌ **Don't change the narration** (unless factually wrong)  
❌ **Don't record in bright sunlight** (use consistent indoor lighting)  
❌ **Don't forget to test playback** (watch the full final video before submitting)  

---

## **Success Criteria**

**Submission ready when:**
1. All 6 videos recorded + clipped
2. Master narration read + TTS generated
3. Full video assembled + synced + music added
4. Anusha has watched + given thumbs up
5. File is MP4, <2GB, 1920×1080, H.264
6. Playback on Presentation slide 11 works (click → full-screen → back)
7. **Total runtime:** 8–9 minutes

---

## **Files to Create**

After recording:

```
/public/showcase/
  ├── S1-photosynthesis-meme.mp4
  ├── S2-newtons-laws-story.mp4
  ├── S3-french-flashcards.mp4
  ├── T1-teacher-monitor.mp4
  ├── T2-teacher-analytics.mp4
  ├── M1-mini-apps-walkthrough.mp4
  ├── narration-master.mp3  (Kokoro TTS output)
  ├── music-bed.mp3  (royalty-free ambient/piano)
  └── QuestLearn-EduX-Final-Demo.mp4  (final cut)
```

Update Presentation slide 11 to embed final demo.

---

## **Hands Off Code**

✅ **Everything needed is already built:**
- Meme generator (fixed meme rendering in PR #41)
- Mini-apps (Flashcards, Debate, Concept Map in PR #42)
- Teacher dashboard (already live)
- All endpoints working

**No code changes needed for recording.** Just run the app and capture.

---

## **Nissan's Role Tomorrow**

1. **08:00:** Confirm recording environment is ready
2. **During recording:** Be available for quick UX decisions (if UI doesn't behave as expected)
3. **12:00:** Watch rough cut of narration + video
4. **13:00–14:00:** Rehearse with Anusha (practice pitch if needed)
5. **14:00:** Approve final video for submission

---

## **Anusha's Role Tomorrow**

1. **08:00–11:30:** Test the app as we record (ensure everything works as expected)
2. **11:30–12:00:** Be on standby for any re-records needed
3. **13:00–14:00:** Rehearse EduX pitch (timing + delivery)
4. **14:00:** Ready to present (or present practice run)

---

## **File Structure (Existing + New)**

```
/Users/loki/projects/questlearn/

docs/
  ├── script-A.md  (keep for reference)
  ├── script-B.md  (keep for reference)
  ├── script-C.md  (keep for reference)
  ├── UNIFIED-PRESENTATION-STRATEGY.md  ← NEW (consolidated narrative)
  ├── RECORDING-CHECKLIST.md  ← NEW (detailed per-video spec)
  └── TOMORROW-MISSION.md  ← NEW (this file)

src/app/presentation/
  └── page.tsx  (slides + demo video grid, update slide 11)

public/showcase/
  └── [6 videos + narration + music + final cut]  ← TO CREATE

projects/questlearn/
  └── STATUS.md  (update with final state for continuity)
```

---

## **Post-Recording Continuity**

Update `projects/questlearn/STATUS.md`:

```markdown
## RESUME FROM HERE

✅ Code complete:
- PR #41: Meme rendering fix
- PR #42: Mini-apps (Flashcards, Debate, Concept Map)

✅ Demo recorded:
- 6 videos captured + edited
- Narration + music synced
- Final video: QuestLearn-EduX-Final-Demo.mp4

⏳ Next:
- Presentation rehearsal with Anusha (timing, pitch confidence)
- Submit to EduX hackathon portal
- Monitor responses from judges
```

---

## **One Last Thing**

**Remember the narrative:**

The story isn't "look at our cool tech" — it's "students in Bourke deserve the same AI tutor as students in Bondi."

Every video, every second of the demo, serves that north star. Curricullm ensures expert content. Cogniti ensures engaging dialogue. The teacher dashboard ensures intelligent feedback. All three layers serve equity.

That's what we're showing tomorrow.

---

**Let's make it great. See you at 08:00. 🎬🎯**

