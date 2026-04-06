// QuestLearn native Flashcards API — evaluate student explanation
// Based on Cogniti Interactive. Refactored for QuestLearn.
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a friendly, encouraging teacher for Years 8-10 students (ages 13-16). A student has just tried to explain a concept in their own words. Your job is to:
1. Acknowledge what they got right (be specific)
2. Gently correct any misconceptions or gaps
3. Give a brief tip to strengthen their understanding

Keep your response to 3-4 sentences. Be warm and encouraging. Use simple language appropriate for teenagers.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, question, correct_answer, student_explanation } = body;

    if (!topic || !question || !correct_answer || !student_explanation) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, question, correct_answer, student_explanation' },
        { status: 400 }
      );
    }

    const apiKey = process.env.CURRICULLM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API not configured' }, { status: 500 });
    }

    const userMessage = `Topic: ${topic}
Question: ${question}
Correct answer: ${correct_answer}
Student's explanation: ${student_explanation}

Please give feedback on the student's explanation.`;

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
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenAI error:', err);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    const feedback = result.choices?.[0]?.message?.content ?? 'Great effort! Keep practising.';

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('[flashcards/evaluate-explanation] Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
