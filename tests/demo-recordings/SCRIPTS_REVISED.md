# QuestLearn Demo — Revised Narration Scripts & Scene Briefs
**Revised:** 2026-04-04  
**Author:** Sara (docs agent)  
**Reflects:** Lumina OS desktop, Topics tab, Cogniti tutor toggle, teacher quest pinning → student Ongoing Issues, meme two-LLM pipeline, first-visit WelcomeStep only, mobile direct-to-QuestLearn login.

---

## How to read this document

Each persona section contains:
1. **Narration script** — `(sentence, pause_after_seconds)` tuples, ready to drop into the `NARRATIONS` dict in `narrate_and_merge.py`
2. **Scene brief** — bullet list of what Playwright should record: pages, clicks, inputs, waits, linger moments

Narration targets **60–90 seconds** of spoken audio per persona (audio is stretched/compressed by ffmpeg to match the final video).

---

## S1 — Zara Osei · Year 10 · Parramatta High School · Photosynthesis · Story

### Narration Script

```python
'script': [
    ("QuestLearn — personalised AI learning for every Australian high school student.", 0.5),
    ("Meet Zara Osei. Year 10, Parramatta High School. Today she's tackling photosynthesis.", 0.6),
    ("It's her first visit, so QuestLearn shows her a quick setup — name, year, and school.", 0.5),
    ("Then she's straight into Lumina OS. No detours, no menus — QuestLearn opens right on her desktop.", 0.7),
    ("She spots photosynthesis trending in the Topics tab and clicks Learn — topic and Story format pre-loaded.", 0.6),
    ("CurricuLLM generates a curriculum-aligned story in real time, matched to the Australian Curriculum v9.", 0.7),
    ("The story unfolds with characters and conflict — but every beat anchors a real science concept.", 0.6),
    ("Zara types her reflection. The Cogniti tutor reads it, then asks: what's actually happening inside the chloroplast?", 0.6),
    ("That one question turns passive reading into active thinking. That's the difference.", 0.9),
]
```

**Estimated spoken time:** ~72 seconds

---

### Scene Brief — S1

- **Start:** Navigate to `BASE + '/desktop'` — `waitForLoadState('networkidle')`
- **WelcomeStep (first visit):** Expect `"Let's get started"` visible within 6 s — linger 700 ms
- **Onboarding form:** Type `'Zara Osei'` in name field → select `'Year 10'` from combobox → type `'Parramatta High School'` → type `'Parramatta NSW'` → linger 600 ms
- **Enter QuestLearn:** Click `"Enter QuestLearn"` button → wait 1 000 ms
- **Lumina OS desktop:** Pause 2 000 ms — show the macOS-style desktop with dock; camera should rest on the dock
- **Launch QuestLearn app:** Double-click `'QuestLearn'` icon in dock (two `.click()` calls, 260 ms apart) → wait for URL to contain `/learn` (timeout 12 s) → pause 800 ms
- **Topics tab:** Click the `'Topics'` tab or button if visible — pause 1 200 ms to show trending topics list — linger on `'Photosynthesis'` card
- **Click Learn on Photosynthesis card:** `page.getByRole('button', { name: /learn/i }).first().click()` — expect topic input pre-filled with `'Photosynthesis'` and Story format button highlighted
- **If topic not pre-filled:** Fall back to typing `'Photosynthesis'` in `input[placeholder*="opic"]` and clicking Story button manually
- **Generate:** Click `"Generate"` / `"Start"` button → wait 8 000 ms for API → pause 3 000 ms (reading pause — linger on generated story)
- **Chat response:** Wait for `textarea` to be visible → pause 2 000 ms → human-type: `"I think photosynthesis is how plants use sunlight, carbon dioxide and water to make their own food. The chlorophyll in the leaves captures the light energy and drives the whole reaction."` (wpm 40) → press `Enter` → wait 6 000 ms for AI reply
- **Cogniti tutor toggle:** If a `"Cogniti"` or `"Tutor"` toggle button is visible, click it → pause 2 000 ms to show the Socratic tutor panel → linger
- **End:** Pause 3 000 ms

---

## S2 — Kai Nguyen · Year 9 · Blacktown Boys High School · Newton's Laws of Motion · Game

### Narration Script

```python
'script': [
    ("Meet Kai Nguyen. Year 9, Blacktown Boys High School. Competitive, quick, and easily bored.", 0.5),
    ("When Kai logs in today, there's already something waiting in his Ongoing Issues.", 0.5),
    ("His teacher, Mr. Okafor, has pinned a quest on Newton's Laws. The badge says Assigned by Teacher.", 0.6),
    ("Kai clicks Start Quest. QuestLearn drops him straight into Game format — because Mr. Okafor knows his class.", 0.6),
    ("The scenario: a skateboarder hits a wall. What happens next? Kai has to choose — and justify his answer.", 0.6),
    ("He picks Option B, then defends it in the chat: an object in motion stays in motion unless a force acts on it.", 0.6),
    ("The tutor pushes back. What kind of force? How much? Kai fires back. And again.", 0.6),
    ("Four Socratic turns. Every one of them building real understanding.", 0.5),
    ("Mr. Okafor will see exactly this on the heatmap tomorrow morning.", 0.9),
]
```

**Estimated spoken time:** ~74 seconds

---

### Scene Brief — S2

- **Start:** Navigate to `BASE + '/desktop'` — `waitForLoadState('networkidle')`
- **WelcomeStep:** Expect `"Let's get started"` → fill `'Kai Nguyen'` / `'Year 9'` / `'Blacktown Boys High School'` / `'Blacktown NSW'` → click `"Enter QuestLearn"` → wait 1 000 ms
- **Lumina OS desktop:** Pause 1 800 ms — show desktop/dock
- **Launch QuestLearn:** Double-click `'QuestLearn'` dock icon → wait for `/learn` URL → pause 600 ms
- **Ongoing Issues section:** Scroll to `"Ongoing Issues"` section — wait for `"Assigned by Teacher"` badge to be visible (timeout 5 s, `.catch(() => null)`) — linger 2 000 ms; camera should rest on the 📌 badge and `"Start Quest →"` button
- **Start Quest:** Click `page.getByRole('button', { name: /start quest/i })` → wait 800 ms
- **Expect:** Game format pre-loaded; topic `"Newton's Laws of Motion"` pre-filled
- **Generate (if needed):** If a `"Generate"` button is visible, click it → wait 8 000 ms for API → pause 2 500 ms (reading game scenario)
- **Game interaction:** Wait for `textarea` → pause 1 500 ms → human-type: `"Option B. An object in motion stays in motion unless something pushes it — that's Newton's first law, inertia."` (wpm 55) → press `Enter` → wait 5 000 ms for AI reply → linger 1 500 ms
- **Second Socratic turn:** Human-type: `"The friction from the ground and the wall are the forces acting on it. They slow it down and change direction."` (wpm 50) → press `Enter` → wait 5 000 ms
- **Cogniti tutor toggle:** If toggle visible, click → pause 1 500 ms to show Cogniti panel
- **End:** Pause 3 000 ms

---

## S3 — Priya Sharma · Year 8 · Strathfield Girls High School · The Water Cycle · Meme

### Narration Script

```python
'script': [
    ("Meet Priya Sharma. Year 8, Strathfield Girls High School. She communicates entirely in memes. That's a skill.", 0.5),
    ("She opens the Topics tab and sees The Water Cycle trending in her grade.", 0.5),
    ("She clicks Learn — and QuestLearn pre-selects Meme format. Because it knows her.", 0.7),
    ("Here's what's happening under the hood.", 0.3),
    ("CurricuLLM-AU generates the curriculum fact — evaporation, condensation, precipitation — anchored to the Australian Curriculum.", 0.6),
    ("Then GPT-5.4-mini reads that content, picks the perfect template from a library of one hundred classic memes, and writes the joke.", 0.7),
    ("Two AIs. One curriculum-aligned meme.", 0.5),
    ("Priya laughs. She also just learned how evaporation works.", 0.5),
    ("She switches to the Cogniti tutor and explains the full water cycle back in her own words — in Gen Z, but entirely correct.", 0.6),
    ("Five formats. Every learning style. Every student.", 0.9),
]
```

**Estimated spoken time:** ~72 seconds

---

### Scene Brief — S3

- **Start:** Navigate to `BASE + '/desktop'` — `waitForLoadState('networkidle')`
- **WelcomeStep:** Fill `'Priya Sharma'` / `'Year 8'` / `'Strathfield Girls High School'` / `'Strathfield NSW'` → click `"Enter QuestLearn"` → wait 1 000 ms
- **Lumina OS desktop:** Pause 1 800 ms
- **Launch QuestLearn:** Double-click `'QuestLearn'` icon → wait for `/learn` → pause 600 ms
- **Topics tab:** Click `'Topics'` tab/button → pause 1 200 ms — linger on trending topics list; camera should rest on `'The Water Cycle'` card
- **Click Learn:** `page.getByRole('button', { name: /learn/i }).first().click()` → expect `'The Water Cycle'` pre-filled and Meme button highlighted → pause 800 ms
- **Generate:** Click `"Generate"` button → wait 10 000 ms (two-LLM pipeline is slightly slower — CurricuLLM-AU + GPT-5.4-mini) → linger 4 000 ms on the generated meme (this is a key moment — slow down)
- **Meme visible:** Expect an `<img>` or meme container to be visible — `waitFor` with timeout 15 s
- **Chat/Cogniti:** Wait for `textarea` → pause 2 000 ms → human-type: `"lol ok so basically water evaporates when it gets hot, rises up, condenses into clouds, then falls as rain or snow and just keeps cycling forever"` (wpm 50) → press `Enter` → wait 5 000 ms
- **Cogniti toggle:** Click Cogniti tutor toggle if visible → pause 2 000 ms — linger on Socratic tutor panel
- **End:** Pause 3 000 ms

---

## T1 — Ms. Rachel Chen · Parramatta High School · Teacher Dashboard — Pin Quest + Heatmap

### Narration Script

```python
'script': [
    ("Now let's look at what QuestLearn means for the teacher.", 0.5),
    ("This is Ms. Rachel Chen. Science teacher, Parramatta High School.", 0.5),
    ("She logs in as a teacher and her Teacher Hub opens immediately — Lumina OS surfaces the right window for the right role.", 0.7),
    ("The engagement heatmap shows every topic her students explored this week, and which formats they used.", 0.6),
    ("She can see that photosynthesis has lower engagement in Story format, and much stronger engagement in Meme.", 0.6),
    ("So she creates a quest — a deeper dive on photosynthesis — and pins it to her Year 10 class.", 0.6),
    ("The moment she pins it, every student in that class sees it in their Ongoing Issues, with a badge that says Assigned by Teacher.", 0.7),
    ("This is a teacher directing learning at scale. No printouts. No emails. No chasing students up.", 0.6),
    ("Real-time insight. Instant action. That's QuestLearn for teachers.", 0.9),
]
```

**Estimated spoken time:** ~76 seconds

---

### Scene Brief — T1

- **Start:** Navigate to `BASE + '/desktop'` — `waitForLoadState('networkidle')`
- **Teacher toggle:** Click `"📊 Teacher"` button on WelcomeStep → pause 400 ms
- **Teacher onboarding form:** Type `'Ms. Rachel Chen'` / `'TCH-2047'` / `'Science'` / `'Parramatta High School'` / `'Parramatta NSW'` → click `"Enter QuestLearn"` → wait 1 000 ms
- **Lumina OS desktop (teacher view):** Pause 2 000 ms — note: teacher default window differs from student; Teacher Hub should already be open or prominent in the dock
- **Launch Teacher Hub:** Double-click `'Teacher Hub'` icon (if not already open) → wait for URL to contain `/teacher` → pause 1 500 ms
- **Engagement heatmap:** Pause 4 000 ms — camera lingers on heatmap; scroll slowly through topic rows
- **Identify low-engagement topic:** Locate `'Photosynthesis'` row — pause 1 500 ms to highlight contrast between formats
- **Pin quest flow:** Click `"Pin Quest"` or `"+ Quest"` button → wait 800 ms → fill quest form if present (topic: `'Photosynthesis'`, class: `'Year 10'`) → click `"Pin"` / `"Confirm"` → wait 1 500 ms
- **Confirmation:** Expect success toast or confirmation element to be visible — linger 2 000 ms
- **Heatmap scroll:** Scroll back to heatmap, pause 2 500 ms — show overall class data
- **End:** Pause 3 000 ms

---

## T2 — Mr. David Okafor · Blacktown Boys High School · Teacher Dashboard — Student Activity + Topics Browser

### Narration Script

```python
'script': [
    ("Mr. David Okafor. Mathematics teacher, Blacktown Boys High School.", 0.5),
    ("He had a strong hunch his Year 9 class responds best to game-format content. The heatmap confirms it.", 0.6),
    ("Average engagement: four-plus Socratic turns on Newton's Laws, Game format. That's deep thinking.", 0.6),
    ("He opens the Topics Browser to see what's trending across his school this week.", 0.5),
    ("Newton's Laws is at the top. He pins it as a class quest — knowing every student will see it the moment they log in.", 0.7),
    ("He can also see which students haven't started yet, and flag them for a check-in.", 0.6),
    ("This used to take a stack of quiz papers and a week to mark. Now it's live, visual, and actionable.", 0.6),
    ("QuestLearn doesn't just help students learn. It helps teachers teach smarter.", 0.9),
]
```

**Estimated spoken time:** ~67 seconds

---

### Scene Brief — T2

- **Start:** Navigate to `BASE + '/desktop'` — `waitForLoadState('networkidle')`
- **Teacher toggle:** Click `"📊 Teacher"` button → pause 400 ms
- **Teacher onboarding form:** Type `'Mr. David Okafor'` / `'TCH-1893'` / `'Mathematics'` / `'Blacktown Boys High School'` / `'Blacktown NSW'` → click `"Enter QuestLearn"` → wait 1 000 ms
- **Lumina OS desktop (teacher view):** Pause 2 000 ms — Teacher Hub is the default window
- **Launch Teacher Hub:** Double-click `'Teacher Hub'` (if not already open) → wait for `/teacher` URL → pause 1 500 ms
- **Engagement heatmap:** Pause 3 000 ms — camera lingers on heatmap data; highlight `'Newton's Laws'` row and Game format column
- **Student activity:** If a `"Students"` tab or section is visible, click it → pause 2 000 ms — scroll through student list → linger on students showing high Socratic turn count
- **Topics Browser:** Click `"Topics"` tab in the Teacher Hub sidebar/nav → pause 1 200 ms — show trending topics list; camera rests on `'Newton's Laws of Motion'` at the top
- **Pin quest:** Click `"Pin to Class"` or `"Pin Quest"` for Newton's Laws → confirm if prompted → wait 1 500 ms — linger on confirmation
- **Back to heatmap:** Navigate back to the heatmap view → pause 2 500 ms — final wide shot
- **End:** Pause 3 000 ms

---

## Notes for Playwright engineer

### Key behaviour changes to handle in the spec

1. **No home-grid detour on mobile login** — after `"Enter QuestLearn"`, students go directly to the Lumina OS desktop, not a home grid. Update any `waitForURL` assertions accordingly.

2. **WelcomeStep is first-visit only** — for any test that simulates a returning user, skip the onboarding form and assert that QuestLearn opens directly to the topic input or dashboard.

3. **Topics tab pre-selection** — when a user clicks `"Learn"` from the Topics tab, the topic input and format button should already be populated. Add an `expect` assertion before clicking Generate.

4. **Teacher quest → student Ongoing Issues** — T1 pins a quest for Year 10 at Parramatta. If S1 runs after T1 in the same recording session (same backend state), S1 should see the pinned quest. If the tests run independently, stub the Ongoing Issues section with a pre-seeded pinned quest or reorder the run sequence (T1 → S1, T2 → S2).

5. **Cogniti tutor toggle** — expect a toggle or tab (label: `"Cogniti"` or `"Tutor"`) alongside the CurricuLLM chat. Use `.isVisible()` guard before clicking — it may not appear until after first content generation.

6. **Meme generation timing** — the two-LLM pipeline (CurricuLLM-AU → GPT-5.4-mini) takes longer than single-model formats. Increase the post-generate `pause` for S3 to at least 10 000 ms, and use a `waitFor` on the meme image element rather than a fixed delay.

7. **Lumina OS dock** — the QuestLearn icon and Teacher Hub icon live in the dock. Use `page.locator('[data-dock-item="questlearn"]')` or fall back to `page.locator('span', { hasText: 'QuestLearn' })`. Teacher default window may open Teacher Hub automatically — check URL before double-clicking.
