// QuestLearn native Concept Map API — evaluate a single connection
// Based on Cogniti Interactive. Refactored for QuestLearn.
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a knowledgeable teacher for Years 8-10 Australian students. A student is building a concept map and just drew a connection between two concepts. Evaluate whether the relationship label they used is accurate and meaningful. If the connection is strong and correct, briefly affirm it (1 sentence). If it's weak, inaccurate, or could be improved, ask a Socratic question to guide their thinking — don't just give the answer. Keep your response to 2-3 sentences maximum. Be encouraging and supportive.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, source_concept, target_concept, relationship } = body;

    if (!topic || !source_concept || !target_concept || !relationship) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, source_concept, target_concept, relationship' },
        { status: 400 }
      );
    }

    const apiKey = process.env.CURRICULLM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API not configured' }, { status: 500 });
    }

    const userMessage = `Topic: ${topic}
The student drew a connection:
  "${source_concept}" → [${relationship}] → "${target_concept}"

Is this relationship label accurate and meaningful?`;

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
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenAI error:', err);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    const feedback = result.choices?.[0]?.message?.content ?? 'Interesting connection! Keep building your map.';

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('[concept-map/evaluate-connection] Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
