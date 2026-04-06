import { describe, it, expect } from 'vitest';

/**
 * History Normalization tests
 * Mirrors the logic in /api/learn/socratic/route.ts
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

describe('History Normalization', () => {
  it("converts role 'ai' to 'assistant'", () => {
    const result = normalizeHistory([{ role: 'ai', text: 'Hello' }]);
    expect(result[0].role).toBe('assistant');
  });

  it("converts role 'student' to 'user'", () => {
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

  it('converts text field to content', () => {
    const result = normalizeHistory([{ role: 'ai', text: 'Great question' }]);
    expect(result[0].content).toBe('Great question');
  });

  it('prefers content over text when both are present', () => {
    const result = normalizeHistory([{ role: 'assistant', content: 'Hello', text: 'fallback' }]);
    expect(result[0].content).toBe('Hello');
  });

  it('strips empty messages', () => {
    const result = normalizeHistory([
      { role: 'ai', text: '' },
      { role: 'student', text: '   ' },
      { role: 'ai', text: 'Good point' },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].content).toBe('Good point');
  });

  it('handles empty array — returns empty array', () => {
    const result = normalizeHistory([]);
    expect(result).toEqual([]);
  });

  it('all output roles are strictly "user" or "assistant"', () => {
    const result = normalizeHistory([
      { role: 'ai', text: 'A' },
      { role: 'student', text: 'B' },
      { role: 'assistant', content: 'C' },
      { role: 'user', content: 'D' },
    ]);
    for (const msg of result) {
      expect(['user', 'assistant']).toContain(msg.role);
    }
  });

  it('handles full conversation: ai+student → assistant+user', () => {
    const history = [
      { role: 'ai', text: 'What do you think causes photosynthesis?' },
      { role: 'student', text: 'The sun?' },
      { role: 'ai', text: 'Right. What specifically from the sun?' },
      { role: 'student', text: 'Light energy?' },
    ];
    const result = normalizeHistory(history);
    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({ role: 'assistant', content: 'What do you think causes photosynthesis?' });
    expect(result[1]).toEqual({ role: 'user', content: 'The sun?' });
    expect(result[2]).toEqual({ role: 'assistant', content: 'Right. What specifically from the sun?' });
    expect(result[3]).toEqual({ role: 'user', content: 'Light energy?' });
  });
});
