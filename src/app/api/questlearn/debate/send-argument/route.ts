// QuestLearn native Debate API — send argument and get counter
// Based on Cogniti Interactive. Refactored for QuestLearn.
import { NextRequest, NextResponse } from 'next/server';
import { debateConversations } from '../start-conversation/route';

function buildSystemPrompt(topic: string, aiPosition: string): string {
  return `You are a debate opponent in a classroom debate exercise for Australian high school students (Years 8-10, ages 13-16). The debate topic is passed in the first message.

Your role:
- You argue ${aiPosition} the topic: "${topic}"
- Give concise, challenging but age-appropriate counter-arguments (3-5 sentences max)
- Use evidence, logic, and real-world examples relevant to Australian students
- Be respectful but firm — push the student to think harder
- Do NOT be patronising. Treat them as capable thinkers.
- After each counter-argument in rounds 1 and 2, the UI will add 'Can you strengthen that?' — you do NOT need to add this yourself
- In the FINAL round (round 3), after your counter-argument, add a blank line then write 'VERDICT:' followed by exactly 2 sentences: (1) who argued more effectively and why, (2) one specific thing the student could improve in their argumentation
- Keep your total response under 120 words per round`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, topic, userPosition, aiPosition, round, argument } = body;

    if (!conversationId || !topic || !argument || !round) {
      return NextResponse.json(
        { error: 'Missing required fields: conversationId, topic, argument, round' },
        { status: 400 }
      );
    }

    const apiKey = process.env.CURRICULLM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API not configured' }, { status: 500 });
    }

    // Retrieve or reconstruct conversation context
    let ctx = debateConversations.get(conversationId);
    if (!ctx) {
      // Context may have been lost (server restart) — reconstruct from request
      const resolvedAiPosition = aiPosition ?? (userPosition?.toLowerCase() === 'for' ? 'against' : 'for');
      ctx = { topic, userPosition: userPosition ?? 'for', aiPosition: resolvedAiPosition, history: [], createdAt: Date.now() };
      debateConversations.set(conversationId, ctx);
    }

    const systemPrompt = buildSystemPrompt(ctx.topic, ctx.aiPosition);
    const userMessage = `Round ${round}: ${argument}`;

    // Build message history for context
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
      ...ctx.history,
      { role: 'user', content: userMessage },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenAI error:', err);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    const fullResponse = result.choices?.[0]?.message?.content ?? '';

    // Update conversation history
    ctx.history.push({ role: 'user', content: userMessage });
    ctx.history.push({ role: 'assistant', content: fullResponse });

    // Parse VERDICT from round 3 response
    let counterArgument = fullResponse;
    let verdict: string | undefined;

    if (round >= 3 && fullResponse.includes('VERDICT:')) {
      const parts = fullResponse.split(/\n\s*VERDICT:/i);
      counterArgument = parts[0].trim();
      verdict = parts[1]?.trim();
    }

    return NextResponse.json({ counterArgument, verdict });
  } catch (error) {
    console.error('[debate/send-argument] Error:', error);
    return NextResponse.json({ error: 'Failed to process argument' }, { status: 500 });
  }
}
