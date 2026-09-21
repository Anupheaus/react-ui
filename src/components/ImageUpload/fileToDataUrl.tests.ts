import { describe, it, expect } from 'vitest';
import { fileToDataUrl } from './fileToDataUrl';

describe('fileToDataUrl', () => {
  it('resolves a data URL for the file contents', async () => {
    const file = new File(['hello'], 'logo.png', { type: 'image/png' });
    const result = await fileToDataUrl(file);
    expect(result.startsWith('data:image/png;base64,')).toBe(true);
    // "hello" base64-encoded is aGVsbG8=
    expect(result).toContain('aGVsbG8=');
  });
});
