# 🎬 QuestLearn Demo Recording Instructions
## CurricuLLM vs Cogniti Side-by-Side Demo
### For: EduX Hackathon Judges

---

## Prerequisites
- [ ] Browser: Chrome or Safari, 1920×1080 (or use Cmd+Shift+P → "Set device dimensions" in DevTools)
- [ ] URL: https://questlearn-nu.vercel.app/student-dashboard
- [ ] Screen recorder: QuickTime or OBS
- [ ] Microphone: off (voiceover added in post)
- [ ] Browser zoom: 100%
- [ ] Extensions: hide all (Presentation Mode recommended)

---

## Recording Setup (before you press record)
1. Open Chrome → Go to `https://questlearn-nu.vercel.app/student-dashboard`
2. Sign in with your account
3. Set window to fullscreen (F11 or Cmd+Ctrl+F)
4. Start QuickTime → File → New Screen Recording → select full screen
5. Press Record

---

## Scene-by-Scene Instructions

### Scene 1 (0:00–0:20) — Student Dashboard
**Target:** Show home screen → topic entry → format selection

| Time | Action |
|------|--------|
| 0:00 | HOLD on home screen for 3 seconds |
| 0:03 | CLICK on "New Quest" or topic input |
| 0:06 | TYPE "Photosynthesis" slowly (let text appear) |
| 0:11 | CLICK "Meme" format button |
| 0:14 | WAIT for meme to load (stay on screen) |
| 0:18 | PAUSE briefly on loaded meme |

**Screen region to show:** Full screen. No scrolling needed.

---

### Scene 2 (0:20–0:45) — Meme + Tutor Buttons
**Target:** Show the loaded meme + CurricuLLM/Cogniti/Both buttons

| Time | Action |
|------|--------|
| 0:20 | HOVER over the meme (don't click) |
| 0:28 | SLOWLY move cursor to right panel |
| 0:32 | HOVER over "CurricuLLM" button (don't click yet) |
| 0:36 | HOVER over "Cogniti" button |
| 0:40 | HOVER over "Both" button |
| 0:43 | PAUSE — leave cursor on "CurricuLLM" button |

**Screen region:** Show full width, especially the right sidebar.

---

### Scene 3 (0:45–1:45) — CurricuLLM Active
**Target:** CurricuLLM selected, question typed, AI responds, follow-up

| Time | Action |
|------|--------|
| 0:45 | CLICK "CurricuLLM" button |
| 0:48 | WAIT for CurricuLLM chat panel to activate |
| 0:52 | CLICK in the chat input field |
| 0:55 | TYPE: "What happens to sunlight when a plant captures it?" |
| 1:05 | CLICK "Send" button |
| 1:06 | WAIT for response to stream in (10–15 seconds) |
| 1:25 | PAUSE on response for 10 seconds |
| 1:35 | TYPE follow-up: "It converts light energy into chemical energy!" |
| 1:40 | CLICK "Send" |
| 1:43 | WAIT for second response (2 seconds) |

**Screen region:** Focus on right panel (chat UI). Left meme panel can be visible.

---

### Scene 4 (1:45–2:45) — Cogniti Active
**Target:** Switch to Cogniti, same question, different response

| Time | Action |
|------|--------|
| 1:45 | CLICK "Cogniti" button |
| 1:48 | WAIT for Cogniti chat panel to activate |
| 1:52 | CLICK in chat input field |
| 1:55 | TYPE: "What happens to sunlight when a plant captures it?" |
| 2:05 | CLICK "Send" |
| 2:06 | WAIT for response to stream in |
| 2:28 | PAUSE on response |
| 2:35 | TYPE follow-up: "Photosynthesis — converting light to sugar?" |
| 2:40 | CLICK "Send" |
| 2:43 | WAIT for response |

**Screen region:** Same as Scene 3. Cogniti should look visually distinct (purple vs green).

---

### Scene 5 (2:45–3:30) — Both Side-by-Side
**Target:** Click Both, ask same question, both respond simultaneously

| Time | Action |
|------|--------|
| 2:45 | CLICK "Both" button |
| 2:48 | WAIT for both panels to appear side-by-side |
| 2:54 | CLICK in the unified input (bottom) |
| 2:56 | TYPE: "Why do plants need CO2?" |
| 3:02 | CLICK "Send" |
| 3:03 | WAIT — both tutors stream responses simultaneously |
| 3:18 | PAUSE on both responses visible |
| 3:22 | NAVIGATE to teacher dashboard (new tab or menu) |
| 3:26 | SHOW teacher dashboard briefly |
| 3:30 | PAUSE |

**Screen region:** Show both panels clearly. Try to capture the side-by-side comparison.

---

### Scene 6 (3:30–4:00) — Closing
**Target:** Return to home screen, hold on QuestLearn branding

| Time | Action |
|------|--------|
| 3:30 | NAVIGATE to home: `https://questlearn-nu.vercel.app` |
| 3:34 | HOLD on home screen |
| 3:50 | STOP RECORDING |

---

## Post-Production (FFmpeg)

Once you have the raw screen recording (`raw-recording.mp4`), run these commands:

### 1. Trim and resize to 1080p
```bash
ffmpeg -i raw-recording.mp4 -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -crf 18 trimmed.mp4
```

### 2. Add voiceover (pre-generated audio)
```bash
# First, strip existing audio from screen recording
ffmpeg -i trimmed.mp4 -c:v copy -an video-only.mp4

# Then mux with voiceover
ffmpeg -i video-only.mp4 -i voiceover.mp3 -c:v copy -c:a aac -b:a 192k -shortest final.mp4
```

### 3. Add title card (2s) at the beginning
```bash
ffmpeg -i title-card.mp4 -i final.mp4 -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1" with-title.mp4
```

### 4. Add background music at 20% volume
```bash
# Download royalty-free background music (see below), then:
ffmpeg -i with-title.mp4 -i background-music.mp3   -filter_complex "[1:a]volume=0.2[music];[0:a][music]amix=inputs=2:duration=first"   -c:v copy -c:a aac -b:a 192k final-with-music.mp4
```

---

## Background Music Recommendations (Royalty-Free)

1. **"Digital Horizons" — Bensound** (bensound.com)
   - Genre: Upbeat corporate tech
   - URL: https://www.bensound.com/royalty-free-music/track/digital-horizons
   - License: Attribution required OR pay $49 for commercial

2. **"Happy Background" — Pixabay** (pixabay.com/music)
   - Genre: Upbeat educational, positive energy
   - URL: https://pixabay.com/music/search/educational%20upbeat/
   - License: Pixabay license (free for commercial use, no attribution needed)

3. **"Upbeat Corporate" — Mixkit** (mixkit.co)
   - Genre: Corporate tech demo feel
   - URL: https://mixkit.co/free-stock-music/upbeat/
   - License: Free (Mixkit License — no attribution needed)

**Recommendation:** Mixkit — no attribution needed, perfect for hackathon demos.

---

## Notes
- Keep the demo pace calm and deliberate — judges are watching carefully
- Don't rush typing — let each word appear naturally
- Wait for AI responses to fully load before continuing
- The side-by-side (Both) view is the hero moment — linger on it
