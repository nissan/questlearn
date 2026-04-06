// QuestLearn native Debate API — generate debate motion for a curriculum topic
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a curriculum expert. Given a curriculum topic, generate a single debate motion (a clear, controversial statement) that students can debate FOR or AGAINST. The motion must be directly related to the topic and appropriate for Years 8-10 Australian students. Return ONLY the motion as a plain string, no quotes, no explanation.`;

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

    const userMessage = `Curriculum topic: ${topic}\n\nGenerate a single debate motion for this topic.`;

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
    let motion = result.choices?.[0]?.message?.content ?? '';

    // Clean up the motion text (remove quotes if present)
    motion = motion.trim().replace(/^["']|["']$/g, '');

    if (!motion) {
      motion = `"${topic}" is essential to understanding modern society.`;
    }

    return NextResponse.json({ motion });
  } catch (error) {
    console.error('[debate/generate-motion] Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
