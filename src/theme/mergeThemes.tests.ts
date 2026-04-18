import { mergeThemes } from './mergeThemes';
import { DefaultTheme } from './themes/DefaultTheme';

describe('mergeThemes', () => {
  it('returns a new object and does not mutate the primary theme', () => {
    const primary = DefaultTheme;
    const originalTextSize = primary.text.size;
    const result = mergeThemes(primary, { text: { size: 99 } });
    expect(result).not.toBe(primary);
    expect(primary.text.size).toBe(originalTextSize);
  });

  it('top-level scalar values from secondary override primary', () => {
    const result = mergeThemes(DefaultTheme, { text: { size: 20 } });
    expect(result.text.size).toBe(20);
  });

  it('deep nested values from secondary override primary', () => {
    const result = mergeThemes(DefaultTheme, {
      fields: { content: { normal: { borderRadius: 99 } } },
    });
    expect(result.fields.content.normal.borderRadius).toBe(99);
  });

  it('keys present only in primary are preserved', () => {
    const result = mergeThemes(DefaultTheme, { text: { size: 16 } });
    expect(result.text.family).toBe(DefaultTheme.text.family);
    expect(result.text.color).toBe(DefaultTheme.text.color);
  });

  it('secondary values do not bleed into unrelated sections', () => {
    const result = mergeThemes(DefaultTheme, { text: { size: 99 } });
    expect(result.fields.content.normal.borderRadius).toBe(DefaultTheme.fields.content.normal.borderRadius);
  });
});
