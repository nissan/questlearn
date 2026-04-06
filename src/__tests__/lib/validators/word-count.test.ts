import { describe, it, expect } from 'vitest';

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Fixtures from TEST_PLAN.md
const GOOD_RESPONSE = 'Right, so you understand that light drives the process. Now think about where exactly in the plant cell all this happens — do you know which specific structure captures that light energy?';
// 32 words

const TOO_LONG_RESPONSE = 'Right, so you have identified that plants use sunlight to make food. That is actually a really solid starting point. The process is called photosynthesis and it happens in a specialized structure inside the plant cell. Plants absorb carbon dioxide from the air and water from the soil, and then use light energy to convert these raw materials into glucose, which is a type of sugar the plant uses for fuel and growth. So where in the cell do you think this conversion actually takes place?';
// 86 words

describe('Word Count Validator', () => {
  it('counts words accurately for the good response fixture (32 words)', () => {
    expect(wordCount(GOOD_RESPONSE)).toBe(32);
  });

  it('counts words accurately for the too-long fixture (86 words)', () => {
    expect(wordCount(TOO_LONG_RESPONSE)).toBe(86);
  });

  it('passes responses under 80 words', () => {
    expect(wordCount(GOOD_RESPONSE)).toBeLessThanOrEqual(80);
  });

  it('fails responses at 81+ words', () => {
    expect(wordCount(TOO_LONG_RESPONSE)).toBeGreaterThan(80);
  });

  it("handles contractions — does not split \"can't\" into 2 words", () => {
    expect(wordCount("I can't do this")).toBe(4);
    expect(wordCount("don't won't isn't")).toBe(3);
  });

  it('handles empty string — returns 0', () => {
    expect(wordCount('')).toBe(0);
  });

  it('handles extra whitespace correctly', () => {
    expect(wordCount('  One  two   three  ')).toBe(3);
  });

  it('counts "Hello world" as 2 words', () => {
    expect(wordCount('Hello world')).toBe(2);
  });

  it('boundary: 80-word response passes', () => {
    // Build an exactly 80 word string
    const words80 = Array(80).fill('word').join(' ');
    expect(wordCount(words80)).toBe(80);
    expect(wordCount(words80)).toBeLessThanOrEqual(80);
  });

  it('boundary: 81-word response fails', () => {
    const words81 = Array(81).fill('word').join(' ');
    expect(wordCount(words81)).toBeGreaterThan(80);
  });
});
