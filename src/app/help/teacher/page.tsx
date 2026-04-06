import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Teacher Guide — QuestLearn',
  robots: { index: false, follow: false },
}

export default function TeacherHelpPage() {
  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '2rem 1.5rem' }}>

        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#60a5fa', marginBottom: '0.5rem' }}>
          QuestLearn: Teacher Guide
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginBottom: '2.5rem' }}>
          Pedagogy, classroom practice, and what the data shows you
        </p>

        <hr style={{ borderColor: 'rgba(96,165,250,0.2)', marginBottom: '2.5rem' }} />

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#60a5fa', marginBottom: '1rem' }}>Why QuestLearn?</h2>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)' }}>
            Most classroom study — re-reading notes, watching videos, highlighting — feels productive but isn&apos;t. Students consume content passively, and teachers have no real-time window into whether any of it is landing. QuestLearn addresses both problems: it puts students in active dialogue with their learning, and it gives you a live view of class-wide engagement — without turning every student into a data point.
          </p>
        </section>

        <hr style={{ borderColor: 'rgba(255,255,255,0.06)', marginBottom: '3rem' }} />

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#60a5fa', marginBottom: '1.25rem' }}>The Pedagogy</h2>
          {[
            { term: 'Active Recall', def: "The evidence-backed practice of retrieving information from memory rather than reviewing it. QuestLearn's quiz and flashcard formats are built around this — every prompt asks students to generate an answer, not recognise one. The effort of retrieval is what consolidates memory." },
            { term: 'Desirable Difficulty', def: "The counterintuitive finding that struggling a little produces better long-term retention than smooth, easy study. QuestLearn doesn't simplify content to make it comfortable — it calibrates challenge so students are always working at the edge of what they know." },
            { term: 'Metacognition', def: "Thinking about your own thinking — embedded throughout. When students choose their format and engage with Socratic prompts, they're making decisions about how they learn. That self-awareness is a transferable academic skill, not just a side effect." },
            { term: "Bloom's Taxonomy", def: "Provides the progression: from understanding a concept, to applying it, analysing it, and ultimately creating something with it. QuestLearn's formats map to different levels — stories and flashcards build foundational understanding; debate and meme formats push toward analysis and synthesis." },
            { term: "Laurillard's Conversational Framework", def: "Positions learning as a dialogue between teacher and learner — not a broadcast. QuestLearn's Socratic tutor operationalises this: the AI responds to what each student says, adapts its questions, and keeps the conversation moving. It acts as a dialogue partner, not an answer machine." },
          ].map(({ term, def }) => (
            <div key={term} style={{ background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.12)', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '0.75rem' }}>
              <span style={{ color: '#60a5fa', fontWeight: 600, fontSize: '0.9375rem' }}>{term}</span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem' }}> — {def}</span>
            </div>
          ))}
        </section>

        <hr style={{ borderColor: 'rgba(255,255,255,0.06)', marginBottom: '3rem' }} />

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#60a5fa', marginBottom: '1rem' }}>What Students See</h2>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)', marginBottom: '1rem' }}>
            Students pick a topic, then choose a learning format. QuestLearn currently offers eight formats:
          </p>
          {[
            { label: 'Meme', text: 'Compress the concept into something memorable and funny — forces real understanding.' },
            { label: 'Game', text: 'Topic becomes a playable scenario with decisions and consequences.' },
            { label: 'Story', text: 'Narrative framing makes cause-and-effect visible and sticky.' },
            { label: 'Puzzle', text: 'Students reconstruct the concept by solving it piece by piece.' },
            { label: 'Short Film', text: 'Cinematic micro-scene brings abstract ideas to life visually.' },
            { label: 'Flashcards', text: 'AI-powered cards with confidence tracking and accuracy data. After 3 attempts, the answer is revealed.' },
            { label: 'Concept Map', text: 'Students build a visual web of connected ideas with AI feedback.' },
            { label: 'Debate', text: 'Students argue a position against an AI opponent, building analytical depth.' },
          ].map(({ label, text }) => (
            <div key={label} style={{ background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.12)', borderRadius: '10px', padding: '0.875rem 1.25rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#60a5fa', fontWeight: 600, fontSize: '0.9375rem' }}>{label}</span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem' }}> — {text}</span>
            </div>
          ))}
          <img src="/format-selector.png" alt="Student format selector screen" style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', margin: '1.5rem 0 1rem' }} />
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)', marginBottom: '1rem' }}>
            Once content loads, the Socratic tutor engages them in a back-and-forth. The AI asks questions, students answer, and the AI responds — encouraging them to go further, reconsider, or connect ideas.
          </p>
          <img src="/socratic-after-response.png" alt="Socratic tutor response after student input" style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1rem' }} />
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)' }}>
            Wrong answers don&apos;t trigger penalties. Students are encouraged to think again. There are no leaderboards, no competitive mechanics — only personal progress.
          </p>
        </section>

        <hr style={{ borderColor: 'rgba(255,255,255,0.06)', marginBottom: '3rem' }} />

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#60a5fa', marginBottom: '1rem' }}>Your Dashboard</h2>

          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: '0.5rem' }}>📌 Today&apos;s Quest</h3>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)', marginBottom: '1.25rem' }}>
            Pin a topic and format for your class. Students see your quest when they open QuestLearn, giving the session direction without removing their choice. You can include a message and target a specific year level. Clear it when the session is done.
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: '0.5rem' }}>🟡 Live Activity</h3>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)', marginBottom: '1.25rem' }}>
            A real-time feed of what students are doing right now — topics chosen, formats selected, sessions started. Not individual answers. Just the pulse of the room.
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: '0.5rem' }}>🟥 Engagement Heatmap</h3>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)', marginBottom: '1rem' }}>
            A matrix of topics × formats × depth. At a glance you can see which combinations are lighting up the class, where energy is clustering, and which areas haven&apos;t been touched.
          </p>
          <img src="/teacher-heatmap.png" alt="Teacher heatmap dashboard" style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: '10px', padding: '1rem' }}>
              <p style={{ color: '#34d399', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>✓ What it shows</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>Topic distribution, format choices, session frequency, and engagement patterns across the class.</p>
            </div>
            <div style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '10px', padding: '1rem' }}>
              <p style={{ color: '#f87171', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>✗ What it doesn&apos;t show</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>Individual student answers, typed responses, or personal performance data.</p>
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: '0.5rem' }}>🧠 AI Insights (Cogniti Flashcard Analytics)</h3>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)' }}>
            When students use the Flashcards format, they rate their confidence after each card and answer questions the AI generates. The AI Insights panel shows you, by topic: which topics are getting the most card flips, average confidence ratings (colour-coded red/yellow/green), and answer accuracy percentages. A topic flagged with ⚠️ is below 50% accuracy — a signal that the class may need revisiting.
          </p>
        </section>

        <hr style={{ borderColor: 'rgba(255,255,255,0.06)', marginBottom: '3rem' }} />

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#60a5fa', marginBottom: '1rem' }}>Classroom Conversation Starters</h2>
          {[
            "Ask students what format they chose and why — that's metacognition in action, and it takes about two minutes.",
            'If the heatmap shows a topic cluster you didn\'t assign, use it as an entry point: "I noticed a few of you went deep on [X] — what did you find?"',
            "After a QuestLearn session, ask students to share the hardest question the AI asked them. That surfaces the edge of their understanding better than a quiz would.",
            "Use format choice as a discussion prompt — why did some students pick debate over flashcard? What does that tell you about how they think they learn best?",
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.875rem', marginBottom: '0.875rem', alignItems: 'flex-start' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '1.75rem', height: '1.75rem', borderRadius: '50%', background: 'rgba(96,165,250,0.12)', color: '#60a5fa', fontWeight: 700, fontSize: '0.8125rem', flexShrink: 0, marginTop: '0.125rem' }}>{i + 1}</span>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{tip}</p>
            </div>
          ))}
        </section>

        <hr style={{ borderColor: 'rgba(255,255,255,0.06)', marginBottom: '3rem' }} />

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#60a5fa', marginBottom: '1rem' }}>Setting Expectations</h2>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)', marginBottom: '1rem' }}>
            When you introduce QuestLearn, it helps to be direct about what the Socratic tutor is and isn&apos;t. Tell students: the AI will ask you questions you might not know the answer to — that&apos;s the point. It&apos;s not testing you; it&apos;s helping you think. There&apos;s no wrong answer that locks you out or costs you marks.
          </p>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.85)' }}>
            Students who expect a passive experience may find the Socratic loop uncomfortable at first. Frame that discomfort as a feature, not a bug — it&apos;s where the learning actually happens.
          </p>
        </section>

        <hr style={{ borderColor: 'rgba(96,165,250,0.2)', marginBottom: '2.5rem' }} />

        <div style={{ background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '12px', padding: '1.5rem', marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.8)', margin: 0, fontStyle: 'italic' }}>
            QuestLearn gives you a window into your class&apos;s thinking — without putting students under a spotlight.
          </p>
        </div>

      </div>
    </div>
  )
}
