// QuestLearn native Debate API — start conversation
// Based on Cogniti Interactive. Refactored for QuestLearn.
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In-memory store for conversation contexts (server-side, per process)
// Fine for demo; upgrade to Redis/DB for production
export const debateConversations = new Map<string, {
  topic: string;
  userPosition: string;
  aiPosition: string;
  history: { role: 'user' | 'assistant'; content: string }[];
  createdAt: number;
}>();

// Prune old conversations (> 2 hours) on each request
function pruneOldConversations() {
  const cutoff = Date.now() - 2 * 60 * 60 * 1000;
  for (const [id, ctx] of debateConversations.entries()) {
    if (ctx.createdAt < cutoff) debateConversations.delete(id);
  }
}

export async function POST(req: NextRequest) {
  try {
    pruneOldConversations();
    const body = await req.json();
    const { topic, userPosition } = body;

    if (!topic || !userPosition) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, userPosition' },
        { status: 400 }
      );
    }

    const aiPosition = userPosition.toLowerCase() === 'for' ? 'against' : 'for';
    const conversationId = uuidv4();

    debateConversations.set(conversationId, {
      topic,
      userPosition,
      aiPosition,
      history: [],
      createdAt: Date.now(),
    });

    return NextResponse.json({ conversationId, aiPosition });
  } catch (error) {
    console.error('[debate/start-conversation] Error:', error);
    return NextResponse.json({ error: 'Failed to start conversation' }, { status: 500 });
  }
}
