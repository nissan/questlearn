import { describe, it, expect } from 'vitest';

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/\.{2,}/g, '.')
    .replace(/^[.-]+/, '')
    .slice(0, 100);
}

describe('Filename Sanitization', () => {
  it('blocks path traversal (../)', () => {
    const result = sanitizeFilename('../../etc/passwd');
    expect(result).not.toContain('..');
    expect(result).not.toContain('/');
  });

  it('blocks Windows path traversal', () => {
    const result = sanitizeFilename('..\\..\\windows\\system32');
    expect(result).not.toContain('..');
    expect(result).not.toContain('\\');
  });

  it('removes special characters <>', () => {
    const result = sanitizeFilename('file<name>.mp4');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('removes special characters :|"?*', () => {
    const result = sanitizeFilename('file:|"?*.mp4');
    expect(result).not.toMatch(/[:|"?*]/);
  });

  it('removes spaces — replaced with dashes', () => {
    const result = sanitizeFilename('my video file.mp4');
    expect(result).not.toContain(' ');
  });

  it('removes parentheses', () => {
    const result = sanitizeFilename('my video (1).mp4');
    expect(result).not.toContain('(');
    expect(result).not.toContain(')');
  });

  it('preserves valid chars: alphanumeric, dash, underscore, dot', () => {
    const safe = 'my-video_2024.mp4';
    expect(sanitizeFilename(safe)).toBe(safe);
  });

  it('collapses multiple dots', () => {
    const result = sanitizeFilename('file...mp4');
    expect(result).not.toContain('..');
  });

  it('removes leading dots', () => {
    const result = sanitizeFilename('..dangerous.mp4');
    expect(result).not.toMatch(/^\./);
  });

  it('removes leading dashes', () => {
    const result = sanitizeFilename('-dangerous.mp4');
    expect(result).not.toMatch(/^-/);
  });

  it('handles unicode — replaces non-ASCII with dashes', () => {
    const result = sanitizeFilename('vidéo-名前.mp4');
    expect(result).not.toMatch(/[^\x00-\x7F]/);
  });

  it('truncates to 100 characters', () => {
    const long = 'a'.repeat(200);
    expect(sanitizeFilename(long).length).toBeLessThanOrEqual(100);
  });
});
