// Based on Cogniti Interactive. Refactored for QuestLearn.
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DebateProps {
  topic?: string;
}

type Position = 'for' | 'against';
type GamePhase = 'setup' | 'debating' | 'verdict';

interface DebateMessage {
  role: 'user' | 'ai';
  text: string;
  round?: number;
}

const DEBATE_TOPICS = [
  'Social media does more harm than good',
  'School uniforms should be compulsory',
  'Australia should become a republic',
  'Climate change is the biggest threat facing young Australians',
  'Homework should be abolished',
  'Animals should have the same rights as humans',
];

const MAX_ROUNDS = 3;

export function Debate({ topic: propTopic }: DebateProps) {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [topic, setTopic] = useState(propTopic ?? '');
  const [userPosition, setUserPosition] = useState<Position | null>(null);
  const [aiPosition, setAiPosition] = useState<Position | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [round, setRound] = useState(1);
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [argument, setArgument] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, verdict]);

  const handleStart = async (position: Position) => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setError(null);
    setUserPosition(position);

    try {
      const res = await fetch('/api/questlearn/debate/start-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, userPosition: position }),
      });

      if (!res.ok) throw new Error('Failed to start debate');
      const data = await res.json();

      setConversationId(data.conversationId);
      setAiPosition(data.aiPosition as Position);
      setPhase('debating');

      // Opening message
      setMessages([{
        role: 'ai',
        text: `Let's debate: "${topic}". You're arguing ${position.toUpperCase()} the motion. I'll argue ${data.aiPosition.toUpperCase()}. Make your opening argument for Round 1!`,
      }]);
    } catch {
      setError('Failed to start the debate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendArgument = async () => {
    if (!argument.trim() || !conversationId || isLoading) return;
    const currentArg = argument.trim();
    setArgument('');
    setIsLoading(true);
    setError(null);

    // Add user message
    setMessages(m => [...m, { role: 'user', text: currentArg, round }]);

    try {
      const res = await fetch('/api/questlearn/debate/send-argument', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          topic,
          userPosition,
          aiPosition,
          round,
          argument: currentArg,
        }),
      });

      if (!res.ok) throw new Error('Failed to send argument');
      const data = await res.json();

      // Add AI counter-argument
      const counterText = round < MAX_ROUNDS
        ? `${data.counterArgument}\n\nCan you strengthen that?`
        : data.counterArgument;

      setMessages(m => [...m, { role: 'ai', text: counterText, round }]);

      if (data.verdict) {
        setVerdict(data.verdict);
        setPhase('verdict');
      } else if (round < MAX_ROUNDS) {
        setRound(r => r + 1);
      } else {
        setPhase('verdict');
      }
    } catch {
      setError("Sorry, something went wrong. Try again!");
      setMessages(m => m.slice(0, -1)); // Remove the user message on error
      setArgument(currentArg); // Restore input
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setPhase('setup');
    setTopic(propTopic ?? '');
    setUserPosition(null);
    setAiPosition(null);
    setConversationId(null);
    setRound(1);
    setMessages([]);
    setArgument('');
    setVerdict(null);
    setError(null);
  };

  // ── Setup screen ──────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Debate</span>
          <Badge className="text-xs bg-purple-500/20 text-purple-400 border-0">AI Opponent</Badge>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
          <div className="text-center">
            <span className="text-4xl">⚖️</span>
            <h2 className="text-lg font-bold mt-2">Debate Challenge</h2>
            <p className="text-sm text-muted-foreground mt-1">3 rounds · AI opponent · Verdict at the end</p>
          </div>

          {/* Topic selection */}
          <div className="w-full max-w-md space-y-3">
            <label className="text-sm font-medium">Choose a topic:</label>
            <div className="grid grid-cols-1 gap-2">
              {DEBATE_TOPICS.map(t => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`text-left text-sm px-3 py-2 rounded-lg border transition-all ${
                    topic === t
                      ? 'border-purple-500 bg-purple-500/10 text-foreground'
                      : 'border-border text-muted-foreground hover:border-purple-500/50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground text-center">or</div>
            <input
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Type your own debate topic…"
              value={DEBATE_TOPICS.includes(topic) ? '' : topic}
              onChange={e => setTopic(e.target.value)}
            />
          </div>

          {/* Position selection */}
          {topic && (
            <div className="w-full max-w-md space-y-3">
              <label className="text-sm font-medium">Your position on: &ldquo;{topic}&rdquo;</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleStart('for')}
                  disabled={isLoading}
                  className="px-4 py-3 rounded-xl border-2 border-green-500/50 bg-green-500/10 text-green-400 font-medium text-sm hover:bg-green-500/20 transition-all disabled:opacity-50"
                >
                  👍 I argue FOR
                </button>
                <button
                  onClick={() => handleStart('against')}
                  disabled={isLoading}
                  className="px-4 py-3 rounded-xl border-2 border-red-500/50 bg-red-500/10 text-red-400 font-medium text-sm hover:bg-red-500/20 transition-all disabled:opacity-50"
                >
                  👎 I argue AGAINST
                </button>
              </div>
              {isLoading && <p className="text-xs text-center text-muted-foreground animate-pulse">Starting debate…</p>}
              {error && <p className="text-xs text-center text-red-400">{error}</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Debate screen ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center gap-2 shrink-0">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Debate</span>
        <Badge className="text-xs bg-purple-500/20 text-purple-400 border-0">Round {round}/{MAX_ROUNDS}</Badge>
        <Badge className="text-xs bg-green-500/20 text-green-400 border-0 ml-auto">
          You: {userPosition?.toUpperCase()}
        </Badge>
        <Badge className="text-xs bg-red-500/20 text-red-400 border-0">
          AI: {aiPosition?.toUpperCase()}
        </Badge>
      </div>

      {/* Topic banner */}
      <div className="px-4 py-2 bg-purple-500/5 border-b shrink-0">
        <p className="text-xs text-center text-muted-foreground">
          ⚖️ &ldquo;{topic}&rdquo;
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'ai'
                    ? 'bg-muted text-foreground rounded-tl-sm'
                    : 'bg-primary text-primary-foreground rounded-tr-sm'
                }`}
              >
                {msg.round && <div className="text-xs opacity-60 mb-1">Round {msg.round}</div>}
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                <span className="text-muted-foreground text-sm animate-pulse">AI is thinking…</span>
              </div>
            </div>
          )}

          {/* Verdict box */}
          {verdict && (
            <div className="rounded-2xl border-2 border-purple-500/30 bg-purple-500/10 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚖️</span>
                <span className="font-bold text-sm">VERDICT</span>
              </div>
              <p className="text-sm leading-relaxed">{verdict}</p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      {phase === 'debating' && (
        <div className="p-4 border-t space-y-2 shrink-0">
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Textarea
            placeholder={`Your Round ${round} argument…`}
            value={argument}
            onChange={e => setArgument(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendArgument(); } }}
            rows={3}
            className="resize-none text-sm"
            disabled={isLoading}
          />
          <Button
            className="w-full"
            onClick={handleSendArgument}
            disabled={!argument.trim() || isLoading}
          >
            {isLoading ? 'Waiting for AI…' : `Submit Round ${round} Argument →`}
          </Button>
        </div>
      )}

      {/* Verdict phase — restart button */}
      {phase === 'verdict' && (
        <div className="p-4 border-t shrink-0">
          <Button variant="outline" className="w-full" onClick={handleRestart}>
            New Debate 🔄
          </Button>
        </div>
      )}
    </div>
  );
}
