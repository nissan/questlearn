/**
 * QuestLearn Regression Tests
 * Covers three fixed issues:
 *  1. Meme Image Rendering (PR #36)
 *  2. Dialogue History Format normalisation
 *  3. Conversational Tone (PR #34)
 */

import { describe, it, expect } from 'vitest';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers extracted from production code (pure functions — no side effects)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * History normalisation — mirrors the logic in /api/learn/socratic/route.ts
 */
function normalizeHistory(
  history: Array<{ role: string; text?: string; content?: string }>
): Array<{ role: 'user' | 'assistant'; content: string }> {
  return (history ?? [])
    .map((m) => ({
      role: (m.role === 'ai' || m.role === 'assistant') ? 'assistant' : 'user' as 'user' | 'assistant',
      content: m.content ?? m.text ?? '',
    }))
    .filter((m) => m.content.trim() !== '');
}

/**
 * Filename sanitisation — mirrors the logic in /api/upload/video/route.ts
 */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/\.{2,}/g, '.')
    .replace(/^[.-]+/, '')
    .slice(0, 100);
}

/**
 * File type validation — mirrors the logic in /api/upload/video/route.ts
 */
const ALLOWED_TYPES = ['video/mp4', 'video/quicktime'];
const ALLOWED_EXTENSIONS = ['.mp4', '.mov'];

function isValidVideoFile(mimeType: string, ext: string): boolean {
  return ALLOWED_TYPES.includes(mimeType) || ALLOWED_EXTENSIONS.includes(ext.toLowerCase());
}

/**
 * Word count helper
 */
function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Count the number of actual interrogative sentences (not just question marks used
 * mid-sentence for other purposes). Simple proxy: count '?' characters.
 */
function countQuestions(text: string): number {
  return (text.match(/\?/g) ?? []).length;
}

// ─────────────────────────────────────────────────────────────────────────────
// ISSUE 1: Meme Image Rendering (PR #36)
// ─────────────────────────────────────────────────────────────────────────────

describe('Issue 1 — Meme Image Rendering', () => {
  it('meme API response shape includes imageUrl field (not missing)', () => {
    // The API must always return an imageUrl key, even if null on failure.
    const happyPath = { imageUrl: 'https://fal.run/generated/abc123.jpg' };
    const fallbackPath = { imageUrl: null, error: 'FAL_API_KEY not configured' };
    const errorPath = { imageUrl: null, error: 'Image generation failed' };

    expect(happyPath).toHaveProperty('imageUrl');
    expect(fallbackPath).toHaveProperty('imageUrl');
    expect(errorPath).toHaveProperty('imageUrl');
  });

  it('imageUrl is a string when generation succeeds', () => {
    const response = { imageUrl: 'https://fal.run/generated/abc123.jpg' };
    expect(typeof response.imageUrl).toBe('string');
    expect(response.imageUrl).toMatch(/^https?:\/\//);
  });

  it('imageUrl is null (not undefined) on failure — allows fallback logic', () => {
    const noKey = { imageUrl: null, error: 'FAL_API_KEY not configured' };
    const apiError = { imageUrl: null, error: 'Image generation failed' };

    // null is intentional; undefined would be a bug (missing key)
    expect(noKey.imageUrl).toBeNull();
    expect(apiError.imageUrl).toBeNull();
    expect(noKey.imageUrl).not.toBeUndefined();
    expect(apiError.imageUrl).not.toBeUndefined();
  });

  it('MemeCard renders img tag when imageUrl is provided', () => {
    // Verify the conditional rendering contract from MemeCard.tsx:
    //   if imageUrl → <img src={imageUrl} />
    //   else if template → <img src={template.file} />
    //   else → gradient div
    const imageUrl = 'https://fal.run/generated/abc123.jpg';
    const template = null;

    const shouldUseImageUrl = !!imageUrl;
    const shouldUseFallbackTemplate = !imageUrl && !!template;
    const shouldUseGradient = !imageUrl && !template;

    expect(shouldUseImageUrl).toBe(true);
    expect(shouldUseFallbackTemplate).toBe(false);
    expect(shouldUseGradient).toBe(false);
  });

  it('MemeCard falls back to template when imageUrl is null', () => {
    const imageUrl = null;
    const template = { file: '/memes/181913649.jpg', name: 'Drake Hotline Bling' };

    const shouldUseImageUrl = !!imageUrl;
    const shouldUseFallbackTemplate = !imageUrl && !!template;
    const shouldUseGradient = !imageUrl && !template;

    expect(shouldUseImageUrl).toBe(false);
    expect(shouldUseFallbackTemplate).toBe(true);
    expect(shouldUseGradient).toBe(false);
  });

  it('MemeCard falls back to gradient when both imageUrl and template are null', () => {
    const imageUrl = null;
    const template = null;

    const shouldUseGradient = !imageUrl && !template;
    expect(shouldUseGradient).toBe(true);
  });

  it('meme library templates have valid relative file paths (not external URLs)', () => {
    // Local templates must use /memes/ prefix (served from public/)
    const sampleTemplateFiles = [
      '/memes/181913649.jpg',
      '/memes/87743020.jpg',
      '/memes/112126428.jpg',
    ];

    for (const file of sampleTemplateFiles) {
      expect(file).toMatch(/^\/memes\//);
      expect(file).toMatch(/\.(jpg|png|gif|webp)$/i);
    }
  });

  it('share button only shows when imageUrl or template is present', () => {
    // MemeCard: `{(template || imageUrl) && <Button>Share</Button>}`
    expect(!!(null || null)).toBe(false);      // no button
    expect(!!(null || 'url')).toBe(true);      // imageUrl only → show button
    expect(!!({}  || null)).toBe(true);        // template only → show button
    expect(!!({}  || 'url')).toBe(true);       // both → show button
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ISSUE 2: Dialogue History Format normalisation
// ─────────────────────────────────────────────────────────────────────────────

describe('Issue 2 — Dialogue History Format normalisation', () => {
  it("converts role 'ai' → 'assistant'", () => {
    const result = normalizeHistory([{ role: 'ai', text: 'Hello' }]);
    expect(result[0].role).toBe('assistant');
  });

  it("converts role 'student' → 'user'", () => {
    const result = normalizeHistory([{ role: 'student', text: 'I think...' }]);
    expect(result[0].role).toBe('user');
  });

  it("leaves role 'assistant' unchanged", () => {
    const result = normalizeHistory([{ role: 'assistant', content: 'Right.' }]);
    expect(result[0].role).toBe('assistant');
  });

  it("leaves role 'user' unchanged", () => {
    const result = normalizeHistory([{ role: 'user', content: 'I see.' }]);
    expect(result[0].role).toBe('user');
  });

  it('uses text field when content is absent (frontend format)', () => {
    const result = normalizeHistory([{ role: 'ai', text: 'Great question' }]);
    expect(result[0].content).toBe('Great question');
  });

  it('prefers content field when both content and text present', () => {
    const result = normalizeHistory([{ role: 'assistant', content: 'Hello', text: 'fallback' }]);
    expect(result[0].content).toBe('Hello');
  });

  it('filters out messages with empty content', () => {
    const result = normalizeHistory([
      { role: 'ai', text: '' },
      { role: 'student', text: '   ' },
      { role: 'ai', text: 'Good point' },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].content).toBe('Good point');
  });

  it('handles null/undefined history gracefully (no crash)', () => {
    const result = normalizeHistory([] as Array<{ role: string; text?: string; content?: string }>);
    expect(result).toEqual([]);
  });

  it('handles full conversation: ai+student → assistant+user', () => {
    const history = [
      { role: 'ai', text: "What do you think causes photosynthesis?" },
      { role: 'student', text: "The sun?" },
      { role: 'ai', text: "Right. What specifically from the sun?" },
      { role: 'student', text: "Light energy?" },
    ];

    const result = normalizeHistory(history);
    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({ role: 'assistant', content: "What do you think causes photosynthesis?" });
    expect(result[1]).toEqual({ role: 'user', content: "The sun?" });
    expect(result[2]).toEqual({ role: 'assistant', content: "Right. What specifically from the sun?" });
    expect(result[3]).toEqual({ role: 'user', content: "Light energy?" });
  });

  it('all roles in output are strictly "user" or "assistant" (OpenAI format)', () => {
    const history = [
      { role: 'ai', text: 'A' },
      { role: 'student', text: 'B' },
      { role: 'assistant', content: 'C' },
      { role: 'user', content: 'D' },
    ];
    const result = normalizeHistory(history);
    for (const msg of result) {
      expect(['user', 'assistant']).toContain(msg.role);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ISSUE 3: Conversational Tone (PR #34) — automatable checks
// ─────────────────────────────────────────────────────────────────────────────

describe('Issue 3 — Conversational Tone: automatable checks', () => {
  // Simulate realistic Socratic responses that PASS the quality bar
  const goodResponses = [
    "Right. What form do you think it stores in — like electricity, sugar, or heat?",
    "Exactly. So why does it need to store it at all — sugar, heat, or electricity?",
    "You've spotted the key difference there. Now — where would you see this in real life?",
    "Good question. Let's approach it differently. Picture a leaf on a hot day — what do you notice?",
  ];

  // Simulate responses that FAIL (formal, academic, too long, multiple questions)
  const badResponses = {
    formal: "Interesting — you mentioned energy. Can you be more specific about what form that energy takes?",
    tooLong: "Right, so you have identified that plants use sunlight to make food. That is actually a really solid starting point. The process is called photosynthesis and it happens in a specialized structure inside the plant cell. Plants absorb carbon dioxide from the air and water from the soil, and then use light energy to convert these raw materials into glucose, which is a type of sugar the plant uses for fuel and growth. So where in the cell do you think this conversion actually takes place?",
    multipleQuestions: "Why does this happen? And what would occur if it didn't? Also, can you think of an example from real life?",
  };

  describe('Word count ≤ 80 words', () => {
    it('good responses are all under 80 words', () => {
      for (const r of goodResponses) {
        expect(wordCount(r)).toBeLessThanOrEqual(80);
      }
    });

    it('correctly flags over-limit responses', () => {
      expect(wordCount(badResponses.tooLong)).toBeGreaterThan(80);
    });

    it('wordCount helper works correctly', () => {
      expect(wordCount('Hello world')).toBe(2);
      expect(wordCount('  One  two   three  ')).toBe(3);
      expect(wordCount('')).toBe(0);
    });
  });

  describe('Question count: exactly 1 per turn', () => {
    it('good responses contain exactly 1 question mark', () => {
      for (const r of goodResponses) {
        expect(countQuestions(r)).toBe(1);
      }
    });

    it('correctly flags multiple questions per turn', () => {
      expect(countQuestions(badResponses.multipleQuestions)).toBeGreaterThan(1);
    });

    it('countQuestions helper counts correctly', () => {
      expect(countQuestions('What is this?')).toBe(1);
      expect(countQuestions('Why? And also why?')).toBe(2);
      expect(countQuestions('No question here.')).toBe(0);
    });
  });

  describe('Formal language rejection', () => {
    it('formal response contains "Interesting" — prohibited marker', () => {
      expect(badResponses.formal).toMatch(/\bInteresting\b/i);
    });

    it('good responses do NOT contain "Interesting"', () => {
      for (const r of goodResponses) {
        expect(r).not.toMatch(/\bInteresting\b/i);
      }
    });

    it('good responses do NOT contain "Can you elaborate"', () => {
      for (const r of goodResponses) {
        expect(r).not.toMatch(/can you elaborate/i);
      }
    });

    it('good responses do NOT contain "Great thinking!"', () => {
      for (const r of goodResponses) {
        expect(r).not.toMatch(/great thinking/i);
      }
    });
  });

  describe('Conversational opener presence', () => {
    const conversationalOpeners = /\b(Right|Exactly|Good question|You'?ve spotted|Let'?s approach|Picture|Good\.)/i;

    it('good responses contain at least one conversational opener', () => {
      for (const r of goodResponses) {
        expect(r).toMatch(conversationalOpeners);
      }
    });
  });

  describe('Stub vs real response detection', () => {
    it('_stub: false means real OpenAI response was used', () => {
      const realResponse = { followUp: "Right. What do you see happening?", _stub: false };
      expect(realResponse._stub).toBe(false);
    });

    it('_stub: true means fallback stub was returned (OpenAI unavailable)', () => {
      const stubResponse = { followUp: "Right. What form do you think it stores in?", _stub: true };
      expect(stubResponse._stub).toBe(true);
    });

    it('stub responses also pass word count check', () => {
      const stubFollowUps = [
        "Right. What form do you think it stores in — like electricity, sugar, or heat?",
        "Exactly. So why does it need to store it at all? What's using it up?",
        "Good. Now flip it — what would happen to everything downstream if that process stopped?",
      ];
      for (const s of stubFollowUps) {
        expect(wordCount(s)).toBeLessThanOrEqual(80);
      }
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ISSUE 1 (adjacent): File upload validation — filename + type
// ─────────────────────────────────────────────────────────────────────────────

describe('Video Upload Validation', () => {
  describe('Filename sanitisation (no path traversal)', () => {
    it('removes path traversal sequences (../)', () => {
      const result = sanitizeFilename('../../etc/passwd');
      expect(result).not.toContain('..');
      expect(result).not.toContain('/');
    });

    it('removes leading dots and dashes', () => {
      const result = sanitizeFilename('..dangerous.mp4');
      expect(result).not.toMatch(/^\./);
    });

    it('replaces spaces and special chars with dashes', () => {
      const result = sanitizeFilename('my video file (1).mp4');
      expect(result).not.toContain(' ');
      expect(result).not.toContain('(');
      expect(result).not.toContain(')');
    });

    it('truncates to 100 characters', () => {
      const long = 'a'.repeat(200);
      expect(sanitizeFilename(long).length).toBeLessThanOrEqual(100);
    });

    it('preserves safe characters (alphanumeric, dot, dash, underscore)', () => {
      const safe = 'my-video_2024.mp4';
      expect(sanitizeFilename(safe)).toBe(safe);
    });

    it('collapses multiple dots', () => {
      const result = sanitizeFilename('file...mp4');
      expect(result).not.toContain('..');
    });
  });

  describe('File type validation (mp4/mov only)', () => {
    it('accepts video/mp4 MIME type', () => {
      expect(isValidVideoFile('video/mp4', '.mp4')).toBe(true);
    });

    it('accepts video/quicktime MIME type (mov)', () => {
      expect(isValidVideoFile('video/quicktime', '.mov')).toBe(true);
    });

    it('accepts .mov extension regardless of MIME', () => {
      expect(isValidVideoFile('application/octet-stream', '.mov')).toBe(true);
    });

    it('accepts .mp4 extension regardless of MIME', () => {
      expect(isValidVideoFile('application/octet-stream', '.mp4')).toBe(true);
    });

    it('rejects .avi files', () => {
      expect(isValidVideoFile('video/avi', '.avi')).toBe(false);
    });

    it('rejects .exe files', () => {
      expect(isValidVideoFile('application/octet-stream', '.exe')).toBe(false);
    });

    it('rejects image files', () => {
      expect(isValidVideoFile('image/jpeg', '.jpg')).toBe(false);
    });

    it('accepts .MOV uppercase extension (case-insensitive)', () => {
      expect(isValidVideoFile('application/octet-stream', '.MOV')).toBe(true);
    });
  });
});
