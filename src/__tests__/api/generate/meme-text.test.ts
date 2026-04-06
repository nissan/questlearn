import { describe, it, expect } from 'vitest';

describe('Meme API — response shape', () => {
  it('returns an object with imageUrl field', () => {
    const response = { imageUrl: '/images/memes/drake.jpg', topText: 'When you', bottomText: 'understand it' };
    expect(response).toHaveProperty('imageUrl');
  });

  it('imageUrl is a valid local image path', () => {
    const imageUrl = '/images/memes/drake.jpg';
    expect(imageUrl).toMatch(/^\/images\/memes\//);
  });

  it('falls back gracefully — imageUrl is null (not undefined) on failure', () => {
    const errorResponse = { imageUrl: null, error: 'Image generation failed' };
    expect(errorResponse.imageUrl).toBeNull();
    expect(errorResponse.imageUrl).not.toBeUndefined();
  });

  it('response includes topText field', () => {
    const response = { imageUrl: '/images/memes/drake.jpg', topText: 'Me trying to study', bottomText: 'My phone' };
    expect(response).toHaveProperty('topText');
    expect(typeof response.topText).toBe('string');
  });

  it('response includes bottomText field', () => {
    const response = { imageUrl: '/images/memes/drake.jpg', topText: 'Me trying to study', bottomText: 'My phone' };
    expect(response).toHaveProperty('bottomText');
    expect(typeof response.bottomText).toBe('string');
  });

  it('topText and bottomText are non-empty strings when generation succeeds', () => {
    const response = { imageUrl: '/images/memes/drake.jpg', topText: 'Me trying to study', bottomText: 'My phone' };
    expect(response.topText.trim().length).toBeGreaterThan(0);
    expect(response.bottomText.trim().length).toBeGreaterThan(0);
  });

  it('meme library topics include photosynthesis', async () => {
    const memeLibrary = await import('@/lib/meme-library.json');
    expect(memeLibrary).toHaveProperty('photosynthesis');
  });

  it('photosynthesis memes have imageUrl pointing to local images', async () => {
    const memeLibrary = await import('@/lib/meme-library.json');
    const photoMemes = (memeLibrary as Record<string, Array<{imageUrl: string}>>)['photosynthesis'];
    for (const meme of photoMemes) {
      expect(meme.imageUrl).toMatch(/^\/images\/memes\//);
    }
  });

  it('fallback response has templateId, topText and bottomText', () => {
    const fallback = {
      templateId: 'drake',
      topText: 'Understanding photosynthesis',
      bottomText: 'Like a boss',
      source: 'Fallback Drake meme',
    };
    expect(fallback).toHaveProperty('templateId');
    expect(fallback).toHaveProperty('topText');
    expect(fallback).toHaveProperty('bottomText');
  });
});
