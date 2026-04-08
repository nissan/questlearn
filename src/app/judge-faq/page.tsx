'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'Where exactly is CurricuLLM used in the product?',
    a: 'CurricuLLM is used in two core backend paths: (1) `/api/learn/generate` for format-based content generation, and (2) `/api/learn/socratic` for follow-up questioning in the Socratic loop. The generated payload we process and return is `title`, `body`, `socraticPrompt`, and `curriculumRef`.',
  },
  {
    q: 'What exactly did Cogniti contribute in this build?',
    a: 'Cogniti is used for our mini-app and tutor workflow layer. The deck now shows the exact raw prompts we used in Cogniti for Flashcards, Concept Map, and Debate. In the app, Cogniti tutor mode is integrated as an external tutor flow (opens Cogniti with sign-in), while our core curriculum generation path remains CurricuLLM-native.',
  },
  {
    q: 'What is live today versus roadmap?',
    a: 'Live today: deployed QuestLearn app, topic+format AI generation, Socratic follow-up loop, and teacher-facing engagement views. Roadmap/next: collaborative Study Rooms + Quiz Rooms, deeper orchestration, and offline-first expansion. We separate shipped functionality from future scope explicitly in the deck.',
  },
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
                position: 'relative',
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
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', paddingRight: '2rem' }}>
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
