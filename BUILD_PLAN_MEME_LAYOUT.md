# BUILD PLAN — Meme Card Layout Fix
**Author:** Firefly  
**Date:** 2026-04-04  
**Status:** READY FOR KIT  
**Confidence:** High  
**Scope:** 1 file · 1 class change

---

## 1. Root Cause (precise)

The grid in `LearnContent.tsx` uses:

```
grid grid-cols-1 lg:grid-cols-2
```

Tailwind's `lg` breakpoint is **1024px**. The QuestLearn app runs inside a Lumina OS window iframe. The window is defined as `width: 1000` in `WindowManager.tsx`. After window chrome (title bar, borders: ~20–30px), the effective iframe viewport width is **~970–980px** — always below 1024px.

**Result:** The grid never enters two-column mode. It always renders as a single column.

In single-column mode, `MemeCard` renders with `w-full aspect-square`. At ~980px column width (minus `px-4` padding = ~948px usable), the meme square becomes **~948×948px** — far taller than the ~553px of available grid height (`100vh − 57px` offset, in a ~610px iframe). The meme overflows the window, top text clips, and the tutor panel is pushed completely off-screen.

**The two previous fix attempts were wrong-level fixes.** They tried to constrain the meme card itself without addressing the grid breakpoint, which is the actual cause.

---

## 2. Viewport Budget (confirmed)

| Measurement | Value |
|---|---|
| QuestLearn window size (WindowManager.tsx) | 1000 × 650 px |
| Window chrome overhead (title bar + borders) | ~30–40 px H, ~10 px W |
| Effective iframe viewport (est.) | ~980 W × ~610 H px |
| App header (QuestBanner + topic bar, `--banner-offset`) | ~57 px |
| Available grid height | `610 − 57 ≈ 553 px` |
| Available grid width | ~980 px |

With `md:grid-cols-2` (breakpoint = **768px**, triggers at 980px):
- Each column = ~490 px wide  
- Left column content width after `px-4` padding = **~458 px**
- MemeCard at `w-full aspect-square` = **458 × 458 px square** ← fits in 553px ✓
- Remaining height for caption + share button = ~553 − 458 − 44 (pill row) ≈ 51 px ✓

---

## 3. What to Change

### File: `LearnContent.tsx`

**Location:** The outer grid div (~line 179)

```tsx
// CURRENT — broken
<div className="grid grid-cols-1 lg:grid-cols-2" style={{height: 'calc(100vh - var(--banner-offset, 57px))'}}>

// FIXED
<div className="grid grid-cols-1 md:grid-cols-2" style={{height: 'calc(100vh - var(--banner-offset, 57px))'}}>
```

**Change:** `lg:grid-cols-2` → `md:grid-cols-2`

That is the **entire fix**. One class token. No other files need changes.

---

## 4. Why This Works

- `md` = 768px. At ~980px iframe width, `md:grid-cols-2` activates — two equal columns.
- Left column (~490px) + right column (~490px).
- MemeCard's `w-full aspect-square` now resolves to ~458×458px (after `px-4` padding).
- The format pill row above the meme is ~44px.
- Total left-column content: ~44 + 458 + small gap ≈ 510px — fits in 553px available. ✓
- Top text is positioned `absolute top-3` — visible at the top of the square. ✓
- Bottom text is `absolute bottom-3` — visible at the bottom of the square. ✓
- Image uses `object-cover` filling the square — no white gaps. ✓
- The right column (tutor panel) occupies the same row, accessible without scrolling. ✓
- Left column has `overflow-auto` — if a long caption or share button overflows slightly, it scrolls independently. ✓

---

## 5. Files NOT Changed

| File | Reason |
|---|---|
| `MemeCard.tsx` | `w-full aspect-square` is correct; the problem was column width, not card constraints |
| `WindowManager.tsx` | Window size is fine; changing it would break other layouts |

---

## 6. Risk Assessment

| Risk | Level | Notes |
|---|---|---|
| Breaks other viewports | Low | At true mobile (<768px), still single-column — correct |
| Breaks non-meme formats (story, flashcards) | None | All formats use the same grid; two-column is correct for all of them |
| Flashcard/concept_map tutor panel | None | Both use `flex flex-col flex-1 min-h-0` inside the right column — grid change doesn't affect them |
| `both` tutor mode (splits right column 50/50) | None | Still within right column; unaffected |

---

## 7. Implementation Instructions for Kit

**File:** `/Users/loki/projects/questlearn/src/components/learn/LearnContent.tsx`

Find this exact string (appears once):
```
grid grid-cols-1 lg:grid-cols-2
```

Replace with:
```
grid grid-cols-1 md:grid-cols-2
```

No other changes. Run `pnpm dev` and verify at `http://localhost:3000/learn?topic=test&format=meme`.

---

## 8. Acceptance Criteria

- [ ] Meme card is fully visible without scrolling in the QuestLearn window
- [ ] Top meme text is visible at the top of the card
- [ ] Bottom meme text is visible at the bottom of the card
- [ ] Image covers the full card (no white gaps)
- [ ] Tutor panel (right column) is visible alongside the meme without scrolling
- [ ] Non-meme formats (story, flashcards, concept_map) render correctly in two columns
- [ ] Mobile viewport (<768px) still renders single-column correctly
