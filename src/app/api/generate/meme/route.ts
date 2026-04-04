import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { topic, topText, bottomText } = await req.json();
  if (!topic || !topText || !bottomText) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const falKey = process.env.FAL_API_KEY;
  if (!falKey) {
    // Graceful: no key configured → signal fallback to client
    return NextResponse.json({ imageUrl: null, error: 'FAL_API_KEY not configured' });
  }

  try {
    const res = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Educational illustration about ${topic}, meme-style background, vibrant colors, no text, no watermark, safe for school, educational`,
        image_size: 'square',
        num_inference_steps: 4,
        num_images: 1,
      }),
    });
    const data = await res.json();
    const imageUrl: string | null = data?.images?.[0]?.url ?? null;
    return NextResponse.json({ imageUrl });
  } catch (err) {
    console.error('[meme] fal.ai error:', err);
    return NextResponse.json({ imageUrl: null, error: 'Image generation failed' });
  }
}
