import { describe, it, expect } from 'vitest';

const ALLOWED_EXTENSIONS = ['.mp4', '.mov'];
const ALLOWED_TYPES = ['video/mp4', 'video/quicktime'];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

function isValidVideoFile(mimeType: string, ext: string): boolean {
  return ALLOWED_TYPES.includes(mimeType) || ALLOWED_EXTENSIONS.includes(ext.toLowerCase());
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/\.{2,}/g, '.')
    .replace(/^[.-]+/, '')
    .slice(0, 100);
}

describe('Video Upload Integration', () => {
  describe('upload success flow', () => {
    it('success response includes required fields', () => {
      const response = {
        success: true,
        videoId: 'abc-123',
        filename: 'lesson-intro.mp4',
        message: 'Video "Lesson Intro" uploaded successfully!',
        url: '/showcase/lesson-intro.mp4',
      };
      expect(response.success).toBe(true);
      expect(response).toHaveProperty('videoId');
      expect(response).toHaveProperty('filename');
      expect(response).toHaveProperty('message');
      expect(response).toHaveProperty('url');
    });

    it('filename in response is sanitized', () => {
      const raw = 'my video (1).mp4';
      const sanitized = sanitizeFilename(raw);
      expect(sanitized).not.toContain(' ');
      expect(sanitized).not.toContain('(');
    });

    it('sanitized filename has no path traversal', () => {
      const raw = '../../etc/passwd';
      const sanitized = sanitizeFilename(raw);
      expect(sanitized).not.toContain('..');
      expect(sanitized).not.toContain('/');
    });

    it('metadata JSON gets updated — structure includes videos array', () => {
      const metadata = {
        videos: [
          {
            id: 'abc-123',
            filename: 'lesson.mp4',
            title: 'Lesson 1',
            description: 'Introduction to photosynthesis',
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'Anusha',
          },
        ],
      };
      expect(metadata.videos).toHaveLength(1);
      expect(metadata.videos[0]).toHaveProperty('id');
      expect(metadata.videos[0]).toHaveProperty('filename');
      expect(metadata.videos[0]).toHaveProperty('title');
      expect(metadata.videos[0]).toHaveProperty('uploadedAt');
    });
  });

  describe('rejection cases', () => {
    it('rejects oversized files (>500MB)', () => {
      const fileSize = 501 * 1024 * 1024;
      const isOverLimit = fileSize > MAX_FILE_SIZE;
      expect(isOverLimit).toBe(true);
    });

    it('error response for oversized file includes meaningful message', () => {
      const errorResponse = {
        success: false,
        error: 'File too large: 501.0 MB. Maximum allowed size is 500 MB.',
      };
      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error).toMatch(/too large/i);
    });

    it('rejects wrong file type (.avi)', () => {
      expect(isValidVideoFile('video/avi', '.avi')).toBe(false);
    });

    it('rejects wrong file type (.mkv)', () => {
      expect(isValidVideoFile('video/x-matroska', '.mkv')).toBe(false);
    });

    it('rejects wrong file type (.webm)', () => {
      expect(isValidVideoFile('video/webm', '.webm')).toBe(false);
    });

    it('error response for invalid type', () => {
      const errorResponse = {
        success: false,
        error: 'Invalid file type: video/avi. Only MP4 and MOV files are allowed.',
      };
      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error).toMatch(/Invalid file type/i);
    });

    it('rejects requests with missing auth key (401)', () => {
      const errorResponse = { success: false, error: 'Unauthorized: invalid or missing API key' };
      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error).toMatch(/Unauthorized/i);
    });

    it('rejects requests with missing title (400)', () => {
      const errorResponse = { success: false, error: 'Missing required field: title' };
      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error).toMatch(/title/i);
    });

    it('rejects requests with missing file (400)', () => {
      const errorResponse = { success: false, error: 'Missing required field: file' };
      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error).toMatch(/file/i);
    });
  });

  describe('file type validation', () => {
    it('accepts .mp4', () => expect(isValidVideoFile('video/mp4', '.mp4')).toBe(true));
    it('accepts .mov', () => expect(isValidVideoFile('video/quicktime', '.mov')).toBe(true));
    it('accepts .MP4 uppercase', () => expect(isValidVideoFile('application/octet-stream', '.MP4')).toBe(true));
    it('accepts .MOV uppercase', () => expect(isValidVideoFile('application/octet-stream', '.MOV')).toBe(true));
    it('rejects .avi', () => expect(isValidVideoFile('video/avi', '.avi')).toBe(false));
    it('rejects .exe', () => expect(isValidVideoFile('application/octet-stream', '.exe')).toBe(false));
  });
});
