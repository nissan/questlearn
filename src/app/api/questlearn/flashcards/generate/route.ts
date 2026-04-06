// QuestLearn native Flashcards API — generate flashcards for a topic
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a curriculum expert for Years 8-10 Australian students. Generate 4-6 flashcards for the given topic. Each flashcard needs a question and a concise answer (1-3 sentences). Return ONLY a JSON array: [{"question": "...", "answer": "..."}]. Questions should test understanding, not just recall.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic } = body;

    if (!topic) {
      return NextResponse.json(
        { error: 'Missing required field: topic' },
        { status: 400 }
      );
    }

    const apiKey = process.env.CURRICULLM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API not configured' }, { status: 500 });
    }

    const userMessage = `Topic: ${topic}\n\nGenerate flashcard question-answer pairs.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenAI error:', err);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content ?? '';

    // Try to parse the JSON array from the response
    let cards: Array<{ question: string; answer: string }> = [];
    try {
      // Extract JSON array from content (handles cases where there's extra text)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        cards = JSON.parse(jsonMatch[0]);
        // Validate structure
        cards = cards.filter(
          (c): c is { question: string; answer: string } =>
            typeof c === 'object' &&
            c !== null &&
            typeof c.question === 'string' &&
            typeof c.answer === 'string' &&
            c.question.length > 0 &&
            c.answer.length > 0
        );
      }
    } catch {
      // JSON parse failed, fall back to empty
      console.warn('Failed to parse flashcards JSON, falling back to empty');
    }

    // If parsing failed or no cards returned, return empty array and let client handle fallback
    return NextResponse.json({ cards });
  } catch (error) {
    console.error('[flashcards/generate] Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
