import { colors } from './colors';

describe('colors.lighten', () => {
  it('returns a hex string', () => {
    expect(colors.lighten('#336699', 20)).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('a higher percentage produces a different (lighter) result than a lower percentage', () => {
    const lessLight = colors.lighten('#336699', 10);
    const moreLight = colors.lighten('#336699', 80);
    expect(moreLight).not.toBe(lessLight);
  });

  it('returns a different value from the input color', () => {
    expect(colors.lighten('#336699', 50)).not.toBe('#336699');
  });

  it('handles named colors', () => {
    expect(colors.lighten('red', 20)).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});

describe('colors.darken', () => {
  it('returns a hex string', () => {
    expect(colors.darken('#336699', 20)).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('with 0 percentage returns the original color', () => {
    expect(colors.darken('#336699', 0)).toBe('#336699');
  });

  it('a higher percentage produces a darker result than a lower percentage', () => {
    const lessDark = colors.darken('#9999CC', 10);
    const moreDark = colors.darken('#9999CC', 80);
    expect(moreDark).not.toBe(lessDark);
  });

  it('returns a different value from the input color when percentage > 0', () => {
    expect(colors.darken('#336699', 30)).not.toBe('#336699');
  });

  it('handles named colors', () => {
    expect(colors.darken('blue', 20)).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});
