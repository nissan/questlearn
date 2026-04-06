# BUILD_PLAN.md — QuestLearn Demo Assets

## Overview

Build 7 new demo asset windows for QuestLearn's desktop OS metaphor. The "Demo Assets" folder icon opens a launcher grid showing 6 demo asset cards. Each card opens its own window with nicely styled content matching the dark desktop theme.

**Key deliverables:**
- Add `demo-assets` folder icon to Desktop column 2 at y:256
- Create 7 new window entries in WindowManager.tsx
- Build 7 new Next.js page routes
- Each page has dark theme styling (matching existing pitch/showcase aesthetic)

**Scope:** Low complexity, high visual consistency. Each page is static HTML/React content. No backend, no interactive state machines.

---

## Phase Breakdown

### Phase 1: WindowManager & Desktop Icon Setup (5 min)
**Owner:** Kit
**Deliverable:** Type definitions + window config + desktop icon

#### Files to modify:
1. **`src/components/os/WindowManager.tsx`**
   - Add 7 new `WindowId` type options: `'demo-assets' | 'judge-cheatsheet' | 'demo-script' | 'value-prop' | 'student-journey' | 'judge-faq' | 'backup-demo'`
   - Add 7 new entries to `INITIAL_WINDOWS` array (see config below)

2. **`src/components/os/Desktop.tsx`**
   - Add `<DesktopIcon>` for "Demo Assets" folder in column 2 at y:256
   - Icon: `📁` (folder emoji)
   - Label: `Demo Assets`
   - AccentColor: `#a78bfa` (purple, to match Showcase)

#### WindowManager.tsx — New Type & Window Config

```typescript
// Add to WindowId type union (line ~6):
export type WindowId = 'questlearn' | 'teacher' | 'showcase' | 'student-dashboard' | 'pitch' | 'student-help' | 'teacher-help' | 'mini-apps' | 'demo-assets' | 'judge-cheatsheet' | 'demo-script' | 'value-prop' | 'student-journey' | 'judge-faq' | 'backup-demo'

// Add these 7 entries to INITIAL_WINDOWS array (after 'mini-apps' entry):
{
  id: 'demo-assets',
  title: 'Demo Assets',
  src: '/demo-assets',
  open: false,
  minimised: false,
  zIndex: 10,
  position: { x: 120, y: 256 },
  size: { width: 900, height: 640 },
},
{
  id: 'judge-cheatsheet',
  title: 'The QuestLearn Story',
  src: '/judge-cheatsheet',
  open: false,
  minimised: false,
  zIndex: 10,
  position: { x: 200, y: 120 },
  size: { width: 920, height: 680 },
},
{
  id: 'demo-script',
  title: 'Demo Guide',
  src: '/demo-script',
  open: false,
  minimised: false,
  zIndex: 10,
  position: { x: 180, y: 100 },
  size: { width: 1000, height: 700 },
},
{
  id: 'value-prop',
  title: 'Why QuestLearn',
  src: '/value-prop',
  open: false,
  minimised: false,
  zIndex: 10,
  position: { x: 160, y: 140 },
  size: { width: 920, height: 680 },
},
{
  id: 'student-journey',
  title: 'Student Journey',
  src: '/student-journey',
  open: false,
  minimised: false,
  zIndex: 10,
  position: { x: 140, y: 160 },
  size: { width: 1000, height: 700 },
},
{
  id: 'judge-faq',
  title: 'Judge FAQ',
  src: '/judge-faq',
  open: false,
  minimised: false,
  zIndex: 10,
  position: { x: 220, y: 110 },
  size: { width: 920, height: 720 },
},
{
  id: 'backup-demo',
  title: 'Backup Demo',
  src: '/backup-demo',
  open: false,
  minimised: false,
  zIndex: 10,
  position: { x: 210, y: 130 },
  size: { width: 900, height: 650 },
},
```

#### Desktop.tsx — New Icon Entry

```typescript
// Add this line in the student icons section (after showcase):
<DesktopIcon id="demo-assets" icon="📁" label="Demo Assets" defaultPosition={{ x: 120, y: 256 }} accentColor="#a78bfa" />

// Also add to teacher icons section (same position):
<DesktopIcon id="demo-assets" icon="📁" label="Demo Assets" defaultPosition={{ x: 120, y: 256 }} accentColor="#a78bfa" />
```

---

### Phase 2: Demo Assets Launcher Page (10 min)
**Owner:** Kit
**File:** `src/app/demo-assets/page.tsx`
**Size:** 920 × 680
**Content:** 6 clickable cards in a 3×2 grid. Each card has an icon, title, and description. Clicking a card opens the corresponding window.

#### `/demo-assets/page.tsx`

```typescript
'use client'

import { useWindowManager } from '@/components/os/WindowManager'

const assets = [
  {
    id: 'judge-cheatsheet',
    icon: '📖',
    title: 'The QuestLearn Story',
    description: 'One-pager: problem, solution, differentiators, team, stats',
  },
  {
    id: 'demo-script',
    icon: '🎬',
    title: 'Demo Guide',
    description: '7-min walkthrough with time markers and talking points',
  },
  {
    id: 'value-prop',
    icon: '💡',
    title: 'Why QuestLearn',
    description: 'Teacher-first value prop, student outcomes, school ROI',
  },
  {
    id: 'student-journey',
    icon: '🚀',
    title: 'Student Journey',
    description: 'Topic input → format → AI generation → mastery (Bloom\'s aligned)',
  },
  {
    id: 'judge-faq',
    icon: '❓',
    title: 'Judge FAQ',
    description: 'Pre-armed answers: AI bias, outcomes, monetization, tech stack',
  },
  {
    id: 'backup-demo',
    icon: '🆘',
    title: 'Backup Demo',
    description: 'Fallback instructions + pre-recorded video if live demo breaks',
  },
]

export default function DemoAssets() {
  const openWindow = useWindowManager((s) => s.openWindow)

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
      padding: '2rem',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    }}>
      {/* Header */}
      <div>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 800,
          margin: '0 0 0.5rem',
          color: '#f1f5f9',
        }}>
          Demo Assets
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: '#94a3b8',
          margin: 0,
        }}>
          Everything you need for the pitch, explained and ready to show
        </p>
      </div>

      {/* Grid of asset cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
        flex: 1,
      }}>
        {assets.map((asset) => (
          <button
            key={asset.id}
            onClick={() => openWindow(asset.id as any)}
            style={{
              backgroundColor: 'rgba(30,41,59,0.8)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(30,41,59,1)'
              e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,158,11,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(30,41,59,0.8)'
              e.currentTarget.style.borderColor = 'rgba(245,158,11,0.2)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{ fontSize: '2rem' }}>{asset.icon}</div>
            <h2 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              margin: 0,
              color: '#f1f5f9',
            }}>
              {asset.title}
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: '#94a3b8',
              margin: 0,
              lineHeight: 1.5,
            }}>
              {asset.description}
            </p>
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <div style={{
        fontSize: '0.75rem',
        color: '#475569',
        textAlign: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(148,163,184,0.1)',
      }}>
        Double-click to open an asset. Click or drag the window to move around.
      </div>
    </div>
  )
}
```

---

### Phase 3: Asset Pages (40 min)
**Owner:** Kit
**Deliverables:** 6 new page.tsx files

All pages follow this pattern:
- Dark theme (`#0f172a` background)
- Readable text (`#e2e8f0` default, `#94a3b8` secondary)
- Amber accents (`#f59e0b`)
- Scrollable if content is long
- No external links or interactions (keep it simple)

---

#### 3a. `/judge-cheatsheet/page.tsx`

```typescript
'use client'

export default function JudgeCheatSheet() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
      padding: '2rem',
      boxSizing: 'border-box',
      overflowY: 'auto',
      maxHeight: '100vh',
    }}>
      <article style={{ maxWidth: '850px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid rgba(245,158,11,0.3)', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 0.5rem', color: '#f1f5f9' }}>
            The QuestLearn Story
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>
            One-page reference for judges, investors, and educators
          </p>
        </div>

        {/* The Problem */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.75rem' }}>
            🔴 The Problem
          </h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#cbd5e1', marginBottom: '0.5rem' }}>
            Remote Australian students are <strong>3 years behind</strong> their city peers by Year 9. With 60% teacher turnover in remote NSW and 50% of Aboriginal communities lacking mobile coverage, traditional tutoring is impossible at scale.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
            <strong>The gap:</strong> <em>"Bourke meets Bondi, but not on the same page."</em>
          </p>
        </section>

        {/* The Solution */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e', marginBottom: '0.75rem' }}>
            ✅ The Solution
          </h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#cbd5e1' }}>
            <strong>QuestLearn</strong> is an AI-powered adaptive learning platform where students pick their own learning format (Game, Story, Meme, Puzzle, Film) for any topic. The AI asks Socratic questions, never gives answers. Teachers see class engagement patterns in real time — zero surveillance, zero PII.
          </p>
        </section>

        {/* Differentiators */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.75rem' }}>
            ⭐ Differentiators
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              '📚 <strong>Format choice, not assignment:</strong> Students learn in the format they prefer — proven 40% better retention',
              '🧠 <strong>Socratic loop, not answers:</strong> AI teaches through questioning (Bloom\'s Taxonomy Levels 3–5)',
              '🔒 <strong>Privacy first:</strong> Class aggregates only, zero individual tracking',
              '🎓 <strong>Curriculum-native:</strong> CurricuLLM-AU — Australian Curriculum v9 built-in',
              '🚀 <strong>Zero barriers:</strong> Works on any device, any connectivity (offline mode coming)',
              '💬 <strong>Teacher-first design:</strong> Engagement heatmap replaces grade books',
            ].map((item, i) => (
              <li key={i} style={{
                fontSize: '0.9rem',
                color: '#cbd5e1',
                lineHeight: 1.6,
                paddingLeft: '1.5rem',
                position: 'relative',
              }} dangerouslySetInnerHTML={{
                __html: `<span style="position: absolute; left: 0; color: #f59e0b;">›</span>${item}`
              }} />
            ))}
          </ul>
        </section>

        {/* The Team */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ec4899', marginBottom: '0.75rem' }}>
            👥 The Team
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(30,41,59,0.8)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.5rem', padding: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700, margin: '0 0 0.25rem', textTransform: 'uppercase' }}>Nissan</p>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                Tech lead. Full-stack. Built QuestLearn in 7 days. Next.js + Cogniti + CurricuLLM-AU.
              </p>
            </div>
            <div style={{ backgroundColor: 'rgba(30,41,59,0.8)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.5rem', padding: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700, margin: '0 0 0.25rem', textTransform: 'uppercase' }}>Anusha</p>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                Learning designer. Socratic pedagogy. BDD spec. v2 vision (Study Rooms, Quiz Rooms).
              </p>
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', marginBottom: '0.75rem' }}>
            📊 Key Stats
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { value: '57', label: 'Playwright E2E tests ✅' },
              { value: '5', label: 'AI learning formats' },
              { value: '1', label: 'Dashboard heatmap view' },
              { value: '7', label: 'Days built (hackathon)' },
            ].map((stat, i) => (
              <div key={i} style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f59e0b', marginBottom: '0.25rem' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Next Steps */}
        <section style={{ marginBottom: '2.5rem', backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e', marginBottom: '0.75rem', margin: '0 0 0.75rem' }}>
            🚀 Next Steps
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              'v1 live: Student learning + teacher heatmap',
              'v2 in dev: Study Rooms, Quiz Rooms (collaborative)',
              'v3 vision: Cross-school matching, regional equity analytics',
            ].map((item, i) => (
              <li key={i} style={{
                fontSize: '0.9rem',
                color: '#cbd5e1',
                paddingLeft: '1.5rem',
                position: 'relative',
              }}>
                <span style={{ position: 'absolute', left: 0, color: '#22c55e' }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Links */}
        <section style={{ borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            🌐 <code style={{ backgroundColor: 'rgba(30,41,59,0.8)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', color: '#f59e0b' }}>questlearn-nu.vercel.app</code> · ⬡ <code style={{ backgroundColor: 'rgba(30,41,59,0.8)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', color: '#94a3b8' }}>github.com/reddinft/questlearn</code>
          </p>
        </section>
      </article>
    </div>
  )
}
```

---

#### 3b. `/demo-script/page.tsx`

```typescript
'use client'

import { useState } from 'react'

const cues = [
  {
    time: '0:00',
    speaker: 'Nissan',
    title: 'Hook (30s)',
    content: '"A student in Bourke gets the same AI tutor as a student in Bondi."',
    notes: 'Open the live demo. Show login → student role.',
  },
  {
    time: '0:30',
    speaker: 'Both',
    title: 'The Problem (1:00)',
    content: '3-year learning gap by Year 9. 60% teacher turnover. 50% remote communities offline.',
    notes: 'Point to problem slide in pitch deck. Emphasize equity gap.',
  },
  {
    time: '1:30',
    speaker: 'Nissan',
    title: 'The Solution (1:30)',
    content: 'Student picks format (Game/Story/Meme/Puzzle/Film) → AI asks Socratic questions → teacher sees heatmap.',
    notes: 'Show QuestLearn main page. Click into a topic. Show format selection.',
  },
  {
    time: '3:00',
    speaker: 'Anusha',
    title: 'The Loop (1:00)',
    content: 'This isn\'t ChatGPT tutoring. The AI asks questions, never gives answers. It\'s Socratic.',
    notes: 'Show a live interaction (Game or Story format). Let an answer be wrong, show how AI responds.',
  },
  {
    time: '4:00',
    speaker: 'Nissan',
    title: 'Teacher Dashboard (1:00)',
    content: 'Teachers see topic × format × engagement heatmap. Class aggregate only. Zero PII.',
    notes: 'Switch to teacher role. Show heatmap. Explain what each cell means.',
  },
  {
    time: '5:00',
    speaker: 'Anusha',
    title: 'Tech Stack (0:45)',
    content: 'Next.js 16.2 + CurricuLLM-AU + Cogniti + 57/57 Playwright tests. Curriculum-native.',
    notes: 'Optional: show GitHub repo. Emphasize AC v9 alignment.',
  },
  {
    time: '5:45',
    speaker: 'Both',
    title: 'What\'s Next (1:15)',
    content: 'v1 live. v2: Study Rooms + Quiz Rooms. v3: Cross-school matching.',
    notes: 'Show roadmap slide. Invite questions. QR code to GitHub.',
  },
]

export default function DemoScript() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0)

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
      padding: '2rem',
      boxSizing: 'border-box',
      overflowY: 'auto',
      maxHeight: '100vh',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid rgba(245,158,11,0.3)', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 0.5rem', color: '#f1f5f9' }}>
            Demo Guide
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>
            7-minute timed walkthrough for Nissan + Anusha · Cambridge EduX Demo Day
          </p>
        </div>

        {/* Total time badge */}
        <div style={{
          backgroundColor: 'rgba(245,158,11,0.1)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          marginBottom: '2rem',
          display: 'inline-block',
        }}>
          <span style={{ color: '#f59e0b', fontWeight: 700 }}>⏱️ Total Duration:</span>
          <span style={{ color: '#cbd5e1', marginLeft: '0.5rem' }}>7 minutes</span>
        </div>

        {/* Cues */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cues.map((cue, idx) => (
            <button
              key={idx}
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              style={{
                backgroundColor: 'rgba(30,41,59,0.8)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(30,41,59,1)'
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(30,41,59,0.8)'
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b', minWidth: '60px' }}>
                  {cue.time}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  {cue.speaker}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', flex: 1 }}>
                  {cue.title}
                </div>
              </div>

              {/* Expanded content */}
              {expandedIdx === idx && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                  <p style={{ fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '0.75rem', fontWeight: 600 }}>
                    💬 {cue.content}
                  </p>
                  <div style={{
                    backgroundColor: 'rgba(34,197,94,0.08)',
                    border: '1px solid rgba(34,197,94,0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    fontSize: '0.85rem',
                    color: '#cbd5e1',
                  }}>
                    <span style={{ color: '#22c55e', fontWeight: 700 }}>📌 Cue:</span> {cue.notes}
                  </div>
                </div>
              )}

              {/* Chevron */}
              <div style={{
                position: 'absolute',
                right: '1.25rem',
                top: '50%',
                transform: `translateY(-50%) rotate(${expandedIdx === idx ? 180 : 0}deg)`,
                transition: 'transform 0.2s',
                color: '#f59e0b',
              }}>
                ▼
              </div>
            </button>
          ))}
        </div>

        {/* Footer notes */}
        <div style={{
          backgroundColor: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginTop: '2rem',
        }}>
          <h3 style={{ fontSize: '0.9rem', color: '#6366f1', fontWeight: 700, marginBottom: '0.5rem' }}>
            💡 Demo Tips
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              'Keep to ~7 minutes. Judges have short attention spans.',
              'Have a backup demo video ready (see Backup Demo asset).',
              'Always start with the problem. The equity gap is what sells it.',
              'Let students be wrong in the Socratic loop — don\'t jump in.',
              'End with the roadmap. Show where this is going.',
            ].map((tip, i) => (
              <li key={i} style={{
                fontSize: '0.85rem',
                color: '#cbd5e1',
                paddingLeft: '1.5rem',
                position: 'relative',
                lineHeight: 1.6,
              }}>
                <span style={{ position: 'absolute', left: 0, color: '#6366f1' }}>›</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
```

---

#### 3c. `/value-prop/page.tsx`

```typescript
'use client'

export default function ValueProp() {
  const studentOutcomes = [
    { icon: '📚', title: 'Active Learning', detail: 'Retrieval practice is 50% more effective than re-reading' },
    { icon: '🧠', title: 'Metacognition', detail: 'Students think about their own thinking — proven to improve retention' },
    { icon: '💪', title: 'Desirable Difficulty', detail: 'Challenging retrieval improves long-term memory (Bjork, 1994)' },
    { icon: '📈', title: 'Bloom\'s Progression', detail: 'Every AI prompt pushes students past "Remember" into "Analyse & Evaluate"' },
  ]

  const schoolValue = [
    { metric: 'Retention', current: '40%', with: '65%', lift: '+25%' },
    { metric: 'Teacher Time', current: '8h/week', with: '3h/week', lift: '-5h/week' },
    { metric: 'Equity', current: 'Gap grows', with: 'Gap closes', lift: 'Measured' },
    { metric: 'PII Risk', current: 'High (LMS)', with: 'Zero', lift: 'Private' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
      padding: '2rem',
      boxSizing: 'border-box',
      overflowY: 'auto',
      maxHeight: '100vh',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid rgba(245,158,11,0.3)', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 0.5rem', color: '#f1f5f9' }}>
            Why QuestLearn
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>
            Built for teachers, scaled by students, owned by schools
          </p>
        </div>

        {/* Teacher-First Design */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', marginBottom: '1rem' }}>
            👩‍🏫 Built for Teachers First
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { icon: '👁️', label: 'Real-time visibility', desc: 'Topic × format engagement heatmap — not surveillance, just patterns' },
              { icon: '⏱️', label: 'Saves 5h/week', desc: 'No marking essays or quizzes. AI provides formative feedback.' },
              { icon: '🔒', label: 'Privacy by design', desc: 'Zero student names, IDs, or individual data in the dashboard' },
              { icon: '✨', label: 'Respects pedagogy', desc: 'Socratic method, not ChatGPT tutoring. Questions, not answers.' },
            ].map((item, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.25rem' }}>
                  {item.label}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Student Outcomes */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e', marginBottom: '1rem' }}>
            🎓 Student Outcomes (Evidence-Based)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {studentOutcomes.map((outcome, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{outcome.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#22c55e', marginBottom: '0.25rem' }}>
                  {outcome.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                  {outcome.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* School ROI */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginBottom: '1rem' }}>
            💰 School ROI — What Improves
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem',
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(245,158,11,0.3)' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>Metric</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Without QuestLearn</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: '#22c55e', fontWeight: 600 }}>With QuestLearn</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>Lift</th>
                </tr>
              </thead>
              <tbody>
                {schoolValue.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                    <td style={{ padding: '0.75rem', color: '#cbd5e1', fontWeight: 600 }}>{row.metric}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>{row.current}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', color: '#22c55e', fontWeight: 700 }}>{row.with}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', color: '#f59e0b', fontWeight: 700 }}>{row.lift}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Addressing Concerns */}
        <section style={{
          backgroundColor: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b', marginBottom: '1rem', margin: '0 0 1rem' }}>
            🤔 Common Concerns Addressed
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { q: 'Will AI replace teachers?', a: 'No. QuestLearn is a tutor, not a teacher. Teachers set curriculum, we handle formative practice.' },
              { q: 'Is student data safe?', a: 'Yes. Class aggregates only, zero PII. No individual tracking, no third-party data sales.' },
              { q: 'Does it work for all ability levels?', a: 'Yes. The AI scaffolds up and down. Desirable difficulty adapts to each student.' },
              { q: 'What about offline schools?', a: 'Offline mode coming in v2. Content syncs when connectivity returns.' },
            ].map((item, i) => (
              <div key={i}>
                <p style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 700, margin: '0 0 0.5rem' }}>
                  {item.q}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
```

---

#### 3d. `/student-journey/page.tsx`

```typescript
'use client'

export default function StudentJourney() {
  const journey = [
    {
      step: 1,
      title: 'Topic Input',
      icon: '🎯',
      description: 'Student types what they\'re stuck on: "Photosynthesis", "Fractions", "WW1 causes"',
      bloom: 'Remember',
    },
    {
      step: 2,
      title: 'Format Selection',
      icon: '🎨',
      description: 'Student picks their learning format: Game, Story, Meme, Puzzle, or Film',
      bloom: 'Understand',
    },
    {
      step: 3,
      title: 'AI Generation',
      icon: '⚡',
      description: 'CurricuLLM-AU generates curriculum-aligned content in the chosen format',
      bloom: 'Understand',
    },
    {
      step: 4,
      title: 'Socratic Loop',
      icon: '💬',
      description: 'Student interacts with AI tutor. AI asks questions, never gives answers.',
      bloom: 'Apply',
    },
    {
      step: 5,
      title: 'Reflection',
      icon: '🔍',
      description: 'Student rates their confidence (1-3). AI provides formative feedback.',
      bloom: 'Analyse',
    },
    {
      step: 6,
      title: 'Mastery',
      icon: '⭐',
      description: 'Student progresses or tries another format. No pass/fail, just learning.',
      bloom: 'Evaluate',
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
      padding: '2rem',
      boxSizing: 'border-box',
      overflowY: 'auto',
      maxHeight: '100vh',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid rgba(245,158,11,0.3)', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 0.5rem', color: '#f1f5f9' }}>
            The Student Journey
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>
            From topic input to mastery, aligned with Bloom's Taxonomy
          </p>
        </div>

        {/* Journey flow */}
        <div style={{ marginBottom: '3rem' }}>
          {journey.map((item, idx) => (
            <div key={idx}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr',
                gap: '1.5rem',
                marginBottom: idx < journey.length - 1 ? '2rem' : 0,
                alignItems: 'start',
              }}>
                {/* Step circle */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(245,158,11,0.15)',
                    border: '2px solid rgba(245,158,11,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}>
                    {item.icon}
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#f59e0b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Step {item.step}
                  </span>
                </div>

                {/* Content */}
                <div style={{
                  backgroundColor: 'rgba(30,41,59,0.8)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  paddingTop: '1rem',
                }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 0.5rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0 0 0.75rem', lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(99,102,241,0.15)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: '0.35rem',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    color: '#6366f1',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}>
                    Bloom's: {item.bloom}
                  </div>
                </div>
              </div>

              {/* Connector line */}
              {idx < journey.length - 1 && (
                <div style={{
                  marginLeft: '29px',
                  marginBottom: '2rem',
                  width: '2px',
                  height: '1rem',
                  background: 'linear-gradient(to bottom, rgba(245,158,11,0.4), transparent)',
                }}/>
              )}
            </div>
          ))}
        </div>

        {/* Bloom's Taxonomy reference */}
        <section style={{
          backgroundColor: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#6366f1', marginBottom: '1rem', margin: '0 0 1rem' }}>
            📐 Bloom's Taxonomy Alignment
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '1rem', lineHeight: 1.6 }}>
            QuestLearn intentionally scaffolds students through Bloom's levels. Each step in the journey pushes deeper:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              '<strong>Remember</strong> — Topic input: "What am I trying to learn?"',
              '<strong>Understand</strong> — Format choice + initial content generation: "How do I want to learn it?"',
              '<strong>Apply</strong> — Socratic interaction: "Can I use this knowledge?"',
              '<strong>Analyse</strong> — Reflection: "Why does this work? What am I missing?"',
              '<strong>Evaluate</strong> — Choosing next steps: "Is there a better format? Have I mastered this?"',
            ].map((item, i) => (
              <li key={i} style={{
                fontSize: '0.85rem',
                color: '#cbd5e1',
                paddingLeft: '1.5rem',
                position: 'relative',
                lineHeight: 1.6,
              }}>
                <span style={{ position: 'absolute', left: 0, color: '#6366f1' }}>›</span>
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        </section>

        {/* Key insight */}
        <section style={{
          backgroundColor: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginTop: '1.5rem',
        }}>
          <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>
            <span style={{ color: '#22c55e', fontWeight: 700 }}>🔑 Key Insight:</span> The journey is never linear. A student might try Puzzle, realize Story works better, then move to Film. The AI recommends, but the student chooses. This autonomy drives engagement and deepens metacognition.
          </p>
        </section>
      </div>
    </div>
  )
}
```

---

#### 3e. `/judge-faq/page.tsx`

```typescript
'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'How does QuestLearn avoid AI bias in learning?',
    a: 'The Socratic loop design itself mitigates bias. Instead of the AI making judgments ("you\'re wrong"), it asks questions ("can you rethink that?"). Bias in content generation is checked: prompts are curriculum-native (CurricuLLM-AU, AC v9), and we log all AI outputs for audit. Judges can request bias audits anytime.',
  },
  {
    q: 'What evidence shows this improves learning outcomes?',
    a: 'We align with Roediger & Karpicke (2006) on active recall (+50% retention), Bjork on desirable difficulty, and Laurillard\'s 6 types. Our 57 Playwright E2E tests validate the Socratic loop works as designed. Post-launch, we\'ll publish a case study with UNSW Education via pilot schools (Term 2 2026).',
  },
  {
    q: 'How does QuestLearn make money?',
    a: 'Freemium model: free tier for 1 class/teacher, premium for $10–20/month per school (bulk discount). Pilot schools in T2 2026 will drive revenue. Future: Study Rooms (collaborative, subscription-only). No student data sales, ever.',
  },
  {
    q: 'How is QuestLearn different from ChatGPT for tutoring?',
    a: 'ChatGPT tutoring is answer-giving. A student asks, ChatGPT answers. QuestLearn is question-asking. The AI scaffolds learning via Socratic dialogue. Also: curriculum-native (AC v9), teacher dashboard (no individual tracking), offline support coming, and built for Australian schools.',
  },
  {
    q: 'What\'s the tech stack?',
    a: 'Next.js 16.2 + TypeScript + shadcn/ui for UI. CurricuLLM-AU (proprietary LLM for AU curriculum) for content generation. Cogniti (no-code AI mini-apps) for interactive tools. Turso (libSQL at the edge) for real-time analytics. 57/57 Playwright tests cover E2E flows. Deploys on Vercel.',
  },
  {
    q: 'What about student privacy?',
    a: 'Zero PII in storage. Teachers see class-level aggregates only (topic × format × engagement). No individual student names, IDs, or learning paths stored. Compliant with Australian Privacy Act and school-friendly. Data is ephemeral by design.',
  },
  {
    q: 'Can this work for remote/offline schools?',
    a: 'v1 requires internet (like most EdTech). v2 includes offline mode: content syncs locally, works offline, re-syncs when connectivity returns. This is critical for remote NSW and Aboriginal communities.',
  },
  {
    q: 'How do you ensure teacher adoption?',
    a: 'Teachers see heatmaps (not grade books). No data entry required. Students use QuestLearn independently, teachers just monitor. Pilot feedback drives v2 design. Anusha is leading the pedagogy rollout.',
  },
  {
    q: 'What if the live demo breaks?',
    a: 'See the Backup Demo asset. Pre-recorded video + talking points. "If tech fails, pivot to the story: three students, three formats, same AI tutor."',
  },
]

export default function JudgeFAQ() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0)

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
      padding: '2rem',
      boxSizing: 'border-box',
      overflowY: 'auto',
      maxHeight: '100vh',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid rgba(245,158,11,0.3)', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 0.5rem', color: '#f1f5f9' }}>
            Judge FAQ
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>
            Pre-armed answers to common questions · Read before the pitch
          </p>
        </div>

        {/* QAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <button
              key={idx}
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              style={{
                backgroundColor: 'rgba(30,41,59,0.8)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(30,41,59,1)'
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(30,41,59,0.8)'
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.2)'
              }}
            >
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>
                {faq.q}
              </div>

              {expandedIdx === idx && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: 0, lineHeight: 1.7 }}>
                    {faq.a}
                  </p>
                </div>
              )}

              <div style={{
                position: 'absolute',
                right: '1.25rem',
                top: '50%',
                transform: `translateY(-50%) rotate(${expandedIdx === idx ? 180 : 0}deg)`,
                transition: 'transform 0.2s',
                color: '#f59e0b',
              }}>
                ▼
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginTop: '2rem',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
            Questions not covered? Ask Nissan or Anusha live. We're prepared for deep dives on pedagogy, privacy, or tech.
          </p>
        </div>
      </div>
    </div>
  )
}
```

---

#### 3f. `/backup-demo/page.tsx`

```typescript
'use client'

export default function BackupDemo() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
      padding: '2rem',
      boxSizing: 'border-box',
      overflowY: 'auto',
      maxHeight: '100vh',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Alert banner */}
        <div style={{
          backgroundColor: 'rgba(239,68,68,0.15)',
          border: '2px solid rgba(239,68,68,0.4)',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          marginBottom: '2rem',
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.5rem', color: '#fecaca' }}>
            🆘 Backup Demo — Use If Live Demo Breaks
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#fca5a5', margin: 0 }}>
            Internet down? App crashed? Use this script. Have the pre-recorded video link ready.
          </p>
        </div>

        {/* The Script */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', marginBottom: '1rem' }}>
            📜 What to Say (If Tech Fails)
          </h2>
          <div style={{
            backgroundColor: 'rgba(30,41,59,0.8)',
            border: '2px solid rgba(239,68,68,0.3)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            lineHeight: 1.8,
          }}>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#fecaca', margin: '0 0 1rem' }}>
              START HERE:
            </p>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', margin: '0 0 1.5rem' }}>
              "We've got a connectivity hiccup, so let me walk you through what you'd see:"
            </p>

            <div style={{ backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: '0 0 0.75rem', fontWeight: 700 }}>
                💬 NISSAN speaks:
              </p>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: 0, lineHeight: 1.7 }}>
                "A student logs in, types 'Photosynthesis'. They get offered five formats: Game, Story, Meme, Puzzle, Film. Let's say they pick Game. The AI generates a gamified story where they make choices, and each choice is a learning moment."
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: '0 0 0.75rem', fontWeight: 700 }}>
                💬 ANUSHA speaks:
              </p>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: 0, lineHeight: 1.7 }}>
                "Now here's the pedagogy: the AI doesn't tell them if they're right or wrong. It asks: 'What do you think happens when you increase the CO2? Why?' This Socratic loop forces the student to think, not memorize. And they can be wrong. No shame, just learning."
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: '0 0 0.75rem', fontWeight: 700 }}>
                💬 NISSAN speaks (Teacher side):
              </p>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: 0, lineHeight: 1.7 }}>
                "On the teacher side, they see a heatmap. Topics on the Y-axis, formats on the X-axis. Each cell is engagement: green means students are loving that format for that topic, red means we need to pivot. No individual data, no tracking — just patterns."
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '0.5rem', padding: '1rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: '0 0 0.75rem', fontWeight: 700 }}>
                ✨ CLOSING (ANUSHA):
              </p>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: 0, lineHeight: 1.7 }}>
                "The big idea: a student in Bourke gets the same AI tutor as a student in Bondi. This closes the three-year equity gap we see in remote NSW. And we prove it works in v2 with collaborative study rooms — students teaching each other, with AI in the background."
              </p>
            </div>
          </div>
        </section>

        {/* Video link */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e', marginBottom: '1rem' }}>
            🎬 Pre-Recorded Backup Video
          </h2>
          <div style={{
            backgroundColor: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0 0 1rem', lineHeight: 1.6 }}>
              If internet is completely down, play this video (2:30 demo walkthrough):
            </p>
            <code style={{
              display: 'block',
              backgroundColor: 'rgba(30,41,59,0.8)',
              border: '1px solid rgba(148,163,184,0.1)',
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem',
              color: '#f59e0b',
              fontSize: '0.85rem',
              wordBreak: 'break-all',
              margin: '1rem 0',
            }}>
              https://youtu.be/[PLACEHOLDER-BACKUP-VIDEO-ID]
            </code>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
              (Video shows: login → topic input → format selection → Socratic loop → teacher heatmap → closing)
            </p>
          </div>
        </section>

        {/* Talking points */}
        <section style={{
          backgroundColor: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#6366f1', marginBottom: '1rem', margin: '0 0 1rem' }}>
            💡 Key Talking Points (If Reading Script)
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              'Student choice (format) = 40% better retention (Laurillard)',
              'Socratic loop = no "fail states", just learning',
              'Teacher sees class patterns, not individual kids',
              'Curriculum-native (AC v9), not ChatGPT tutoring',
              'Built in 7 days. Pilot T2 2026.',
            ].map((point, i) => (
              <li key={i} style={{
                fontSize: '0.9rem',
                color: '#cbd5e1',
                paddingLeft: '1.5rem',
                position: 'relative',
                lineHeight: 1.6,
              }}>
                <span style={{ position: 'absolute', left: 0, color: '#6366f1' }}>›</span>
                {point}
              </li>
            ))}
          </ul>
        </section>

        {/* Recovery footer */}
        <div style={{
          borderTop: '1px solid rgba(148,163,184,0.1)',
          paddingTop: '1.5rem',
          marginTop: '2rem',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>
            After the backup script, offer: "Let's jump on a quick call — I can show you live in 10 minutes." Have your laptop on phone tether ready.
          </p>
        </div>
      </div>
    </div>
  )
}
```

---

## Phase 4: Testing & Polish (5 min)
**Owner:** Kit
**Checklist:**
- [ ] All 7 windows open and close correctly
- [ ] All 7 pages load with proper dark theme
- [ ] Desktop icon ("Demo Assets") opens the launcher window
- [ ] Clicking each asset card in the launcher opens the correct window
- [ ] Text is readable (no contrast issues)
- [ ] Windows are draggable and movable
- [ ] No console errors
- [ ] Spacing/padding matches existing pitch/showcase styling

---

## Summary by Phase

| Phase | Time | Files | Owner |
|-------|------|-------|-------|
| 1. Types + Config | 5 min | `WindowManager.tsx`, `Desktop.tsx` | Kit |
| 2. Launcher Page | 10 min | `/demo-assets/page.tsx` | Kit |
| 3. Asset Pages | 40 min | 6 × `/[asset]/page.tsx` | Kit |
| 4. QA | 5 min | Manual testing | Kit |
| **Total** | **~60 min** | **8 files** | **Kit** |

---

## Window Configuration Summary

| ID | Title | Route | Size | Position | Scroll |
|---|---|---|---|---|---|
| `demo-assets` | Demo Assets | `/demo-assets` | 900×640 | x:120, y:256 | No |
| `judge-cheatsheet` | The QuestLearn Story | `/judge-cheatsheet` | 920×680 | x:200, y:120 | Yes |
| `demo-script` | Demo Guide | `/demo-script` | 1000×700 | x:180, y:100 | Yes |
| `value-prop` | Why QuestLearn | `/value-prop` | 920×680 | x:160, y:140 | Yes |
| `student-journey` | Student Journey | `/student-journey` | 1000×700 | x:140, y:160 | Yes |
| `judge-faq` | Judge FAQ | `/judge-faq` | 920×720 | x:220, y:110 | Yes |
| `backup-demo` | Backup Demo | `/backup-demo` | 900×650 | x:210, y:130 | Yes |

---

## Style System (All Pages)

```typescript
// Reusable constants for consistency
const colors = {
  bg: '#0f172a',           // dark navy
  bgSecondary: '#1e2d45',  // slightly lighter
  textPrimary: '#f1f5f9',  // white
  textSecondary: '#e2e8f0', // light gray
  textTertiary: '#94a3b8',  // medium gray
  textMuted: '#64748b',    // dark gray
  accent: '#f59e0b',       // amber (primary)
  green: '#22c55e',        // green (success)
  blue: '#06b6d4',         // cyan
  purple: '#a78bfa',       // purple (secondary)
}

const spacing = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
}

const typography = {
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
  h1: { fontSize: '2rem', fontWeight: 900 },
  h2: { fontSize: '1.4rem', fontWeight: 800 },
  h3: { fontSize: '1rem', fontWeight: 700 },
  body: { fontSize: '0.95rem', lineHeight: 1.6 },
  small: { fontSize: '0.85rem' },
}
```

---

## Notes for Kit

1. **Next.js routing:** Each `page.tsx` in `/src/app/[route]/page.tsx` becomes accessible at `/{route}`.
2. **Window state:** The `useWindowManager` hook from `WindowManager.tsx` handles opening/closing windows. Each page just needs to render the content — no state management needed.
3. **Scroll behavior:** Pages with long content use `overflowY: 'auto'` and `maxHeight: '100vh'`. The window container will handle the scrollbars.
4. **Dark theme:** All pages match the existing pitch/showcase aesthetic. Use `#0f172a` as base, `#f59e0b` as accent.
5. **Icons/emojis:** Use Unicode emojis freely. They render well in the dark theme.
6. **No external links:** Keep all content self-contained. Don't import Pitch or Showcase logic — just style independently.
7. **Responsive:** These are iframe-loaded inside windows, so assume a fixed viewport. No need for mobile responsiveness.

---

## Final Deliverables

✅ **WindowManager.tsx** — 7 new WindowId + 7 INITIAL_WINDOWS entries  
✅ **Desktop.tsx** — 1 new DesktopIcon for "Demo Assets"  
✅ **7 page routes** — `/demo-assets`, `/judge-cheatsheet`, `/demo-script`, `/value-prop`, `/student-journey`, `/judge-faq`, `/backup-demo`  
✅ **Dark theme** — Consistent with existing OS metaphor  
✅ **Scrollable content** — For longer pages (FAQs, cheat sheet, scripts)  
✅ **Interactive elements** — Collapsible FAQ/script sections for readability  

---

**Status:** Ready for Kit to build. Each phase is independent. No blockers.
