'use client'
import { useParams } from 'next/navigation';

const DEMOS: Record<string, { title: string; description: string; video: string; icon: string }> = {
  'student-1': {
    title: 'Student Journey — Photosynthesis',
    description: 'Watch how a student learns photosynthesis using QuestLearn. They experience the Socratic loop: meme format, Socratic tutor questions, metacognitive reflection.',
    video: '/showcase/S1-narrated.mp4',
    icon: '🎓',
  },
  'student-2': {
    title: 'Student Journey — Newton\'s Laws',
    description: 'A student tackles Newton\'s Laws with multiple learning formats: meme explainer, concept map, Socratic dialogue.',
    video: '/showcase/S2-narrated.mp4',
    icon: '📚',
  },
  'student-3': {
    title: 'Student Journey — French Conjugations',
    description: 'Language learning with flashcards, meme-based mnemonics, and interactive practice. Real engagement tracking.',
    video: '/showcase/S3-narrated.mp4',
    icon: '✏️',
  },
  'teacher-1': {
    title: 'Teacher Dashboard — Live Monitoring',
    description: 'Teachers see real-time class comprehension heatmaps. Which students are struggling? Which topics are weak? Answered in seconds.',
    video: '/showcase/T1-narrated.mp4',
    icon: '📊',
  },
  'teacher-2': {
    title: 'Teacher Dashboard — Engagement Analytics',
    description: 'Deep-dive into student engagement metrics: time spent, confidence trajectories, quiz performance by format.',
    video: '/showcase/T2-narrated.mp4',
    icon: '📈',
  },
  'mini-apps': {
    title: 'Mini Apps — Flashcards, Concept Map, Debate, Meme',
    description: 'Flashcards with AI feedback, Concept Map with evaluation, Debate with AI opponent. Watch a live recording coming tomorrow.',
    video: '/showcase/questlearn-pitch-backup-2026-04-08.mp4',
    icon: '🧩',
  },
};

export default function DemoPage() {
  const params = useParams();
  const slug = params.slug as string;
  const demo = DEMOS[slug];

  if (!demo) {
    return (
      <div style={{ background: '#0f172a', color: '#f1f5f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Demo not found</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Sorry, we couldn't find that demo.</p>
          <a href="/presentation" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 600 }}>
            ← Back to presentation
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#0f172a',
      color: '#f1f5f9',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(15,23,42,0.8)',
        borderBottom: '1px solid rgba(245,158,11,0.15)',
        padding: '1rem 2rem',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2rem' }}>{demo.icon}</span>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{demo.title}</h1>
        </div>
        <a
          href="/presentation"
          style={{
            color: '#f59e0b',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            padding: '0.5rem 1rem',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '6px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = 'rgba(245,158,11,0.1)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = 'transparent';
          }}
        >
          ← Back to presentation
        </a>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: '1200px', width: '100%' }}>
          {/* Description */}
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', lineHeight: 1.8 }}>
            {demo.description}
          </p>

          {/* Video */}
          <video
            src={demo.video}
            controls
            autoPlay
            style={{
              width: '100%',
              maxWidth: '1200px',
              borderRadius: '0.75rem',
              border: '1px solid rgba(245,158,11,0.2)',
              background: '#1e293b',
              aspectRatio: '16 / 9',
              objectFit: 'contain',
            }}
          />

          {/* Meta */}
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.75rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: 0 }}>
              <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Full telemetry active:</strong> PostHog event tracking • Sentry error monitoring • Langfuse LLM tracing. All metrics flow to the teacher dashboard in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: 'rgba(15,23,42,0.5)',
        borderTop: '1px solid rgba(245,158,11,0.15)',
        padding: '1rem 2rem',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '0.8rem',
      }}>
        <p style={{ margin: 0 }}>
          🌐 <a href="https://questlearn-nu.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: '#f59e0b', textDecoration: 'none' }}>questlearn-nu.vercel.app</a> •
          ⬡ <a href="https://github.com/nissan/questlearn" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>github.com/nissan/questlearn</a>
        </p>
      </div>
    </div>
  );
}
