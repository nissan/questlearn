// QuestLearn native Concept Map API — generate starter concepts for a topic
// Based on Cogniti Interactive. Refactored for QuestLearn.
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a curriculum expert. Given a topic, generate 5-7 key concepts that a student should understand. Return ONLY a JSON array of strings, e.g. ["Concept 1", "Concept 2"]. Each concept should be 1-4 words, specific to the topic, and pedagogically meaningful.`;

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

    const userMessage = `Topic: ${topic}\n\nGenerate key concepts for this topic.`;

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
    const content = result.choices?.[0]?.message?.content ?? '';

    // Try to parse the JSON array from the response
    let concepts: string[] = [];
    try {
      // Extract JSON array from content (handles cases where there's extra text)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        concepts = JSON.parse(jsonMatch[0]);
        // Filter to strings and validate
        concepts = concepts.filter((c): c is string => typeof c === 'string' && c.length > 0);
      }
    } catch {
      // JSON parse failed, fall back to topic-based generation
      console.warn('Failed to parse concepts JSON, falling back to default');
    }

    // If parsing failed or no concepts returned, use fallback
    if (concepts.length === 0) {
      concepts = [topic, 'Key Concept', 'Related Theory', 'Application', 'Analysis'];
    }

    return NextResponse.json({ concepts });
  } catch (error) {
    console.error('[concept-map/generate-concepts] Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
