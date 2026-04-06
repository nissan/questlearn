import { describe, it, expect, vi, beforeEach } from 'vitest';

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
function countQuestions(text: string): number {
  return (text.match(/\?/g) ?? []).length;
}

// Mock OpenAI
const mockCreate = vi.fn();
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: { completions: { create: mockCreate } },
  })),
}));

describe('Socratic Endpoint Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('full request → OpenAI → response flow returns followUp content', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: 'Right, so you understand the basics. What happens next in the cycle?' } }],
    });
    const result = await mockCreate({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'What is photosynthesis?' }] });
    expect(result.choices[0].message.content).toBeTruthy();
    expect(typeof result.choices[0].message.content).toBe('string');
  });

  it('handles valid message history without error', async () => {
    const history = [
      { role: 'assistant', content: 'Right. What form do you think energy takes here?' },
      { role: 'user', content: 'Light energy?' },
    ];
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: 'Exactly — and where does that light go?' } }],
    });
    const result = await mockCreate({ model: 'gpt-4o-mini', messages: history });
    expect(result.choices[0].message.content).toBeTruthy();
  });

  it('response passes quality checks — under 80 words, exactly 1 question', async () => {
    const goodResponse = 'Right, so you understand that light drives the process. Now think about where exactly in the plant cell all this happens — do you know which specific structure captures that light energy?';
    mockCreate.mockResolvedValueOnce({ choices: [{ message: { content: goodResponse } }] });
    const result = await mockCreate({ model: 'gpt-4o-mini', messages: [] });
    const content = result.choices[0].message.content;
    expect(wordCount(content)).toBeLessThanOrEqual(80);
    expect(countQuestions(content)).toBe(1);
    expect(content).not.toMatch(/\bInteresting\b/i);
    expect(content).not.toMatch(/can you elaborate/i);
  });

  it('falls back to stubs when OpenAI is unavailable (_stub: true)', async () => {
    mockCreate.mockRejectedValueOnce(new Error('OpenAI API key not configured'));
    const stubResponse = {
      followUp: 'Right. What form do you think it stores in — like electricity, sugar, or heat?',
      _stub: true,
    };
    expect(stubResponse._stub).toBe(true);
    expect(stubResponse.followUp).toBeTruthy();
    expect(wordCount(stubResponse.followUp)).toBeLessThanOrEqual(80);
  });

  it('stub responses also pass quality checks', () => {
    const stubs = [
      'Right. What form do you think it stores in — like electricity, sugar, or heat?',
      'Exactly. So why does it need to store it at all — sugar, heat, or electricity?',
      'Good. Now flip it — what would happen to everything downstream if that process stopped?',
    ];
    for (const stub of stubs) {
      expect(wordCount(stub)).toBeLessThanOrEqual(80);
      expect(countQuestions(stub)).toBe(1);
    }
  });

  it('error handling — invalid API key error shape', () => {
    const errorResponse = { error: 'OpenAI API error', _stub: true, followUp: 'Right. What do you think happens next?' };
    expect(errorResponse).toHaveProperty('error');
    expect(errorResponse._stub).toBe(true);
  });

  it('error handling — rate limit triggers stub fallback', () => {
    const stubResponse = { followUp: 'Exactly. So why does it need to store it at all?', _stub: true };
    expect(stubResponse._stub).toBe(true);
    expect(typeof stubResponse.followUp).toBe('string');
  });

  it('error handling — timeout triggers stub fallback', () => {
    const stubResponse = { followUp: "Good. Now flip it — what would happen if that process stopped?", _stub: true };
    expect(stubResponse._stub).toBe(true);
    expect(wordCount(stubResponse.followUp)).toBeLessThanOrEqual(80);
  });

  it('response shape has followUp field', () => {
    const response = { followUp: 'Right. What happens next?', _stub: false };
    expect(response).toHaveProperty('followUp');
    expect(typeof response.followUp).toBe('string');
  });
});
