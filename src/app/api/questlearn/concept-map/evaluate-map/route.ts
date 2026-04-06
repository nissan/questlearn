// QuestLearn native Concept Map API — evaluate full map
// Based on Cogniti Interactive. Refactored for QuestLearn.
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a knowledgeable teacher for Years 8-10 Australian students. Evaluate the student's concept map. Give 2-3 sentences of feedback on the accuracy and depth of their connections. Then suggest ONE specific missing connection they haven't made yet (name both concepts and the relationship). Be encouraging and constructive.

IMPORTANT: After your feedback, add a new line with exactly this format:
SUGGESTED_CONNECTION: [source concept] | [relationship] | [target concept]`;

interface Connection {
  source: string;
  target: string;
  relationship: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, concepts, connections } = body as {
      topic: string;
      concepts: string[];
      connections: Connection[];
    };

    if (!topic || !concepts || !connections) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, concepts, connections' },
        { status: 400 }
      );
    }

    const apiKey = process.env.CURRICULLM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API not configured' }, { status: 500 });
    }

    const connectionsText = connections
      .map(c => `  "${c.source}" → [${c.relationship}] → "${c.target}"`)
      .join('\n');

    const userMessage = `Topic: ${topic}

Concepts in map: ${concepts.join(', ')}

Connections:
${connectionsText || '  (no connections yet)'}

Please evaluate this concept map and suggest a missing connection.`;

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
        max_tokens: 250,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenAI error:', err);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    const fullResponse = result.choices?.[0]?.message?.content ?? '';

    // Parse feedback and suggested connection
    let feedback = fullResponse;
    let suggestedConnection: Connection | null = null;

    const suggMatch = fullResponse.match(/SUGGESTED_CONNECTION:\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+)/i);
    if (suggMatch) {
      feedback = fullResponse.replace(/\nSUGGESTED_CONNECTION:.*$/im, '').trim();
      suggestedConnection = {
        source: suggMatch[1].trim().replace(/^["']|["']$/g, ''),
        relationship: suggMatch[2].trim().replace(/^\[|\]$/g, ''),
        target: suggMatch[3].trim().replace(/^["']|["']$/g, ''),
      };
    }

    return NextResponse.json({ feedback, suggestedConnection });
  } catch (error) {
    console.error('[concept-map/evaluate-map] Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
