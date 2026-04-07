'use client';

import { useEffect, useRef, useState } from 'react';

const TOTAL_SLIDES = 9;
const amber = '#f59e0b';
const navy = '#0f172a';

const slideBase: React.CSSProperties = {
  minHeight: '100vh',
  width: '100%',
  scrollSnapAlign: 'start',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem 1.5rem',
  boxSizing: 'border-box',
  backgroundColor: navy,
  color: '#e2e8f0',
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
};

export default function SocialEngagementDeck() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const current = Math.round(container.scrollTop / container.clientHeight) + 1;
      setCurrentSlide(Math.min(Math.max(current, 1), TOTAL_SLIDES));
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  const goToSlide = (n: number) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: (n - 1) * container.clientHeight, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ height: '100%', overflowY: 'auto', scrollSnapType: 'y mandatory' }}>
        <SlideTitle />
        <SlideSocialStats />
        <SlideAttentionShift />
        <SlideStudentLearning />
        <SlideStudentPride />
        <SlideTeacherLoop />
        <SlideAISides />
        <SlideTodayFuture />
        <SlideClose />
      </div>

      <div style={{ position: 'fixed', right: '1rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '0.4rem', zIndex: 20 }}>
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i + 1)}
            style={{
              width: currentSlide === i + 1 ? 10 : 8,
              height: currentSlide === i + 1 ? 10 : 8,
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              background: currentSlide === i + 1 ? amber : 'rgba(255,255,255,0.35)',
              padding: 0,
            }}
            title={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <div style={{ position: 'fixed', bottom: '1rem', right: '1.25rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>
        {currentSlide} / {TOTAL_SLIDES}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.22)', borderRadius: '0.75rem', padding: '1rem 1.1rem' }}>
      <div style={{ color: amber, fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>{title}</div>
      <div style={{ color: '#cbd5e1', lineHeight: 1.6, fontSize: '0.95rem' }}>{children}</div>
    </div>
  );
}

function SlideTitle() {
  return (
    <section style={{ ...slideBase, textAlign: 'center' }}>
      <div style={{ maxWidth: 900 }}>
        <div style={{ color: amber, letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.6rem' }}>
          QuestLearn · Version 2
        </div>
        <h1 style={{ margin: 0, fontSize: 'clamp(2.4rem, 7vw, 4.6rem)', lineHeight: 1.1 }}>From Social Scroll to Learning Flow</h1>
        <p style={{ color: 'rgba(226,232,240,0.75)', fontSize: '1.1rem', lineHeight: 1.7, marginTop: '1rem' }}>
          A student-engagement-first story for EduX Demo Day.
        </p>
      </div>
    </section>
  );
}

function SlideSocialStats() {
  return (
    <section style={slideBase}>
      <div style={{ maxWidth: 980, width: '100%' }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(1.7rem, 4.5vw, 3rem)' }}>Students are already highly engaged online</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <Card title="46% online almost constantly">
            Nearly half of teens report being online almost constantly (up from 24% in 2014-15).
          </Card>
          <Card title="90% use YouTube">
            Platform usage is massive: YouTube 90%, TikTok 63%, Instagram 61%, Snapchat 55% among teens.
          </Card>
          <Card title="Australia sample: n=1,504">
            eSafety’s 2024 national study tracked social/media messaging use among Australian children aged 8-15.
          </Card>
        </div>
        <p style={{ marginTop: '0.9rem', color: 'rgba(148,163,184,0.9)', fontSize: '0.78rem', lineHeight: 1.5 }}>
          Sources: Pew Research Center teen fact sheets (U.S., Sept-Oct 2024); eSafety Commissioner Children and Social Media Survey (Australia, Sept 2024).
        </p>
      </div>
    </section>
  );
}

function SlideAttentionShift() {
  return (
    <section style={slideBase}>
      <div style={{ maxWidth: 880 }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(1.7rem, 4.5vw, 3rem)' }}>What if content consumption became active learning?</h2>
        <p style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '1.06rem' }}>
          QuestLearn redirects student attention from passive scrolling to active thinking, with the same level of interest and engagement, but focused on mastery.
        </p>
      </div>
    </section>
  );
}

function SlideStudentLearning() {
  return (
    <section style={slideBase}>
      <div style={{ maxWidth: 980, width: '100%' }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(1.7rem, 4.5vw, 3rem)' }}>How students learn in QuestLearn</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <Card title="Meme mode">High recall through visual hooks and humour.</Card>
          <Card title="Story + dialogue">Socratic prompts turn answers into reasoning.</Card>
          <Card title="Flashcards + concept maps">From memory to connections.</Card>
          <Card title="Debate flow">Students explain, defend, and refine ideas.</Card>
        </div>
      </div>
    </section>
  );
}

function SlideStudentPride() {
  return (
    <section style={slideBase}>
      <div style={{ maxWidth: 850 }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(1.7rem, 4.5vw, 3rem)' }}>Learning students can share with pride</h2>
        <p style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '1.06rem' }}>
          Students create visible outputs and progress moments they can show to peers, turning "I finished" into "Look what I learned".
        </p>
      </div>
    </section>
  );
}

function SlideTeacherLoop() {
  return (
    <section style={slideBase}>
      <div style={{ maxWidth: 980, width: '100%' }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(1.7rem, 4.5vw, 3rem)' }}>Teachers stay in the loop</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <Card title="Live visibility">See where students are engaged or stuck.</Card>
          <Card title="Lesson planning">Use real learning signals for the next lesson.</Card>
          <Card title="Quick quiz setup">Generate targeted checks based on class gaps.</Card>
        </div>
      </div>
    </section>
  );
}

function SlideAISides() {
  return (
    <section style={slideBase}>
      <div style={{ maxWidth: 900 }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(1.7rem, 4.5vw, 3rem)' }}>AI enhances both sides of the classroom</h2>
        <p style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '1.06rem' }}>
          For students: adaptive content and Socratic guidance. For teachers: insight, faster intervention, and informed planning. One loop, two beneficiaries.
        </p>
      </div>
    </section>
  );
}

function SlideTodayFuture() {
  return (
    <section style={slideBase}>
      <div style={{ maxWidth: 980, width: '100%' }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(1.7rem, 4.5vw, 3rem)' }}>What QuestLearn does today, and where it goes next</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <Card title="Today">Interactive learning formats, AI generation, Socratic follow-up, and teacher-side visibility are live in the current build.</Card>
          <Card title="Future scope">Reduce geography-based learning gaps by delivering engaging AI-supported learning experiences to every student, anywhere.</Card>
        </div>
      </div>
    </section>
  );
}

function SlideClose() {
  return (
    <section style={{ ...slideBase, textAlign: 'center' }}>
      <div style={{ maxWidth: 900 }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(2rem, 6vw, 3.7rem)' }}>QuestLearn</h2>
        <p style={{ color: 'rgba(226,232,240,0.78)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.2rem' }}>
          Meet students where their attention already is, then guide that attention toward deep learning.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/pitch" style={{ padding: '0.7rem 1.1rem', borderRadius: '0.55rem', border: '1px solid rgba(245,158,11,0.35)', color: amber, textDecoration: 'none', fontWeight: 700 }}>← Back to Deck Folder</a>
          <a href="https://questlearn-nu.vercel.app" target="_blank" rel="noopener noreferrer" style={{ padding: '0.7rem 1.1rem', borderRadius: '0.55rem', background: amber, color: navy, textDecoration: 'none', fontWeight: 800 }}>Open Live Demo</a>
        </div>
      </div>
    </section>
  );
}
