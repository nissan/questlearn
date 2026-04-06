import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Student Guide — QuestLearn',
  robots: { index: false, follow: false },
}

export default function StudentHelpPage() {
  return (
    <div
      style={{
        background: '#0f172a',
        minHeight: '100vh',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '2rem 1.5rem' }}>

        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.5rem' }}>
          How to Use QuestLearn
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginBottom: '2.5rem' }}>
          Your guide to active, effective studying
        </p>

        <hr style={{ borderColor: 'rgba(245,158,11,0.15)', marginBottom: '2.5rem' }} />

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f59e0b', marginBottom: '1rem' }}>
            How QuestLearn Works
          </h2>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)', marginBottom: '1rem' }}>
            QuestLearn turns any topic you&apos;re studying into an interactive experience — your way. Instead of reading and hoping it sticks, you actively engage with the material: answering questions, building arguments, and thinking things through with an AI that&apos;s in your corner. The more you put in, the more you get out.
          </p>
          <img src="/home.png" alt="QuestLearn home screen inside Lumina OS" style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginTop: '1rem' }} />
        </section>

        <hr style={{ borderColor: 'rgba(255,255,255,0.06)', marginBottom: '3rem' }} />

        {[
          {
            n: 1, title: 'Sign In',
            body: "Head to QuestLearn inside Lumina OS and sign in with your school account.",
            imgs: [{ src: '/auth-page.png', alt: 'Sign-in screen' }],
          },
          {
            n: 2, title: 'Pick Your Topic',
            body: "Once you're in, you'll see a clean search bar — just type whatever you're studying. It could be \"the French Revolution,\" \"photosynthesis,\" \"Pythagoras,\" or anything your class is working on. This part matters more than it sounds. When you choose the topic — and even how you want to explore it — you take ownership of your learning. That ownership is what makes it stick.",
            imgs: [{ src: '/learn-empty.png', alt: 'Empty topic search screen' }, { src: '/learn-topic-entered.png', alt: 'Topic entered' }],
          },
        ].map(({ n, title, body, imgs }) => (
          <section key={n} style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>{n}</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f59e0b', margin: 0 }}>{title}</h2>
            </div>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)', marginBottom: '1rem' }}>{body}</p>
            {imgs.map(img => <img key={img.src} src={img.src} alt={img.alt} style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1rem' }} />)}
            <hr style={{ borderColor: 'rgba(255,255,255,0.06)', marginTop: '2rem' }} />
          </section>
        ))}

        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>3</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f59e0b', margin: 0 }}>Choose Your Format</h2>
          </div>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)', marginBottom: '1rem' }}>
            Once you&apos;ve entered your topic, you&apos;ll pick how you want to explore it. Each format works differently — and they all work <em>well</em>.
          </p>
          <img src="/format-selector.png" alt="Format selector screen" style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }} />
          {[
            { label: 'Meme', text: "Sounds like a joke, but it isn't. Compressing a concept into a meme forces you to understand it well enough to explain it in a few words. If you can make it funny, you really get it." },
            { label: 'Game', text: "Your topic becomes a playable scenario. Learning through decisions and consequences is surprisingly sticky — especially when the stakes are fictional but the ideas are real." },
            { label: 'Story', text: "Your topic becomes a narrative. When information is embedded in a story with context, characters, and consequences, your brain files it differently — and finds it more easily later. Good for topics with cause and effect." },
            { label: 'Puzzle', text: "You solve your way to understanding. Reconstructing the pieces of a concept forces active engagement in a way that passively reading about it never does." },
            { label: 'Short Film', text: "Your topic becomes a cinematic micro-scene. Visual storytelling helps you see ideas in action — great for historical events, scientific processes, or anything with drama." },
            { label: 'Flashcards', text: "AI-powered cards test your recall and adapt to how you're going. After 3 attempts, you see the answer — so you always move forward, and the AI tracks your confidence and accuracy over time." },
            { label: 'Concept Map', text: "You build a visual web of connected ideas. Seeing how concepts link to each other is one of the best ways to check whether you actually understand a topic — or just recognise it." },
            { label: 'Debate', text: "You're asked to argue a position, then defend it against the AI. Having to construct an argument deepens your understanding of a topic in ways that passively reading about it simply doesn't." },
          ].map(({ label, text }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '0.75rem' }}>
              <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.9375rem' }}>{label}</span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem' }}> — {text}</span>
            </div>
          ))}
        </section>

        <hr style={{ borderColor: 'rgba(255,255,255,0.06)', marginBottom: '3rem' }} />

        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>4</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f59e0b', margin: 0 }}>Work Through It</h2>
          </div>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)', marginBottom: '1rem' }}>
            After your content loads, your AI tutor joins the session. It doesn&apos;t just give you answers — it asks you questions, responds to what you say, and nudges you toward thinking more deeply.
          </p>
          <img src="/socratic-chat.png" alt="Socratic tutor chat window" style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1rem' }} />
          <img src="/socratic-after-response.png" alt="AI response after student answers" style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1rem' }} />
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)' }}>
            This is called the Socratic method — and it&apos;s been around for a reason. The AI isn&apos;t judging you. It&apos;s helping you think. If your answer&apos;s off, it encourages you to look at it from another angle. No scores, no shame — just thinking.
          </p>
        </section>

        <hr style={{ borderColor: 'rgba(255,255,255,0.06)', marginBottom: '3rem' }} />

        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>5</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f59e0b', margin: 0 }}>Your Progress</h2>
          </div>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)', marginBottom: '1rem' }}>
            QuestLearn tracks your <strong style={{ color: '#f59e0b' }}>confidence</strong> — not grades. After Flashcard sessions, you rate how well you felt you knew each card, and the AI keeps a running picture of where you&apos;re strong and where you need more practice. No points, no leaderboards. Just honest signal about where you actually are.
          </p>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)' }}>
            As you work through sessions, your teacher gets a picture of how the class is engaging overall — which topics are being explored, how often, and with what energy. They won&apos;t see your individual answers or what you typed. It&apos;s about patterns, not surveillance.
          </p>
        </section>

        <hr style={{ borderColor: 'rgba(245,158,11,0.15)', marginBottom: '2.5rem' }} />

        <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', padding: '1.5rem', marginBottom: '3rem' }}>
          <h3 style={{ color: '#f59e0b', fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem' }}>Keep Going</h3>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            Learning sticks when you work for it. QuestLearn is built around that idea — not to make studying easier, but to make it more effective. The effort you put in here is the whole point.
          </p>
        </div>

      </div>
    </div>
  )
}
