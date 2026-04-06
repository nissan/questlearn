import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import memeLibrary from '@/lib/meme-library.json';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic required' }, { status: 400 });
    }

    // Normalize topic name (lowercase, replace spaces with underscores)
    const normalizedTopic = topic.toLowerCase().replace(/\s+/g, '_');

    // Get memes for this topic from library
    const topicMemes = memeLibrary[normalizedTopic as keyof typeof memeLibrary];

    if (!topicMemes || topicMemes.length === 0) {
      // Fallback to generic meme if topic not in library
      return NextResponse.json({
        templateId: 'drake',
        topText: `Understanding ${topic}`,
        bottomText: 'Like a boss',
        source: 'Fallback Drake meme'
      });
    }

    // Pick a random meme from the library for this topic
    const randomMeme = topicMemes[Math.floor(Math.random() * topicMemes.length)];

    return NextResponse.json({
      templateId: randomMeme.template,
      topText: randomMeme.topText,
      bottomText: randomMeme.bottomText,
      imageUrl: randomMeme.imageUrl,
      source: randomMeme.source
    });
  } catch (error) {
    console.error('Meme generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate meme' },
      { status: 500 }
    );
  }
}
