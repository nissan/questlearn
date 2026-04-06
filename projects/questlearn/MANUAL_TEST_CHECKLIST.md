# QuestLearn Manual Test Checklist

**Use before:** Each demo recording or public release  
**Estimated time:** ~15 minutes  
**Pass criteria:** 5/5 conversations must pass all checks

---

## Pre-Test Setup

- [ ] App is running locally (`npm run dev`) or on staging
- [ ] OpenAI API key is configured and working
- [ ] Navigate to the Learn/Socratic interface
- [ ] Open a fresh session (no prior conversation history)

---

## Socratic Conversation Tests

Test 5 conversations in sequence. For each, paste the question, wait for the AI response, then work through the checklist.

---

### Conversation 1 — Introductory question

**Student question:** `What is photosynthesis?`

**Expected:** Conversational opener + acknowledgment + exactly 1 question

Paste AI response here:
```
[PASTE RESPONSE]
```

**Checks:**
- [ ] Uses conversational opener (e.g. "Right", "Exactly", "So basically", "Good question")
- [ ] Does NOT use formal language ("Interesting", "Can you elaborate", "Fascinating")
- [ ] Exactly **1** question mark — count `?` manually: ___
- [ ] Under **80** words — do a word count: ___ words
- [ ] Acknowledges what the student asked (doesn't ignore the topic)
- [ ] Moves conversation forward (asks a follow-up, not asking student to repeat)
- [ ] Meme renders with actual image (not just text / gradient box)

**Result:** ☐ PASS &nbsp;&nbsp; ☐ FAIL

**Notes:**

---

### Conversation 2 — Follow-up question

**Student question:** `Where does it happen?`  
*(Continue in the same conversation thread)*

**Expected:** Natural follow-on that acknowledges the student's implicit context + 1 question

Paste AI response here:
```
[PASTE RESPONSE]
```

**Checks:**
- [ ] Uses conversational opener
- [ ] Does NOT use formal language
- [ ] Exactly **1** question mark: ___
- [ ] Under **80** words: ___ words
- [ ] Acknowledges the student's implied answer (they're referring to photosynthesis from Conv 1)
- [ ] Moves conversation forward
- [ ] Meme renders with actual image

**Result:** ☐ PASS &nbsp;&nbsp; ☐ FAIL

**Notes:**

---

### Conversation 3 — Deeper follow-up

**Student question:** `What's the purpose of photosynthesis?`  
*(Continue in same thread)*

**Expected:** Acknowledges the student's previous answers + guides toward a deeper insight

Paste AI response here:
```
[PASTE RESPONSE]
```

**Checks:**
- [ ] Uses conversational opener
- [ ] Does NOT use formal language
- [ ] Exactly **1** question mark: ___
- [ ] Under **80** words: ___ words
- [ ] Acknowledges student's previous answer (shows continuity)
- [ ] Moves conversation forward (not asking to repeat prior answers)
- [ ] Meme renders with actual image

**Result:** ☐ PASS &nbsp;&nbsp; ☐ FAIL

**Notes:**

---

### Conversation 4 — Easy/obvious question

**Student question:** `Do plants eat food?`  
*(Can be new thread or continue)*

**Expected:** Confirms the student's intuition (yes/no framing), then asks a deeper question

Paste AI response here:
```
[PASTE RESPONSE]
```

**Checks:**
- [ ] Uses conversational opener
- [ ] Does NOT use formal language
- [ ] Exactly **1** question mark: ___
- [ ] Under **80** words: ___ words
- [ ] Validates or gently corrects the student's framing
- [ ] Asks a deeper follow-up (not just "right, so?" — asks something specific)
- [ ] Meme renders with actual image

**Result:** ☐ PASS &nbsp;&nbsp; ☐ FAIL

**Notes:**

---

### Conversation 5 — Complex/technical question

**Student question:** `How is ATP created?`  
*(New thread recommended — this is harder)*

**Expected:** Offers an accessible entry point or analogy + 1 question to guide student in

Paste AI response here:
```
[PASTE RESPONSE]
```

**Checks:**
- [ ] Uses conversational opener
- [ ] Does NOT use formal language ("Adenosine triphosphate is synthesized..." = ❌)
- [ ] Exactly **1** question mark: ___
- [ ] Under **80** words: ___ words
- [ ] Makes the concept approachable (uses analogy or simple framing)
- [ ] Asks a question the student can actually answer (not too technical)
- [ ] Meme renders with actual image

**Result:** ☐ PASS &nbsp;&nbsp; ☐ FAIL

**Notes:**

---

## Summary

| Conv | Question | Result | Notes |
|---|---|---|---|
| 1 | What is photosynthesis? | ☐ PASS ☐ FAIL | |
| 2 | Where does it happen? | ☐ PASS ☐ FAIL | |
| 3 | What's the purpose? | ☐ PASS ☐ FAIL | |
| 4 | Do plants eat food? | ☐ PASS ☐ FAIL | |
| 5 | How is ATP created? | ☐ PASS ☐ FAIL | |

**Score:** ___ / 5

---

## Pass/Fail Decision

| Score | Status | Action |
|---|---|---|
| 5/5 | ✅ PASS | Clear to record demo |
| 4/5 or 3/5 | ⚠️ INVESTIGATE | Understand why 1-2 failed before proceeding |
| 2/5 or fewer | ❌ FAIL | Do NOT record demo — regression detected |

---

## Formal Language Blocklist

If ANY of the following appear in a response, it's an automatic fail for that conversation:

| Phrase | Why it fails |
|---|---|
| "Interesting" | Formal acknowledgment, not conversational |
| "Fascinating" | Academic praise, feels robotic |
| "Can you elaborate" | Generic prompt, doesn't guide |
| "That's a great question" | Empty filler |
| "Great thinking!" | Sycophantic, not Socratic |
| "Can you tell me more about" | Too open-ended, no guidance |
| "Please explain" | Formal/instructional register |

---

## Quick Word Count Method

1. Paste the response into [wordcounter.net](https://wordcounter.net) or
2. In terminal: `echo "paste response here" | wc -w`
3. Or just estimate: 80 words ≈ 4-5 sentences of normal length

---

*Checklist version: 1.0 — Last updated: 2026-04-06*
