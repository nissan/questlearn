'use client'
// Standalone presentation mode — full screen, no QuestLearn OS
import { useEffect, useState, useRef } from 'react'

const TOTAL_SLIDES = 12; // +1 for demos slide

// Color palette
const slate900 = '#0f172a';
const slate800 = '#1e293b';
const amber = '#f59e0b';
const green = '#10b981';

const slideBase: React.CSSProperties = {
  width: '100%',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(to bottom, ${slate900}, ${slate800})`,
  padding: '3rem',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'auto',
};

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isPresenterMode, setIsPresenterMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        const next = Math.min(currentSlide + 1, TOTAL_SLIDES);
        setCurrentSlide(next);
        setTimeout(() => {
          const slides = containerRef.current?.querySelectorAll('div[data-slide]');
          if (slides) slides[next - 1].scrollIntoView({ behavior: 'smooth' });
        }, 0);
      } else if (e.key === 'ArrowLeft') {
        const prev = Math.max(currentSlide - 1, 1);
        setCurrentSlide(prev);
        setTimeout(() => {
          const slides = containerRef.current?.querySelectorAll('div[data-slide]');
          if (slides) slides[prev - 1].scrollIntoView({ behavior: 'smooth' });
        }, 0);
      } else if (e.key === 'p' || e.key === 'P') {
        setIsPresenterMode(!isPresenterMode);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentSlide, isPresenterMode]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: slate900,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Main slide view */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
        }}
      >
        {/* Slide 1 */}
        <div data-slide="1" style={slideBase}>
          <div style={{ maxWidth: '900px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: amber, marginBottom: '1.5rem', fontWeight: 600 }}>
              EduX Hackathon 2026
            </div>
            <h1 style={{ fontSize: '4rem', fontWeight: 900, color: '#f1f5f9', margin: '0 0 1rem', lineHeight: 1.1 }}>
              QuestLearn
            </h1>
            <p style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
              Socratic dialogue powered by AI, scaffolded for Australian high schools
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(245,158,11,0.2)', color: amber, padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                🎓 Learning Platform
              </span>
              <span style={{ background: 'rgba(16,185,129,0.2)', color: green, padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                🤖 AI Tutor
              </span>
            </div>
          </div>
        </div>

        {/* Slides 2–10 (embed from pitch) */}
        <div data-slide="2" style={{ ...slideBase, color: '#f1f5f9' }}>
          <div style={{ textAlign: 'center', maxWidth: '900px' }}>
            <div style={{ fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: amber, marginBottom: '0.75rem', fontWeight: 600 }}>
              The Problem
            </div>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 1.5rem' }}>
              Australian students need better dialogue-based learning
            </h2>
            <div style={{ width: '60px', height: '3px', background: amber, margin: '0 auto 2.5rem', borderRadius: '2px' }} />
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
              Dialogue forces students to articulate thinking. The Socratic method drives metacognition. But it doesn't scale: one teacher, 30 students.
            </p>
          </div>
        </div>

        {/* Demos slide (NEW) */}
        <div data-slide="11" style={slideBase}>
          <div style={{ maxWidth: '1000px', width: '100%' }}>
            <div style={{ color: amber, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>
              Watch the Demo
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', fontWeight: 800, margin: '0 0 0.4em', color: '#f1f5f9', lineHeight: 1.2 }}>
              See QuestLearn in action
            </h2>
            <div style={{ width: '60px', height: '3px', background: amber, marginBottom: '2rem', borderRadius: '2px' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Student demos */}
              <DemoCard
                title="Student Journey — Photosynthesis"
                icon="🎓"
                color="#60a5fa"
                video="/showcase/S1-narrated.mp4"
                href="/demo/student-1"
              />
              <DemoCard
                title="Student Journey — Newton's Laws"
                icon="📚"
                color="#34d399"
                video="/showcase/S2-narrated.mp4"
                href="/demo/student-2"
              />
              <DemoCard
                title="Student Journey — French Verbs"
                icon="✏️"
                color="#a78bfa"
                video="/showcase/S3-narrated.mp4"
                href="/demo/student-3"
              />

              {/* Teacher demos */}
              <DemoCard
                title="Teacher Dashboard — Live Monitor"
                icon="📊"
                color="#f97316"
                video="/showcase/T1-narrated.mp4"
                href="/demo/teacher-1"
              />
              <DemoCard
                title="Teacher Dashboard — Analytics"
                icon="📈"
                color="#ec4899"
                video="/showcase/T2-narrated.mp4"
                href="/demo/teacher-2"
              />

              {/* Mini Apps */}
              <DemoCard
                title="Mini Apps Walkthrough"
                icon="🧩"
                color="#f59e0b"
                video="/showcase/questlearn-mini-apps-walkthrough-FINAL.mp4"
                href="/demo/mini-apps"
              />
            </div>

            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>
              Click any card to watch full-screen. All telemetry (PostHog, Sentry, Langfuse) is live.
            </p>
          </div>
        </div>

        {/* Close slide */}
        <div data-slide="12" style={slideBase}>
          <div style={{ maxWidth: '900px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '1.5rem' }}>
              Thank you
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
              QuestLearn — Socratic dialogue at scale
            </p>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.95rem' }}>
              <a href="https://questlearn-nu.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: amber, textDecoration: 'none', fontWeight: 600 }}>
                🌐 questlearn-nu.vercel.app
              </a>
              <a href="https://github.com/nissan/questlearn" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600 }}>
                ⬡ github.com/nissan/questlearn
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div style={{
        background: 'rgba(15,23,42,0.8)',
        borderTop: `1px solid rgba(245,158,11,0.15)`,
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentSlide(i + 1);
                const slides = containerRef.current?.querySelectorAll('div[data-slide]');
                if (slides) slides[i].scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                width: currentSlide === i + 1 ? '12px' : '8px',
                height: currentSlide === i + 1 ? '12px' : '8px',
                borderRadius: '50%',
                background: currentSlide === i + 1 ? amber : 'rgba(255,255,255,0.2)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontWeight: 600 }}>
            {currentSlide} / {TOTAL_SLIDES}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
            {isPresenterMode ? '👁️ Presenter' : '📺 Presentation'} • ← → or Space to navigate • P for presenter mode
          </span>
        </div>
      </div>
    </div>
  );
}

function DemoCard({ title, icon, color, video, href }: { title: string; icon: string; color: string; video: string; href: string }) {
  return (
    <a
      href={href}
      style={{
        display: 'block',
        textDecoration: 'none',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid rgba(255,255,255,0.06)`,
        borderLeft: `4px solid ${color}`,
        borderRadius: '0.75rem',
        padding: '1.25rem',
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = 'rgba(255,255,255,0.07)';
        el.style.borderColor = `${color}4d`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = 'rgba(255,255,255,0.03)';
        el.style.borderColor = 'rgba(255,255,255,0.06)';
      }}
    >
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.8rem' }}>{icon}</span>
        <h3 style={{ margin: 0, color: '#f1f5f9', fontSize: '0.95rem', fontWeight: 600, flex: 1 }}>{title}</h3>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>
        Click to watch full-screen →
      </p>
    </a>
  );
}
