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
  const [content, setContent] = useState<ContentData | null>(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [learningSessionId, setLearningSessionId] = useState<string | null>(null);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [studentInput, setStudentInput] = useState('');
  const [sendingResponse, setSendingResponse] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!topic) { router.push('/onboarding'); return; }
    async function load() {
      setLoadingContent(true);
      setChat([]);
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
      }),
    });
    const data = await res.json();
    setChat(c => [...c, { role: 'ai', text: data.followUp }]);
    setSendingResponse(false);
  }

  const currentFormat = FORMATS.find(f => f.id === format);

  return (
    <main className="min-h-screen bg-background">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-57px)]">
        <div className="border-r overflow-auto p-4 space-y-4">
          <div className="flex gap-2 flex-wrap">
            {FORMATS.map(f => (
              <button key={f.id} onClick={() => setFormat(f.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${format === f.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/50 text-muted-foreground'}`}>
                {f.icon} {f.label}
              </button>
            ))}
          </div>
          {loadingContent ? (
            <Card><CardContent className="pt-6 space-y-3">
              <Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" />
            </CardContent></Card>
          ) : content ? (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{content.title}</CardTitle>
                  <div className="flex flex-col gap-1 items-end shrink-0">
                    <StubBadge />
                    <Badge variant="secondary" className="text-xs">{content.curriculumRef}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-line">{content.body}</p>
              </CardContent>
            </Card>
          ) : null}
        </div>
        <div className="flex flex-col h-full">
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
        </div>
      </div>
    </main>
  );
}
