'use client';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { StubBadge } from '@/components/StubBadge';
import { FORMATS } from '@/lib/formats';
import { QuestBanner } from '@/components/learn/QuestBanner';
import { Flashcards } from '@/components/interactive/Flashcards';
import { ConceptMap } from '@/components/interactive/ConceptMap';
import { Debate } from '@/components/interactive/Debate';
import { MemeCard } from '@/components/learn/MemeCard';
import { pickMemeTemplate } from '@/lib/pick-meme-template';
import { MEME_TEMPLATES } from '@/lib/meme-templates';
import type { MemeTemplate } from '@/lib/meme-templates';

// Cogniti AI tutor URL — key loaded server-side; this is just the public embed URL
const COGNITI_URL = process.env.NEXT_PUBLIC_COGNITI_AGENT_URL ?? 'https://app.cogniti.ai/agents/69d053d9324adcb67e01f97d/chat';

type TutorMode = 'curricullm' | 'cogniti' | 'both';

interface ContentData {
  title: string;
  body: string;
  socraticPrompt: string;
  curriculumRef: string;
  _stub: boolean;
}

interface ChatMessage {
  role: 'ai' | 'student';
  text: string;
}

export function LearnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTopic = searchParams.get('topic') ?? '';
  const initialFormat = searchParams.get('format') ?? 'story';
  const [topic] = useState(initialTopic);
  const [format, setFormat] = useState(initialFormat);
  const [yearLevel, setYearLevel] = useState('Year 9');
  const [content, setContent] = useState<ContentData | null>(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [learningSessionId, setLearningSessionId] = useState<string | null>(null);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [studentInput, setStudentInput] = useState('');
  const [sendingResponse, setSendingResponse] = useState(false);
  const [tutorMode, setTutorMode] = useState<TutorMode>('curricullm');
  const [memeTemplate, setMemeTemplate] = useState<MemeTemplate | null>(null);
  const [memeTopText, setMemeTopText] = useState('');
  const [memeBottomText, setMemeBottomText] = useState('');
  const [memeImageUrl, setMemeImageUrl] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lumina_user');
      if (stored) {
        const parsed = JSON.parse(stored) as { year_level?: string };
        if (parsed.year_level) setYearLevel(parsed.year_level);
      }
    } catch { /* ignore */ }
  }, []);

  function parseMemeBody(body: string): { topText: string; bottomText: string } {
    const topMatch = body.match(/^TOP:\s*(.+)/im);
    const bottomMatch = body.match(/^BOTTOM:\s*(.+)/im);
    return {
      topText: topMatch?.[1]?.trim() ?? 'Did you know...',
      bottomText: bottomMatch?.[1]?.trim() ?? '...it was actually this simple.',
    };
  }


  useEffect(() => {
    if (!topic) { router.push('/onboarding'); return; }
    async function load() {
      setLoadingContent(true);
      setChat([]);
      setMemeTemplate(null);
      setMemeTopText('');
      setMemeBottomText('');
      setMemeImageUrl(null);
      const sessionRes = await fetch('/api/learn/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, format }),
      });
      const sessionData = await sessionRes.json();
      setLearningSessionId(sessionData.id);
      const contentRes = await fetch('/api/learn/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, format }),
      });
      const contentData = await contentRes.json();
      setContent(contentData);
      setChat([{ role: 'ai', text: contentData.socraticPrompt }]);
      setLoadingContent(false);
      if (format === 'meme' && contentData?.body) {
        // Attempt two-LLM meme: GPT-4o-mini picks template + writes humour
        try {
          const memeRes = await fetch('/api/generate/meme-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic, curriculumFact: contentData.body }),
          });
          const memeData = await memeRes.json();
          if (memeData.topText && memeData.bottomText) {
            const pickedTemplate = memeData.templateId
              ? (MEME_TEMPLATES.find((t) => t.id === memeData.templateId) ?? null)
              : null;
            setMemeTopText(memeData.topText);
            setMemeBottomText(memeData.bottomText);
            setMemeTemplate(pickedTemplate);
            if (memeData.imageUrl) setMemeImageUrl(memeData.imageUrl);
            return;
          }
        } catch {
          // Fall through to keyword-match fallback
        }
        // Fallback: keyword match + parse body
        const { topText, bottomText } = parseMemeBody(contentData.body);
        setMemeTopText(topText);
        setMemeBottomText(bottomText);
        setMemeTemplate(pickMemeTemplate(topic, topText, bottomText));
      }
    }
    load();
  }, [topic, format, router]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  async function handleSend() {
    if (!studentInput.trim() || !learningSessionId) return;
    const msg = studentInput.trim();
    setStudentInput('');
    setSendingResponse(true);
    setChat(c => [...c, { role: 'student', text: msg }]);
    const res = await fetch('/api/learn/socratic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        learningSessionId,
        studentResponse: msg,
        turnIndex: chat.filter(m => m.role === 'student').length,
        topic,
        format,
        yearLevel,
        history: chat.map(m => ({ role: m.role, text: m.text })),
      }),
    });
    const data = await res.json();
    setChat(c => [...c, { role: 'ai', text: data.followUp }]);
    setSendingResponse(false);
  }

  const currentFormat = FORMATS.find(f => f.id === format);

  /** Shared inner content for the CurricuLLM (Socratic chat) pane */
  const curricuLLMInner = (
    <>
      <div className="px-4 py-3 border-b">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Socratic Dialogue</p>
        <p className="text-xs text-muted-foreground">Think it through — the AI won&apos;t give you the answer 😉</p>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {chat.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'ai' ? 'bg-muted text-foreground rounded-tl-sm' : 'bg-primary text-primary-foreground rounded-tr-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {sendingResponse && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5">
                <span className="text-muted-foreground text-sm">thinking…</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-4 space-y-2">
        <Textarea
          placeholder="What do you think? Type your answer…"
          value={studentInput}
          onChange={e => setStudentInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          rows={3}
          className="resize-none text-sm"
        />
        <Button className="w-full" onClick={handleSend} disabled={!studentInput.trim() || sendingResponse || loadingContent}>
          {sendingResponse ? 'Thinking…' : 'Send response →'}
        </Button>
      </div>
    </>
  );

  /** Shared inner content for the Cogniti AI Tutor pane */
  const cognitiInner = (
    <>
      <div className="px-4 py-3 border-b">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cogniti AI Tutor</p>
        <p className="text-xs text-muted-foreground">Ask Cogniti anything about this topic</p>
      </div>
      <div className="flex-1 relative">
        <iframe
          src={COGNITI_URL}
          className="absolute inset-0 w-full h-full border-0"
          allow="microphone; camera"
          title="Cogniti AI Tutor"
        />
      </div>
    </>
  );

  return (
    <main className="min-h-screen bg-background">
      <QuestBanner />
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentFormat?.icon}</span>
          <div>
            <h1 className="font-bold text-sm leading-none">{topic}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Year 9 · {currentFormat?.label}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push('/onboarding')}>New quest</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2" style={{height: 'calc(100vh - var(--banner-offset, 57px))'}}>
        {/* Left: content card */}
        <div className="border-r overflow-auto">
          <div className="p-4 pb-2 space-y-3">
            {/* Primary formats - always visible, no scroll */}
            <div className="flex gap-2 flex-wrap">
              {FORMATS.filter(f => f.tier === 'primary').map(f => (
                <button key={f.id} onClick={() => setFormat(f.id)}
                  className={`text-sm px-4 py-2 rounded-full border font-medium transition-all ${format === f.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/50 text-foreground'}`}>
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
            {/* Secondary formats - smaller, with "Coming Soon" note */}
            <div className="border-t pt-2">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Coming Soon</p>
              <div className="flex gap-1.5 flex-wrap">
                {FORMATS.filter(f => f.tier === 'secondary').map(f => (
                  <button key={f.id} disabled
                    className="text-xs px-2 py-1 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground opacity-50 cursor-not-allowed">
                    {f.icon} {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {format === 'meme' && !loadingContent && content ? (
            <div className="px-4 pb-4 space-y-3">
              <MemeCard
                topText={memeTopText}
                bottomText={memeBottomText}
                template={memeTemplate}
                topic={topic}
                imageUrl={memeImageUrl ?? undefined}
              />
              {content.body.match(/^CAPTION:\s*(.+)/im)?.[1] && (
                <p className="text-xs text-muted-foreground text-center">
                  {content.body.match(/^CAPTION:\s*(.+)/im)?.[1]}
                </p>
              )}
            </div>
          ) : format === 'flashcards' ? (
            <div className="px-4 pb-4"><Card className="border-2 border-dashed border-amber-500/40 bg-amber-500/5">
              <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center gap-3">
                <span className="text-4xl">🃏</span>
                <p className="text-sm font-medium">Flashcard Mode</p>
                <p className="text-xs text-muted-foreground">Flashcards loaded in the panel →</p>
              </CardContent>
            </Card></div>
          ) : format === 'concept_map' ? (
            <div className="px-4 pb-4"><Card className="border-2 border-dashed border-emerald-500/40 bg-emerald-500/5">
              <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center gap-3">
                <span className="text-4xl">🗺️</span>
                <p className="text-sm font-medium">Concept Map Mode</p>
                <p className="text-xs text-muted-foreground">Build your concept map in the panel →</p>
              </CardContent>
            </Card></div>
          ) : format === 'debate' ? (
            <div className="px-4 pb-4"><Card className="border-2 border-dashed border-purple-500/40 bg-purple-500/5">
              <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center gap-3">
                <span className="text-4xl">⚖️</span>
                <p className="text-sm font-medium">Debate Mode</p>
                <p className="text-xs text-muted-foreground">Your debate is loaded in the panel →</p>
              </CardContent>
            </Card></div>
          ) : format === 'meme' && loadingContent ? (
            <div className="px-4 pb-4">
              <MemeCard
                topText=""
                bottomText=""
                template={null}
                topic={topic}
                isLoading={true}
              />
            </div>
          ) : loadingContent ? (
            <div className="px-4 pb-4"><Card><CardContent className="pt-6 space-y-3">
              <Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" />
            </CardContent></Card></div>
          ) : content ? (
            <div className="px-4 pb-4"><Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{content.title}</CardTitle>
                  <div className="flex flex-col gap-1 items-end shrink-0">
                    {content._stub && <StubBadge />}
                    <Badge variant="secondary" className="text-xs">{content.curriculumRef}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-line">{content.body}</p>
              </CardContent>
            </Card></div>
          ) : null}
        </div>

        {/* Right: tutor panel */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Flashcards format: full-panel native app */}
          {format === 'flashcards' && (
            <div className="flex flex-col flex-1 min-h-0">
              <Flashcards topic={topic} />
            </div>
          )}

          {/* Concept Map format: full-panel native app */}
          {format === 'concept_map' && (
            <div className="flex flex-col flex-1 min-h-0">
              <ConceptMap topic={topic} />
            </div>
          )}

          {/* Debate format: full-panel native app */}
          {format === 'debate' && (
            <div className="flex flex-col flex-1 min-h-0">
              <Debate topic={topic} />
            </div>
          )}

          {/* Standard tutor modes — hidden when flashcards, concept_map, or debate active */}
          {format !== 'flashcards' && format !== 'concept_map' && format !== 'debate' && (
            <>
              {/* Tutor toggle — Cogniti hidden until embed auth is resolved */}
              <div className="px-4 py-2 border-b flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground mr-1">Tutor:</span>
                <button
                  onClick={() => setTutorMode('curricullm')}
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${tutorMode === 'curricullm' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/50 text-muted-foreground'}`}
                >
                  CurricuLLM
                </button>
              </div>

              {/* CurricuLLM only */}
              {tutorMode === 'curricullm' && (
                <div className="flex flex-col flex-1 min-h-0">
                  {curricuLLMInner}
                </div>
              )}

              {/* Cogniti only */}
              {tutorMode === 'cogniti' && (
                <div className="flex flex-col flex-1 min-h-0">
                  {cognitiInner}
                </div>
              )}

              {/* Both: split 50/50 */}
              {tutorMode === 'both' && (
                <div className="grid grid-cols-2 flex-1 min-h-0 divide-x overflow-hidden">
                  <div className="flex flex-col overflow-hidden">
                    {curricuLLMInner}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    {cognitiInner}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
