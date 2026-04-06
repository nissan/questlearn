// Built upon Cogniti Interactive source code. Refactored for QuestLearn.
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardsProps {
  topic: string;
  cards?: Flashcard[];
}

type ConfidenceLevel = 'again' | 'hard' | 'good' | 'easy';

const CONFIDENCE_LABELS: Record<ConfidenceLevel, { label: string; emoji: string; color: string }> = {
  again: { label: 'Again', emoji: '😬', color: 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30' },
  hard:  { label: 'Hard',  emoji: '😅', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30' },
  good:  { label: 'Good',  emoji: '😊', color: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30' },
  easy:  { label: 'Easy',  emoji: '🎯', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30' },
};

const DEFAULT_CARDS: Flashcard[] = [
  { question: 'What is photosynthesis?', answer: 'The process by which plants use sunlight, water and CO₂ to produce glucose and oxygen.' },
  { question: 'What is the equation for photosynthesis?', answer: '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂' },
  { question: 'Where does photosynthesis take place?', answer: 'In the chloroplasts, specifically in the thylakoid membranes (light reactions) and stroma (Calvin cycle).' },
  { question: 'What is chlorophyll?', answer: 'The green pigment in plants that absorbs light energy (mainly red and blue wavelengths) to drive photosynthesis.' },
];

export function Flashcards({ topic, cards }: FlashcardsProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(cards ?? []);
  const [loadingCards, setLoadingCards] = useState(!cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [ratings, setRatings] = useState<Record<number, ConfidenceLevel>>({});
  const [completed, setCompleted] = useState(false);

  // Fetch generated flashcards on mount if not provided
  useEffect(() => {
    if (cards) {
      setFlashcards(cards);
      setLoadingCards(false);
      return;
    }

    const fetchCards = async () => {
      try {
        const res = await fetch('/api/questlearn/flashcards/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic }),
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const generatedCards = data.cards ?? [];
        setFlashcards(generatedCards.length > 0 ? generatedCards : DEFAULT_CARDS);
      } catch {
        // Fall back to default cards on error
        setFlashcards(DEFAULT_CARDS);
      } finally {
        setLoadingCards(false);
      }
    };

    fetchCards();
  }, [topic, cards]);

  const progress = flashcards.length > 0 ? Math.round(((currentIndex) / flashcards.length) * 100) : 0;

  if (loadingCards) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Flashcards</span>
          <Badge className="text-xs bg-amber-500/20 text-amber-400 border-0">AI-Powered</Badge>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
          <div className="text-lg text-muted-foreground animate-pulse">Generating flashcards…</div>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Flashcards</span>
          <Badge className="text-xs bg-amber-500/20 text-amber-400 border-0">AI-Powered</Badge>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
          <div className="text-sm text-muted-foreground">No flashcards available for this topic.</div>
        </div>
      </div>
    );
  }

  const current = flashcards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(f => !f);
    if (!isFlipped) {
      setShowExplain(true);
    }
  };

  const handleExplainSubmit = useCallback(async () => {
    if (!explanation.trim()) return;
    setLoadingFeedback(true);
    setAiFeedback(null);

    try {
      const response = await fetch('/api/questlearn/flashcards/evaluate-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          question: current.question,
          correct_answer: current.answer,
          student_explanation: explanation,
        }),
      });

      if (!response.ok) throw new Error('Request failed');
      const data = await response.json();
      setAiFeedback(data.feedback);
    } catch {
      setAiFeedback("Sorry, I couldn't process that right now. Try again in a moment!");
    } finally {
      setLoadingFeedback(false);
    }
  }, [explanation, topic, current]);

  const handleRate = (level: ConfidenceLevel) => {
    setRatings(r => ({ ...r, [currentIndex]: level }));

    if (currentIndex + 1 >= flashcards.length) {
      setCompleted(true);
    } else {
      setCurrentIndex(i => i + 1);
      setIsFlipped(false);
      setShowExplain(false);
      setExplanation('');
      setAiFeedback(null);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowExplain(false);
    setExplanation('');
    setAiFeedback(null);
    setRatings({});
    setCompleted(false);
  };

  if (completed) {
    const counts = Object.values(ratings).reduce((acc, r) => {
      acc[r] = (acc[r] ?? 0) + 1;
      return acc;
    }, {} as Record<ConfidenceLevel, number>);

    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Flashcards</span>
          <Badge className="text-xs bg-amber-500/20 text-amber-400 border-0">AI-Powered</Badge>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 text-center">
          <span className="text-5xl">🎉</span>
          <div>
            <h2 className="text-lg font-bold mb-1">Session Complete!</h2>
            <p className="text-sm text-muted-foreground">You went through all {flashcards.length} cards</p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            {(Object.keys(CONFIDENCE_LABELS) as ConfidenceLevel[]).map(level => (
              counts[level] ? (
                <div key={level} className="text-center">
                  <div className="text-2xl">{CONFIDENCE_LABELS[level].emoji}</div>
                  <div className="text-xs text-muted-foreground">{CONFIDENCE_LABELS[level].label}: {counts[level]}</div>
                </div>
              ) : null
            ))}
          </div>
          <Button onClick={handleRestart} className="mt-2">Try Again 🔄</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Flashcards</span>
        <Badge className="text-xs bg-amber-500/20 text-amber-400 border-0">AI-Powered</Badge>
        <span className="ml-auto text-xs text-muted-foreground">{currentIndex + 1} / {flashcards.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4">
        {/* Flashcard */}
        <div
          className="w-full max-w-lg min-h-[160px] rounded-2xl border-2 border-border cursor-pointer select-none flex flex-col items-center justify-center gap-3 p-6 text-center transition-all duration-200 hover:border-amber-500/50 hover:bg-amber-500/5"
          onClick={handleFlip}
        >
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {isFlipped ? '✅ Answer' : '❓ Question'}
          </div>
          <p className="text-base font-medium leading-relaxed">
            {isFlipped ? current.answer : current.question}
          </p>
          {!isFlipped && (
            <p className="text-xs text-muted-foreground mt-2">Tap to reveal answer</p>
          )}
        </div>

        {/* Explain yourself section — shown after flip */}
        {showExplain && !aiFeedback && (
          <div className="w-full max-w-lg space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Explain it in your own words for AI feedback:</p>
            <Textarea
              placeholder="Type your explanation here…"
              value={explanation}
              onChange={e => setExplanation(e.target.value)}
              rows={2}
              className="text-sm resize-none"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleExplainSubmit}
              disabled={!explanation.trim() || loadingFeedback}
              className="w-full"
            >
              {loadingFeedback ? 'Getting feedback…' : 'Get AI Feedback'}
            </Button>
          </div>
        )}

        {/* AI Feedback */}
        {aiFeedback && (
          <div className="w-full max-w-lg rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-1">AI Feedback 🤖</p>
            <p className="text-sm leading-relaxed">{aiFeedback}</p>
          </div>
        )}

        {/* Confidence ratings — shown after flip */}
        {isFlipped && (
          <div className="w-full max-w-lg">
            <p className="text-xs text-center text-muted-foreground mb-2">How well did you know this?</p>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(CONFIDENCE_LABELS) as ConfidenceLevel[]).map(level => (
                <button
                  key={level}
                  onClick={() => handleRate(level)}
                  className={`text-xs px-2 py-2 rounded-lg border transition-all ${CONFIDENCE_LABELS[level].color}`}
                >
                  <div>{CONFIDENCE_LABELS[level].emoji}</div>
                  <div>{CONFIDENCE_LABELS[level].label}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="px-4 py-2 border-t text-center">
        <p className="text-xs text-muted-foreground opacity-50">
          Built upon{' '}
          <a href="https://cogniti.ai" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">
            Cogniti
          </a>{' '}
          interactive source code
        </p>
      </div>
    </div>
  );
}
