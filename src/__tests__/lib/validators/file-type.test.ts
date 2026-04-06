import { describe, it, expect } from 'vitest';

const ALLOWED_TYPES = ['video/mp4', 'video/quicktime'];
const ALLOWED_EXTENSIONS = ['.mp4', '.mov'];

function isValidVideoFile(mimeType: string, ext: string): boolean {
  return ALLOWED_TYPES.includes(mimeType) || ALLOWED_EXTENSIONS.includes(ext.toLowerCase());
}

describe('File Type Validation', () => {
  it('accepts .mp4 extension', () => {
    expect(isValidVideoFile('application/octet-stream', '.mp4')).toBe(true);
  });

  it('accepts .mov extension', () => {
    expect(isValidVideoFile('application/octet-stream', '.mov')).toBe(true);
  });

  it('accepts video/mp4 MIME type', () => {
    expect(isValidVideoFile('video/mp4', '.mp4')).toBe(true);
  });

  it('accepts video/quicktime MIME type', () => {
    expect(isValidVideoFile('video/quicktime', '.mov')).toBe(true);
  });

  it('accepts .MOV uppercase extension (case-insensitive)', () => {
    expect(isValidVideoFile('application/octet-stream', '.MOV')).toBe(true);
  });

  it('accepts .MP4 uppercase extension (case-insensitive)', () => {
    expect(isValidVideoFile('application/octet-stream', '.MP4')).toBe(true);
  });

  it('rejects .avi extension', () => {
    expect(isValidVideoFile('video/avi', '.avi')).toBe(false);
  });

  it('rejects .mkv extension', () => {
    expect(isValidVideoFile('video/x-matroska', '.mkv')).toBe(false);
  });

  it('rejects .webm extension', () => {
    expect(isValidVideoFile('video/webm', '.webm')).toBe(false);
  });

  it('rejects .exe files', () => {
    expect(isValidVideoFile('application/octet-stream', '.exe')).toBe(false);
  });

  it('rejects image files', () => {
    expect(isValidVideoFile('image/jpeg', '.jpg')).toBe(false);
  });

  it('handles missing extension — rejects empty string', () => {
    expect(isValidVideoFile('application/octet-stream', '')).toBe(false);
  });

  it('accepts .mov with generic MIME type (common for iOS uploads)', () => {
    expect(isValidVideoFile('application/octet-stream', '.mov')).toBe(true);
  });
});
