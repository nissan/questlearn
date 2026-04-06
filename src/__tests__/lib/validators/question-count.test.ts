import { describe, it, expect } from 'vitest';

function countQuestions(text: string): number {
  return (text.match(/\?/g) ?? []).length;
}

// Fixtures from TEST_PLAN.md
const GOOD_RESPONSE = 'Right, so you understand that light drives the process. Now think about where exactly in the plant cell all this happens — do you know which specific structure captures that light energy?';
const NO_QUESTION = 'Right, so plants use sunlight to convert carbon dioxide and water into glucose. This process happens in the chloroplasts, which contain chlorophyll — the green pigment that absorbs light energy. The glucose produced is used for growth, energy, and building materials throughout the plant.';
const MULTI_QUESTION = 'Right, so plants make their own food. But why do they need to do that? And what would happen if they could not? Also, can you think of any animals that do something similar?';

describe('Question Count Validator', () => {
  it('counts question marks accurately — good response has 1', () => {
    expect(countQuestions(GOOD_RESPONSE)).toBe(1);
  });

  it('passes with exactly 1 question mark', () => {
    expect(countQuestions(GOOD_RESPONSE)).toBe(1);
  });

  it('fails with 0 question marks', () => {
    expect(countQuestions(NO_QUESTION)).toBe(0);
  });

  it('fails with 2+ question marks', () => {
    expect(countQuestions(MULTI_QUESTION)).toBeGreaterThan(1);
    expect(countQuestions(MULTI_QUESTION)).toBe(3);
  });

  it('counts "Why? And also why?" as 2 questions', () => {
    expect(countQuestions('Why? And also why?')).toBe(2);
  });

  it('counts "No question here." as 0', () => {
    expect(countQuestions('No question here.')).toBe(0);
  });

  it('counts "What is this?" as 1', () => {
    expect(countQuestions('What is this?')).toBe(1);
  });

  it('handles rhetorical questions in quotes — still counts ? character', () => {
    expect(countQuestions('She asked "Why?" and moved on.')).toBe(1);
  });

  it('counts empty string as 0', () => {
    expect(countQuestions('')).toBe(0);
  });
});
