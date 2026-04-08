'use client';

import { useEffect, useRef, useState } from 'react';

const TOTAL_SLIDES = 13;

export default function PitchDeck() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const slideHeight = container.clientHeight;
      const current = Math.round(scrollTop / slideHeight) + 1;
      setCurrentSlide(Math.min(Math.max(current, 1), TOTAL_SLIDES));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const next = Math.min(currentSlide, TOTAL_SLIDES - 1);
        container.scrollTo({ top: next * container.clientHeight, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prev = Math.max(currentSlide - 2, 0);
        container.scrollTo({ top: prev * container.clientHeight, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentSlide]);

  const scrollToSlide = (n: number) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: (n - 1) * container.clientHeight, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#0f172a' }}>
      {/* Scrollable container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
        }}
      >
        <Slide1 />
        <Slide2 />
        <Slide3 />
        <Slide4 />
        <Slide5 />
        <Slide6 />
        <Slide7 />
        <SlideCoGniti />
        <Slide8 />
        <Slide9 />
        <SlideCurricuLLMCallV1 />
        <SlideCurricuLLMResponseV1 />
        <Slide10 />
      </div>

      {/* Nav dots — right side */}
      <div style={{
        position: 'fixed',
        right: '1.25rem',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        zIndex: 50,
      }}>
        {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
          <button
            key={i}
            onClick={() => scrollToSlide(i + 1)}
            title={`Slide ${i + 1}`}
            style={{
              width: currentSlide === i + 1 ? '10px' : '8px',
              height: currentSlide === i + 1 ? '10px' : '8px',
              borderRadius: '50%',
              backgroundColor: currentSlide === i + 1 ? '#f59e0b' : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.5rem',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '0.75rem',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        zIndex: 50,
      }}>
        {currentSlide} / {TOTAL_SLIDES}
      </div>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const slideBase: React.CSSProperties = {
  minHeight: '100vh',
  width: '100%',
  scrollSnapAlign: 'start',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem 2rem',
  boxSizing: 'border-box',
  backgroundColor: '#0f172a',
  color: '#e2e8f0',
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
  position: 'relative',
};

const amber = '#f59e0b';
const green = '#22c55e';
const navy = '#0f172a';
const slate800 = 'rgba(30,41,59,0.8)';

// ─── Slide 1: Title ───────────────────────────────────────────────────────────

function Slide1() {
  return (
    <div style={{ ...slideBase, justifyContent: 'center', textAlign: 'center' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.12) 0%, transparent 70%)',
        }} />
      </div>

      <div style={{ position: 'relative', maxWidth: '800px', width: '100%' }}>
        <div style={{ marginBottom: '0.5rem', color: amber, fontSize: '0.9rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
          Cambridge EduX Hackathon 2026
        </div>
        <h1 style={{
          fontSize: 'clamp(3.5rem, 10vw, 7rem)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          margin: '0 0 0.2em',
          background: 'linear-gradient(135deg, #ffffff 40%, #f59e0b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.05,
        }}>
          QuestLearn
        </h1>

        {/* Amber accent line */}
        <div style={{ width: '80px', height: '4px', background: amber, margin: '0 auto 1.5rem', borderRadius: '2px' }} />

        <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', color: '#cbd5e1', marginBottom: '1rem', lineHeight: 1.5 }}>
          AI-powered adaptive learning for every Australian student
        </p>

        <p style={{ fontSize: '1rem', color: 'rgba(203,213,225,0.6)', marginBottom: '3rem' }}>
          Demo Day April 9 · UTS
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://questlearn-nu.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.75rem 1.75rem',
              backgroundColor: amber,
              color: navy,
              borderRadius: '0.5rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
          >
            Live Demo →
          </a>
        </div>
      </div>

      {/* Team names bottom right */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        right: '3rem',
        color: 'rgba(203,213,225,0.5)',
        fontSize: '0.8rem',
        textAlign: 'right',
      }}>
        Nissan Dookeran · Anusha
      </div>
    </div>
  );
}

// ─── Slide 2: The Problem ─────────────────────────────────────────────────────

function Slide2() {
  const stats = [
    { value: '3 years', label: 'Average learning gap between remote and city students by Year 9' },
    { value: '60%', label: 'Annual teacher turnover in remote NSW schools' },
    { value: '50%', label: 'Remote Aboriginal communities with no mobile coverage' },
  ];

  return (
    <div style={{ ...slideBase }}>
      <div style={{ maxWidth: '900px', width: '100%' }}>
        <div style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          The Problem
        </div>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, margin: '0 0 0.5em', color: '#f1f5f9', lineHeight: 1.2 }}>
          Three years behind.<br />By Year Nine.
        </h2>
        <div style={{ width: '60px', height: '3px', background: 'rgba(148,163,184,0.4)', marginBottom: '2.5rem', borderRadius: '2px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              backgroundColor: 'rgba(15,23,42,0.8)',
              border: '1px solid rgba(148,163,184,0.15)',
              borderRadius: '0.75rem',
              padding: '1.75rem 1.5rem',
            }}>
              <div style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 900, color: '#94a3b8', marginBottom: '0.5rem', lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(148,163,184,0.75)', lineHeight: 1.5 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '0.8rem', color: 'rgba(100,116,139,0.8)', marginTop: '1.5rem' }}>
          Source: AITSL, ACARA, ABS 2023
        </p>
      </div>
    </div>
  );
}

// ─── Slide 3: The Insight ─────────────────────────────────────────────────────

function Slide3() {
  const types = [
    { label: 'Acquisition', icon: '📚' },
    { label: 'Inquiry', icon: '🔍' },
    { label: 'Practice', icon: '🏋️' },
    { label: 'Production', icon: '🎬' },
    { label: 'Discussion', icon: '💬' },
    { label: 'Collaboration', icon: '🤝' },
  ];

  return (
    <div style={{ ...slideBase }}>
      <div style={{ maxWidth: '900px', width: '100%' }}>
        <div style={{ color: amber, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>
          The Insight — Diana Laurillard
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', fontWeight: 800, margin: '0 0 0.5em', color: '#f1f5f9', lineHeight: 1.2 }}>
          The format matters as much<br />as the content
        </h2>
        <div style={{ width: '60px', height: '3px', background: amber, marginBottom: '2.5rem', borderRadius: '2px' }} />

        {/* 6 learning types */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {types.map((t, i) => (
            <div key={i} style={{
              backgroundColor: slate800,
              border: `1px solid rgba(245,158,11,0.25)`,
              borderRadius: '0.75rem',
              padding: '1.25rem 1rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{t.icon}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>{t.label}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: '#94a3b8', lineHeight: 1.7, maxWidth: '650px', marginBottom: '2rem' }}>
          Different students learn the same concept in different ways. QuestLearn{' '}
          <span style={{ color: amber, fontWeight: 700 }}>gives them the choice.</span>
        </p>

        {/* Psychology evidence row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
          {[
            { label: 'Active Recall', detail: 'Retrieving knowledge yourself is 50% more effective than re-reading (Roediger & Karpicke, 2006)', icon: '🧠' },
            { label: 'Metacognition', detail: 'Thinking about your own thinking — the Socratic loop forces students to monitor their own understanding', icon: '🔁' },
            { label: 'Desirable Difficulty', detail: 'Making retrieval effortful improves long-term retention (Bjork, 1994)', icon: '💪' },
            { label: "Bloom's Taxonomy", detail: 'Every Socratic prompt pushes past Remember → Understand into Analyse → Evaluate', icon: '📐' },
          ].map((p, i) => (
            <div key={i} style={{
              backgroundColor: 'rgba(245,158,11,0.06)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: '0.65rem',
              padding: '0.9rem 1rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{p.icon}</span>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: amber, marginBottom: '0.25rem' }}>{p.label}</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.5 }}>{p.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide 4: The Solution ────────────────────────────────────────────────────

function Slide4() {
  const formats = [
    { emoji: '🎮', label: 'Game', type: 'Practice' },
    { emoji: '📖', label: 'Story', type: 'Acquisition' },
    { emoji: '🎭', label: 'Meme', type: 'Discussion' },
    { emoji: '🧩', label: 'Puzzle', type: 'Investigation' },
    { emoji: '🎬', label: 'Short Film', type: 'Production' },
  ];

  return (
    <div style={{ ...slideBase }}>
      <div style={{ maxWidth: '950px', width: '100%' }}>
        <div style={{ color: amber, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>
          The Solution
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', fontWeight: 800, margin: '0 0 0.5em', color: '#f1f5f9', lineHeight: 1.2 }}>
          QuestLearn — learning on your terms
        </h2>
        <div style={{ width: '60px', height: '3px', background: amber, marginBottom: '2.5rem', borderRadius: '2px' }} />

        {/* Format tiles */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {formats.map((f, i) => (
            <div key={i} style={{
              backgroundColor: slate800,
              border: `2px solid rgba(245,158,11,0.3)`,
              borderRadius: '1rem',
              padding: '1.5rem 1.25rem',
              textAlign: 'center',
              flex: '1 1 140px',
              maxWidth: '170px',
              transition: 'border-color 0.2s',
            }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{f.emoji}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.3rem' }}>{f.label}</div>
              <div style={{
                fontSize: '0.72rem',
                color: amber,
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(245,158,11,0.1)',
                padding: '0.2rem 0.5rem',
                borderRadius: '9999px',
                display: 'inline-block',
              }}>
                {f.type}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem', textAlign: 'center' }}>
          The student always chooses. Never assigned.
        </p>
        <p style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
          Every format generates curriculum-aligned content via CurricuLLM-AU (Australian Curriculum v9)
        </p>
      </div>
    </div>
  );
}

// ─── Slide 5: How It Works ────────────────────────────────────────────────────

function Slide5() {
  const steps = [
    { n: '01', title: 'Type a topic', sub: 'What are you stuck on?' },
    { n: '02', title: 'Pick a format', sub: 'How do you want to learn it?' },
    { n: '03', title: 'Learn + reflect', sub: 'AI asks questions, never gives answers' },
  ];

  return (
    <div style={{ ...slideBase }}>
      <div style={{ maxWidth: '900px', width: '100%' }}>
        <div style={{ color: amber, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>
          How It Works
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', fontWeight: 800, margin: '0 0 0.5em', color: '#f1f5f9', lineHeight: 1.2 }}>
          Three steps. No barriers.
        </h2>
        <div style={{ width: '60px', height: '3px', background: amber, marginBottom: '2.5rem', borderRadius: '2px' }} />

        {/* Step flow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                backgroundColor: slate800,
                border: `2px solid rgba(245,158,11,0.3)`,
                borderRadius: '1rem',
                padding: '1.75rem 1.5rem',
                textAlign: 'center',
                minWidth: '180px',
                maxWidth: '220px',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: amber, marginBottom: '0.5rem', fontVariantNumeric: 'tabular-nums' }}>
                  {s.n}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.4rem' }}>{s.title}</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>{s.sub}</div>
              </div>
              {i < steps.length - 1 && (
                <div style={{ padding: '0 0.5rem', color: amber, fontSize: '1.5rem', flexShrink: 0 }}>→</div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          backgroundColor: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.25)',
          borderRadius: '0.75rem',
          padding: '1rem 1.5rem',
          textAlign: 'center',
        }}>
          <span style={{ color: green, fontWeight: 600 }}>🔒 Privacy first: </span>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Teacher sees class engagement patterns in real time — no student PII stored
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 6: The Socratic Loop ───────────────────────────────────────────────

function Slide6() {
  const chat = [
    { role: 'student', text: 'I think photosynthesis uses sunlight to make food?' },
    { role: 'ai', text: 'Great thinking! You mentioned energy — can you be more specific about what form that energy takes, and how it gets stored in the plant?' },
    { role: 'student', text: 'It stores it as glucose I think?' },
    { role: 'ai', text: "You're on the right track! Now think about why the plant needs to store it that way — what does it actually use the glucose for?" },
  ];

  return (
    <div style={{ ...slideBase }}>
      <div style={{ maxWidth: '850px', width: '100%' }}>
        <div style={{ color: amber, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>
          The Socratic Loop
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', fontWeight: 800, margin: '0 0 0.5em', color: '#f1f5f9', lineHeight: 1.2 }}>
          The AI never gives the answer
        </h2>
        <div style={{ width: '60px', height: '3px', background: amber, marginBottom: '2rem', borderRadius: '2px' }} />

        {/* Mock chat */}
        <div style={{
          backgroundColor: slate800,
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {chat.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'student' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '80%',
                padding: '0.75rem 1rem',
                borderRadius: msg.role === 'student' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                backgroundColor: msg.role === 'student' ? 'rgba(245,158,11,0.15)' : 'rgba(30,41,59,0.9)',
                border: msg.role === 'student' ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(99,102,241,0.3)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: msg.role === 'student' ? '#fde68a' : '#c7d2fe',
              }}>
                <div style={{ fontSize: '0.7rem', marginBottom: '0.3rem', opacity: 0.6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {msg.role === 'student' ? '👤 Student' : '🤖 QuestLearn AI'}
                </div>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          backgroundColor: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '0.75rem',
          padding: '0.9rem 1.25rem',
          fontSize: '0.875rem',
          color: '#94a3b8',
          textAlign: 'center',
        }}>
          ✨ Wrong answers receive encouragement, never a fail state. <strong style={{ color: '#e2e8f0' }}>No scores. No leaderboards.</strong>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 7: Teacher Dashboard ───────────────────────────────────────────────

function Slide7() {
  // CSS heatmap data: rows = topics, cols = formats
  const topics = ['Photosynthesis', 'Fractions', 'WW1 Causes', 'Electricity', 'Poetry'];
  const formats = ['Game', 'Story', 'Meme', 'Puzzle', 'Film'];
  const heat = [
    [0.9, 0.6, 0.3, 0.7, 0.4],
    [0.5, 0.8, 0.6, 0.9, 0.2],
    [0.3, 0.7, 0.9, 0.4, 0.6],
    [0.8, 0.4, 0.2, 0.6, 0.8],
    [0.4, 0.9, 0.7, 0.3, 0.5],
  ];

  const heatColor = (v: number) => {
    if (v > 0.75) return '#22c55e';
    if (v > 0.5) return '#f59e0b';
    if (v > 0.3) return '#f97316';
    return '#ef4444';
  };

  return (
    <div style={{ ...slideBase }}>
      <div style={{ maxWidth: '950px', width: '100%' }}>
        <div style={{ color: amber, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>
          Teacher Dashboard
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', fontWeight: 800, margin: '0 0 0.5em', color: '#f1f5f9', lineHeight: 1.2 }}>
          Real-time insight. Zero surveillance.
        </h2>
        <div style={{ width: '60px', height: '3px', background: amber, marginBottom: '2rem', borderRadius: '2px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start', flexWrap: 'wrap' }}>
          {/* Left: description + bullets */}
          <div>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              Topic × format × engagement — aggregated class data only. No individual student data ever stored.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                'See what topics the class is stuck on',
                'See which learning formats are working',
                'No student names, IDs, or individual tracking — ever',
              ].map((b, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  <span style={{ color: green, fontSize: '1rem', flexShrink: 0 }}>✅</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: CSS heatmap */}
          <div style={{
            backgroundColor: slate800,
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '1rem',
            padding: '1.25rem',
            overflowX: 'auto',
          }}>
            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '90px repeat(5, 1fr)', gap: '4px', marginBottom: '4px' }}>
              <div />
              {formats.map((f, i) => (
                <div key={i} style={{ fontSize: '0.65rem', color: '#64748b', textAlign: 'center', fontWeight: 600 }}>{f}</div>
              ))}
            </div>
            {/* Data rows */}
            {topics.map((topic, row) => (
              <div key={row} style={{ display: 'grid', gridTemplateColumns: '90px repeat(5, 1fr)', gap: '4px', marginBottom: '4px' }}>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>{topic}</div>
                {heat[row].map((v, col) => (
                  <div key={col} style={{
                    height: '28px',
                    borderRadius: '4px',
                    backgroundColor: heatColor(v),
                    opacity: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6rem',
                    color: 'rgba(0,0,0,0.6)',
                    fontWeight: 700,
                  }}>
                    {Math.round(v * 100)}%
                  </div>
                ))}
              </div>
            ))}
            <div style={{ marginTop: '0.75rem', fontSize: '0.65rem', color: '#475569', textAlign: 'center' }}>
              Engagement heatmap — class aggregate only
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 7b: Cogniti Mini Apps ────────────────────────────────────────────

function SlideCoGniti() {
  const miniApps = [
    {
      icon: '🃏',
      name: 'Flashcard App',
      color: '#f59e0b',
      prompt: 'Build an interactive flashcard app for Years 8–10 students. Topic is passed as a URL parameter. Students flip cards, rate confidence (1–3), and type their own explanation to get AI feedback. Track telemetry: card_flipped, confidence_rated, answer_submitted.',
    },
    {
      icon: '🗺️',
      name: 'Concept Map',
      color: '#10b981',
      prompt: 'Build an interactive concept map for Years 8–10 students. The topic is passed as a URL parameter. Show a central node with the topic name. Students add connected nodes (key concepts) and draw relationships between them by typing the connection label (e.g. \'causes\', \'leads to\', \'is a type of\'). When the student clicks \'Check my map\', AI evaluates whether the connections are accurate and meaningful, gives 1–2 sentences of feedback, and suggests one missing connection they haven\'t made yet. Track telemetry: node_added, connection_drawn, map_submitted.',
    },
    {
      icon: '🎤',
      name: 'Debate Challenge',
      color: '#ec4899',
      prompt: 'Build a debate challenge app for Years 8–10 students. The topic is passed as a URL parameter. The student chooses their position (For / Against). The AI takes the opposite position. Run 3 rounds: each round the student types their argument (max 100 words), the AI responds with a counter-argument, then asks \'Can you strengthen that?\' After round 3, the AI gives a 2-sentence verdict on who argued more effectively and what the student could improve. Keep the AI\'s arguments challenging but age-appropriate for Australian high school. Track telemetry: position_chosen, argument_submitted, debate_completed.',
    },
  ];

  return (
    <div style={{ ...slideBase }}>
      <div style={{ maxWidth: '960px', width: '100%' }}>
        <div style={{ color: amber, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>
          Powered by Cogniti
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', fontWeight: 800, margin: '0 0 0.4em', color: '#f1f5f9', lineHeight: 1.2 }}>
          Mini Apps — AI learning tools, built with a single prompt
        </h2>
        <div style={{ width: '60px', height: '3px', background: amber, marginBottom: '0.75rem', borderRadius: '2px' }} />
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', marginBottom: '2rem', maxWidth: '680px' }}>
          Each mini app was generated in Cogniti using a single natural-language prompt — no custom code, no deployment. The prompt encodes the pedagogy; Cogniti handles the rest.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {miniApps.map((app, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid rgba(255,255,255,0.07)`,
              borderLeft: `4px solid ${app.color}`,
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              display: 'grid',
              gridTemplateColumns: '2.5rem 1fr',
              gap: '0 1rem',
              alignItems: 'start',
            }}>
              <span style={{ fontSize: '1.6rem', lineHeight: 1, paddingTop: '2px' }}>{app.icon}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: app.color, fontWeight: 700, fontSize: '0.95rem' }}>{app.name}</span>
                  <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Cogniti prompt</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', lineHeight: 1.6, margin: 0, fontFamily: 'ui-monospace, monospace' }}>
                  &ldquo;{app.prompt}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginTop: '1.5rem' }}>
          Each app tracks student telemetry (interactions, confidence ratings, submissions) and integrates into QuestLearn&apos;s teacher dashboard.
        </p>
      </div>
    </div>
  );
}

// ─── Slide 8: The Stack ───────────────────────────────────────────────────────

function Slide8() {
  const tech = [
    { label: 'Next.js 16.2 + shadcn/ui', icon: '⚡' },
    { label: 'CurricuLLM-AU — AC v9 native', icon: '🧠' },
    { label: 'Cogniti — AI mini apps (no-code)', icon: '🧩' },
    { label: 'Turso — libSQL at the edge', icon: '🗄️' },
    { label: 'Vercel — zero-config deploy', icon: '🚀' },
    { label: '57/57 Playwright E2E tests ✅', icon: '🧪' },
    { label: 'Australian Curriculum v9 aligned', icon: '📐' },
  ];

  return (
    <div style={{ ...slideBase }}>
      <div style={{ maxWidth: '900px', width: '100%' }}>
        <div style={{ color: amber, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>
          The Stack
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', fontWeight: 800, margin: '0 0 0.5em', color: '#f1f5f9', lineHeight: 1.2 }}>
          Built to last, not just to demo
        </h2>
        <div style={{ width: '60px', height: '3px', background: amber, marginBottom: '2.5rem', borderRadius: '2px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {tech.map((t, i) => (
            <div key={i} style={{
              backgroundColor: slate800,
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <span style={{ fontSize: '1.4rem' }}>{t.icon}</span>
              <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 500 }}>{t.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <a
            href="https://questlearn-nu.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: amber,
              fontSize: '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            🌐 questlearn-nu.vercel.app
          </a>
          <a
            href="https://github.com/reddinft/questlearn"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#94a3b8',
              fontSize: '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            ⬡ github.com/reddinft/questlearn
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 9: What Comes Next ─────────────────────────────────────────────────

function Slide9() {
  const roadmap = [
    {
      phase: 'v1 — Live Now',
      color: green,
      items: [
        '🎓 QuestLearn — student learning journey',
        '📊 Teacher Hub — class comprehension heatmap',
        'QuestLearn desktop OS shell',
        '5 AI-powered learning formats',
      ],
    },
    {
      phase: 'v2 — Coming Soon',
      color: amber,
      items: [
        '💬 Study Rooms — collaborative study sessions',
        '🧩 Quiz Rooms — real-time quiz battles',
        '🗂️ Open Threads — topic discussion boards',
        '📚 Syllabus Browser — AC v9 curriculum tree',
      ],
    },
    {
      phase: 'v3 — Future Vision',
      color: '#818cf8',
      items: [
        '🌏 Cross-School Match — study nationally',
        '📍 Regional Insights — equity analytics',
        'Full Laurillard 6-type framework',
        '"Bourke meets Bondi" — bridging the divide',
      ],
    },
  ];

  return (
    <div style={{ ...slideBase }}>
      <div style={{ maxWidth: '950px', width: '100%' }}>
        <div style={{ color: amber, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>
          What Comes Next — Anusha's Vision
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', fontWeight: 800, margin: '0 0 0.5em', color: '#f1f5f9', lineHeight: 1.2 }}>
          QuestLearn grows with the class
        </h2>
        <div style={{ width: '60px', height: '3px', background: amber, marginBottom: '2.5rem', borderRadius: '2px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {roadmap.map((r, i) => (
            <div key={i} style={{
              backgroundColor: slate800,
              border: `2px solid ${r.color}33`,
              borderTop: `3px solid ${r.color}`,
              borderRadius: '0.75rem',
              padding: '1.5rem',
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: r.color, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {r.phase}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {r.items.map((item, j) => (
                  <li key={j} style={{ fontSize: '0.875rem', color: '#94a3b8', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <span style={{ color: r.color, flexShrink: 0 }}>›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          backgroundColor: 'rgba(245,158,11,0.07)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '0.75rem',
          padding: '1rem 1.25rem',
          fontSize: '0.85rem',
          color: '#94a3b8',
          lineHeight: 1.6,
        }}>
          <strong style={{ color: amber }}>Collaborative learning vision by Anusha</strong> · Full BDD spec written · Ready to build
          <span style={{ display: 'block', marginTop: '0.25rem', color: '#64748b' }}>
            v2 completes the full Laurillard 6-type framework — adding Discussion + Collaboration
          </span>
        </div>
      </div>
    </div>
  );
}

function CodePanel({ title, code }: { title: string; code: string }) {
  return (
    <div style={{ backgroundColor: 'rgba(2,6,23,0.86)', border: '1px solid rgba(148,163,184,0.26)', borderRadius: '0.75rem', padding: '1rem' }}>
      <div style={{ color: amber, fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.6rem' }}>{title}</div>
      <pre style={{ margin: 0, overflowX: 'auto', color: '#e2e8f0', fontSize: '0.74rem', lineHeight: 1.55, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function InsightPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: slate800, border: '1px solid rgba(148,163,184,0.22)', borderRadius: '0.75rem', padding: '0.9rem 1rem' }}>
      <div style={{ color: amber, fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.35rem' }}>{title}</div>
      <div style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function SlideCurricuLLMCallV1() {
  const callCode = `// src/lib/curricullm-client.ts\ncompletion = await curricullm.chat.completions.create({\n  model,\n  messages: [\n    { role: 'system', content: getSystemPrompt(format, yearLevel) },\n    { role: 'user', content: userPrompt },\n  ],\n  temperature: 0.8,\n  max_tokens: 800,\n});\n\n// src/app/api/learn/generate/route.ts\ncontent = await withLangfuseTrace({\n  name: 'content-generation',\n  fn: async () => generateContent(topic, format, yearLevel ?? 'Year 9'),\n});`;

  return (
    <div style={slideBase}>
      <div style={{ maxWidth: '1020px', width: '100%' }}>
        <div style={{ color: amber, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>
          Technical Slide
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4.3vw, 2.9rem)', fontWeight: 800, margin: '0 0 1rem', color: '#f1f5f9' }}>
          How QuestLearn calls CurricuLLM
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '1rem' }}>
          <CodePanel title="Live code path" code={callCode} />
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <InsightPanel title="Flow">
              Learn page sends topic + format + year level to <code>/api/learn/generate</code>, then <code>generateContent()</code> calls CurricuLLM.
            </InsightPanel>
            <InsightPanel title="Prompt design">
              We pass a format-specific system prompt (Story, Game, Meme, Puzzle, Short Film) plus a strict JSON-output user prompt.
            </InsightPanel>
            <InsightPanel title="Observability">
              Calls are wrapped with Langfuse tracing so we can inspect latency, failures, and quality during pilots.
            </InsightPanel>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideCurricuLLMResponseV1() {
  const processCode = `// src/lib/curricullm-client.ts\nconst raw = completion.choices[0]?.message?.content ?? '';\nconst cleaned = raw.replace(/^\`\`\`json?\\n?/i, '').replace(/\\n?\`\`\`$/i, '').trim();\nconst parsed = JSON.parse(cleaned);\nreturn { ...parsed, _stub: false };\n\n// src/app/api/learn/generate/route.ts\nawait db.execute({\n  sql: \`INSERT INTO content_cache (...) VALUES (?, ?, ?, ?, ?, ?, ?, ?)\`,\n  args: [uuidv4(), topicKey, format, variantCount + 1, content.title, content.body, content.socraticPrompt, content.curriculumRef],\n});\n\nreturn NextResponse.json({ ...content, _cached: cached });`;

  return (
    <div style={slideBase}>
      <div style={{ maxWidth: '1020px', width: '100%' }}>
        <div style={{ color: amber, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>
          Technical Slide
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4.3vw, 2.9rem)', fontWeight: 800, margin: '0 0 1rem', color: '#f1f5f9' }}>
          How we process CurricuLLM responses
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '1rem' }}>
          <CodePanel title="Parsing + cache + API return" code={processCode} />
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <InsightPanel title="Data contract">
              We enforce a stable payload: <code>title</code>, <code>body</code>, <code>socraticPrompt</code>, <code>curriculumRef</code>.
            </InsightPanel>
            <InsightPanel title="Reliability">
              If parsing fails or key is missing, app falls back to stubs so demo flow still works.
            </InsightPanel>
            <InsightPanel title="UI ready">
              API returns normalized JSON immediately, so the student can read content and continue into the Socratic loop.
            </InsightPanel>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide 10: Close ──────────────────────────────────────────────────────────

function Slide10() {
  return (
    <div style={{ ...slideBase, textAlign: 'center', justifyContent: 'center' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 70%)',
        }} />
      </div>

      <div style={{ position: 'relative', maxWidth: '800px', width: '100%' }}>
        <blockquote style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 800,
          lineHeight: 1.3,
          color: '#f1f5f9',
          margin: '0 0 1.5em',
          fontStyle: 'normal',
        }}>
          "A student in Bourke gets the same AI tutor as a student in Bondi."
        </blockquote>

        <div style={{ width: '80px', height: '4px', background: amber, margin: '0 auto 2rem', borderRadius: '2px' }} />

        <h2 style={{
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          margin: '0 0 2rem',
          background: 'linear-gradient(135deg, #ffffff 40%, #f59e0b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          QuestLearn
        </h2>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <a
            href="https://questlearn-nu.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.75rem 1.75rem',
              backgroundColor: amber,
              color: navy,
              borderRadius: '0.5rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
            }}
          >
            🌐 Live Demo
          </a>
          <a
            href="https://questlearn-nu.vercel.app/pitch"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.75rem 1.75rem',
              backgroundColor: 'transparent',
              color: amber,
              border: `2px solid ${amber}`,
              borderRadius: '0.5rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
            }}
          >
            📑 Pitch Deck
          </a>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
          Cambridge EduX Hackathon 2026 · Built in 7 days
        </p>
        <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
          Nissan Dookeran · Anusha
        </p>
      </div>
    </div>
  );
}
