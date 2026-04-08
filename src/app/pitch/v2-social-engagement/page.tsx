'use client';

import { useEffect, useRef, useState } from 'react';

const TOTAL_SLIDES = 13;
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
        <SlideStatsGraphics />
        <SlideAustraliaGraphDeepDive />
        <SlideAttentionShift />
        <SlideLearningPattern />
        <SlideSocraticEnhancement />
        <SlideMiniAppsDemo />
        <SlideTeacherLoop />
        <SlideAISides />
        <SlideCurricuLLMCallPath />
        <SlideCurricuLLMResponsePath />
        <SlideTodayAndNext />
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
          Australia-first evidence, interactive pedagogy, and teacher intelligence.
        </p>
      </div>
    </section>
  );
}

function SlideStatsGraphics() {
  const globalPlatforms = [
    { name: 'YouTube', value: 90, color: '#ef4444' },
    { name: 'TikTok', value: 63, color: '#22c55e' },
    { name: 'Snapchat', value: 60, color: '#f59e0b' },
    { name: 'Instagram', value: 59, color: '#a78bfa' },
  ];

  const tiktokGrowth = [12, 20, 28, 38];

  return (
    <section style={slideBase}>
      <div style={{ maxWidth: 1020, width: '100%' }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(1.7rem, 4.5vw, 3rem)' }}>Statistics snapshot (AU-first + global)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '1rem' }}>
          <div style={{ background: 'rgba(15,23,42,0.82)', border: '1px solid rgba(148,163,184,0.22)', borderRadius: '0.8rem', padding: '1rem' }}>
            <div style={{ color: amber, fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.85rem' }}>Global platform usage (bar graph)</div>
            {globalPlatforms.map((p) => (
              <div key={p.name} style={{ marginBottom: '0.45rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.18rem' }}>
                  <span>{p.name}</span>
                  <span>{p.value}%</span>
                </div>
                <div style={{ background: 'rgba(148,163,184,0.2)', borderRadius: '999px', height: '10px' }}>
                  <div style={{ width: `${p.value}%`, height: '10px', borderRadius: '999px', background: p.color }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(15,23,42,0.82)', border: '1px solid rgba(148,163,184,0.22)', borderRadius: '0.8rem', padding: '1rem' }}>
            <div style={{ color: amber, fontWeight: 700, marginBottom: '0.45rem', fontSize: '0.85rem' }}>Australia trend visual (curve)</div>
            <svg viewBox="0 0 240 120" style={{ width: '100%', height: '120px', marginBottom: '0.45rem' }}>
              <polyline points="20,95 85,80 150,60 215,35" fill="none" stroke="#f59e0b" strokeWidth="3" />
              {tiktokGrowth.map((v, i) => (
                <g key={i}>
                  <circle cx={20 + i * 65} cy={95 - i * 20} r="4" fill="#f59e0b" />
                  <text x={20 + i * 65} y={110} textAnchor="middle" fill="#94a3b8" fontSize="10">Y{i + 1}</text>
                  <text x={20 + i * 65} y={95 - i * 20 - 8} textAnchor="middle" fill="#e2e8f0" fontSize="10">{v}%</text>
                </g>
              ))}
            </svg>
            <div style={{ color: '#cbd5e1', fontSize: '0.84rem', lineHeight: 1.55 }}>
              AU context: eSafety national sample <strong>n=1,504</strong> (ages 8-15), plus teen study baseline.
            </div>
          </div>
        </div>

        <p style={{ marginTop: '0.8rem', color: 'rgba(148,163,184,0.9)', fontSize: '0.76rem', lineHeight: 1.5 }}>
          Sources: eSafety (AU 2024/2020), Pew (US teens 2023), OECD PISA 2022 analysis.
        </p>
      </div>
    </section>
  );
}

function SlideAustraliaGraphDeepDive() {
  const points = [
    { year: '2017', value: 12 },
    { year: '2018', value: 20 },
    { year: '2019', value: 28 },
    { year: '2020', value: 38 },
  ];

  return (
    <section style={slideBase}>
      <div style={{ maxWidth: 980, width: '100%' }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(1.7rem, 4.5vw, 3rem)' }}>Australia statistics, explained clearly</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '1rem' }}>
          <div style={{ background: 'rgba(15,23,42,0.84)', border: '1px solid rgba(148,163,184,0.22)', borderRadius: '0.8rem', padding: '1rem' }}>
            <div style={{ color: amber, fontWeight: 700, fontSize: '0.84rem', marginBottom: '0.4rem' }}>AU teen usage trend (TikTok share example)</div>
            <svg viewBox="0 0 320 170" style={{ width: '100%', height: '170px' }}>
              <line x1="30" y1="140" x2="300" y2="140" stroke="#334155" />
              <line x1="30" y1="20" x2="30" y2="140" stroke="#334155" />
              <polyline points="40,122 120,104 200,78 280,46" fill="none" stroke="#f59e0b" strokeWidth="4" />
              {points.map((p, i) => (
                <g key={p.year}>
                  <circle cx={40 + i * 80} cy={122 - i * 26} r="5" fill="#f59e0b" />
                  <text x={40 + i * 80} y={156} textAnchor="middle" fill="#94a3b8" fontSize="11">{p.year}</text>
                  <text x={40 + i * 80} y={122 - i * 26 - 10} textAnchor="middle" fill="#e2e8f0" fontSize="11">{p.value}%</text>
                </g>
              ))}
            </svg>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <Card title="What this graph means">
              The curve shows how fast youth platform behaviour changes, which is why static lesson formats lose attention quickly.
            </Card>
            <Card title="Why it matters for QuestLearn">
              We design learning in the same interaction style students already prefer, then route that attention into curriculum learning outcomes.
            </Card>
            <Card title="Evidence anchor">
              eSafety AU child sample n=1,504 (2024) + eSafety teen behavioural baseline (2020, n=627).
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function SlideAttentionShift() {
  return (
    <section style={slideBase}>
      <div style={{ maxWidth: 900 }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(1.7rem, 4.5vw, 3rem)' }}>What if content consumption became active learning?</h2>
        <p style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '1.06rem' }}>
          QuestLearn redirects passive scroll behavior into structured cognitive engagement, with the same emotional pull but better educational outcomes.
        </p>
      </div>
    </section>
  );
}

function SlideLearningPattern() {
  const steps = [
    { icon: '👀', title: 'Hook', desc: 'Meme/story hook captures attention fast.' },
    { icon: '🧠', title: 'Think', desc: 'Student responds, reasons, and reflects.' },
    { icon: '🔁', title: 'Practice', desc: 'Flashcards, maps, and debate reinforce memory.' },
    { icon: '📈', title: 'Improve', desc: 'Teacher sees patterns and adapts lesson plans.' },
  ];

  return (
    <section style={slideBase}>
      <div style={{ maxWidth: 1020, width: '100%' }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(1.7rem, 4.5vw, 3rem)' }}>Learning pattern flow</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.9rem' }}>
          {steps.map((s, i) => (
            <div key={s.title} style={{ background: 'rgba(15,23,42,0.84)', border: '1px solid rgba(148,163,184,0.22)', borderRadius: '0.8rem', padding: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.05rem' }}>{s.icon}</span>
                <strong style={{ color: amber, fontSize: '0.88rem' }}>Step {i + 1} · {s.title}</strong>
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.55 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SlideSocraticEnhancement() {
  return (
    <section style={slideBase}>
      <div style={{ maxWidth: 980, width: '100%' }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(1.7rem, 4.5vw, 3rem)' }}>How QuestLearn enhances Socratic learning</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Card title="Traditional limitation">One teacher, many students, limited time for deep individual questioning.</Card>
          <Card title="QuestLearn enhancement">AI creates Socratic follow-ups at scale, with context-aware questions and immediate feedback loops.</Card>
        </div>

        <div style={{ marginTop: '1rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '0.75rem', padding: '0.9rem 1rem' }}>
          <div style={{ color: '#c7d2fe', fontWeight: 700, marginBottom: '0.35rem', fontSize: '0.84rem' }}>Example Socratic sequence</div>
          <div style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.65 }}>
            Explain your answer → Why do you think that? → Can you defend it with evidence? → What changes if this assumption is wrong?
          </div>
        </div>
      </div>
    </section>
  );
}

function SlideMiniAppsDemo() {
  const miniApps = [
    {
      icon: '🃏',
      name: 'Flashcard App',
      color: '#f59e0b',
      prompt: 'Build an interactive flashcard app. Students flip cards, rate confidence, and type explanations for AI feedback.',
    },
    {
      icon: '🗺️',
      name: 'Concept Map',
      color: '#10b981',
      prompt: 'Build a concept map app where students add nodes, draw connections, and receive AI feedback + missing-link suggestions.',
    },
    {
      icon: '🎤',
      name: 'Debate Challenge',
      color: '#ec4899',
      prompt: 'Build a 3-round debate app where AI counters student arguments and gives an improvement verdict.',
    },
  ];

  return (
    <section style={slideBase}>
      <div style={{ maxWidth: '960px', width: '100%' }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(1.7rem, 4.5vw, 3rem)' }}>Mini Apps demos</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {miniApps.map((app) => (
            <div
              key={app.name}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderLeft: `4px solid ${app.color}`,
                borderRadius: '0.75rem',
                padding: '0.95rem 1.15rem',
                display: 'grid',
                gridTemplateColumns: '2.2rem 1fr',
                gap: '0 0.9rem',
              }}
            >
              <span style={{ fontSize: '1.45rem', lineHeight: 1 }}>{app.icon}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: app.color, fontWeight: 700, fontSize: '0.92rem' }}>{app.name}</span>
                  <span style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)', fontSize: '0.64rem', padding: '0.12rem 0.45rem', borderRadius: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Cogniti prompt</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.81rem', lineHeight: 1.6, margin: 0, fontFamily: 'ui-monospace, monospace' }}>
                  &ldquo;{app.prompt}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SlideTeacherLoop() {
  const topics = ['Photosynthesis', 'Fractions', 'WW1 Causes'];
  const formats = ['Meme', 'Story', 'Puzzle'];
  const heat = [
    [0.82, 0.56, 0.41],
    [0.48, 0.77, 0.63],
    [0.39, 0.58, 0.85],
  ];

  const heatColor = (v: number) => {
    if (v > 0.75) return '#22c55e';
    if (v > 0.55) return '#f59e0b';
    if (v > 0.4) return '#f97316';
    return '#ef4444';
  };

  return (
    <section style={slideBase}>
      <div style={{ maxWidth: 1000, width: '100%' }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(1.7rem, 4.5vw, 3rem)' }}>Teacher dashboard</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: '0.8rem' }}>
            <Card title="Live visibility">See where students are engaged or stuck.</Card>
            <Card title="Lesson planning">Use real learning signals for the next lesson.</Card>
            <Card title="Quick quiz setup">Generate targeted checks based on class gaps.</Card>
          </div>

          <div style={{ background: 'rgba(15,23,42,0.82)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '0.9rem', padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: '0.55rem', padding: '0.45rem' }}>
                <div style={{ fontSize: '0.64rem', color: 'rgba(203,213,225,0.7)' }}>Engagement</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#22c55e' }}>78%</div>
              </div>
              <div style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: '0.55rem', padding: '0.45rem' }}>
                <div style={{ fontSize: '0.64rem', color: 'rgba(203,213,225,0.7)' }}>At-risk topics</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b' }}>2</div>
              </div>
              <div style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.35)', borderRadius: '0.55rem', padding: '0.45rem' }}>
                <div style={{ fontSize: '0.64rem', color: 'rgba(203,213,225,0.7)' }}>Quizzes ready</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#a5b4fc' }}>3</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '90px repeat(3, 1fr)', gap: '4px', marginBottom: '4px' }}>
              <div />
              {formats.map((f, i) => (
                <div key={i} style={{ fontSize: '0.64rem', color: '#64748b', textAlign: 'center', fontWeight: 600 }}>{f}</div>
              ))}
            </div>
            {topics.map((topic, row) => (
              <div key={row} style={{ display: 'grid', gridTemplateColumns: '90px repeat(3, 1fr)', gap: '4px', marginBottom: '4px' }}>
                <div style={{ fontSize: '0.64rem', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>{topic}</div>
                {heat[row].map((v, col) => (
                  <div key={col} style={{ height: '24px', borderRadius: '4px', backgroundColor: heatColor(v), opacity: 0.82, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.58rem', color: 'rgba(0,0,0,0.62)', fontWeight: 700 }}>
                    {Math.round(v * 100)}%
                  </div>
                ))}
              </div>
            ))}
            <div style={{ marginTop: '0.5rem', fontSize: '0.66rem', color: '#64748b' }}>Class-level aggregate only</div>
          </div>
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
          For students: adaptive prompts, feedback, and scaffolding. For teachers: pattern detection, intervention signals, and lesson-planning acceleration.
        </p>
      </div>
    </section>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre
      style={{
        margin: 0,
        background: 'rgba(2,6,23,0.86)',
        border: '1px solid rgba(148,163,184,0.28)',
        borderRadius: '0.7rem',
        padding: '0.9rem',
        overflowX: 'auto',
        color: '#e2e8f0',
        fontSize: '0.76rem',
        lineHeight: 1.55,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      }}
    >
      <code>{children}</code>
    </pre>
  );
}

function SlideCurricuLLMCallPath() {
  const code = `// src/lib/curricullm-client.ts\ncompletion = await curricullm.chat.completions.create({\n  model,\n  messages: [\n    { role: 'system', content: getSystemPrompt(format, yearLevel) },\n    { role: 'user', content: userPrompt },\n  ],\n  temperature: 0.8,\n  max_tokens: 800,\n});\n\n// src/app/api/learn/generate/route.ts\ncontent = await withLangfuseTrace({\n  name: 'content-generation',\n  fn: async () => generateContent(topic, format, yearLevel ?? 'Year 9'),\n});`;

  return (
    <section style={slideBase}>
      <div style={{ maxWidth: 1040, width: '100%' }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}>How we call CurricuLLM in the app</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '1rem' }}>
          <CodeBlock>{code}</CodeBlock>
          <div style={{ display: 'grid', gap: '0.8rem' }}>
            <Card title="Runtime path">
              UI → <code>/api/learn/generate</code> → <code>generateContent()</code> → CurricuLLM chat completion.
            </Card>
            <Card title="Prompt strategy">
              We send a format-specific system prompt (story/game/meme/puzzle/short-film) and a strict JSON-return user prompt.
            </Card>
            <Card title="Traceability">
              Calls are wrapped in Langfuse tracing for latency and quality debugging during demo and classroom pilots.
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function SlideCurricuLLMResponsePath() {
  const code = `// src/lib/curricullm-client.ts\nconst raw = completion.choices[0]?.message?.content ?? '';\nconst cleaned = raw.replace(/^\`\`\`json?\\n?/i, '').replace(/\\n?\`\`\`$/i, '').trim();\nconst parsed = JSON.parse(cleaned);\nreturn { ...parsed, _stub: false };\n\n// src/app/api/learn/generate/route.ts\nawait db.execute({\n  sql: \`INSERT INTO content_cache (...) VALUES (?, ?, ?, ?, ?, ?, ?, ?)\`,\n  args: [uuidv4(), topicKey, format, variantCount + 1, content.title, content.body, content.socraticPrompt, content.curriculumRef],\n});\n\nreturn NextResponse.json({ ...content, _cached: cached });`;

  return (
    <section style={slideBase}>
      <div style={{ maxWidth: 1040, width: '100%' }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}>How we process and return CurricuLLM data</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '1rem' }}>
          <CodeBlock>{code}</CodeBlock>
          <div style={{ display: 'grid', gap: '0.8rem' }}>
            <Card title="Response parsing">
              We normalize raw model output, remove markdown fences if present, parse JSON, and fail-safe to stubs on parsing errors.
            </Card>
            <Card title="Data contract">
              Required fields carried through end-to-end: <code>title</code>, <code>body</code>, <code>socraticPrompt</code>, <code>curriculumRef</code>.
            </Card>
            <Card title="Delivery to UI">
              Parsed content is cached, then returned as API JSON so LearnContent can render immediately and start the Socratic loop.
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function SlideTodayAndNext() {
  const roadmap = [
    {
      phase: 'v1 — Live now',
      color: '#22c55e',
      items: [
        'QuestLearn student journey + teacher dashboard live',
        '5 AI-powered learning formats are working now',
      ],
    },
    {
      phase: 'v2 — Coming soon',
      color: '#f59e0b',
      items: [
        'Study Rooms + Quiz Rooms for collaboration',
        'Open Threads + Syllabus Browser (AC v9)',
      ],
    },
    {
      phase: 'v3 — Future scope',
      color: '#818cf8',
      items: [
        'Cross-school learning nationally',
        'Regional equity insights and intervention support',
      ],
    },
  ];

  return (
    <section style={slideBase}>
      <div style={{ maxWidth: 1020, width: '100%' }}>
        <h2 style={{ marginTop: 0, fontSize: 'clamp(1.7rem, 4.5vw, 3rem)' }}>What QuestLearn does today, and what comes next</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.9rem', marginBottom: '0.9rem' }}>
          {roadmap.map((r) => (
            <div key={r.phase} style={{ background: 'rgba(15,23,42,0.84)', border: `1px solid ${r.color}55`, borderTop: `3px solid ${r.color}`, borderRadius: '0.8rem', padding: '0.95rem 1rem' }}>
              <div style={{ color: r.color, fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.55rem' }}>{r.phase}</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.45rem' }}>
                {r.items.map((item) => (
                  <li key={item} style={{ color: '#cbd5e1', fontSize: '0.87rem', display: 'flex', gap: '0.4rem' }}>
                    <span style={{ color: r.color }}>›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
