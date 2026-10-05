import { DefaultTheme } from './DefaultTheme';

/** WCAG relative luminance of a `#rrggbb` colour. */
function luminance(hex: string): number {
  const [red, green, blue] = [1, 3, 5].map(at => {
    const channel = parseInt(hex.slice(at, at + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastOnWhite(hex: string): number {
  return 1.05 / (luminance(hex) + 0.05);
}

describe('DefaultTheme status text colours', () => {
  it.each(['error', 'warning', 'success'] as const)('%s text is readable on white (WCAG AA, 4.5:1)', status => {
    expect(contrastOnWhite(DefaultTheme[status].color as string)).toBeGreaterThanOrEqual(4.5);
  });

  it('gives warning and success the same text settings as error, so they can be swapped in place', () => {
    const { color: _error, ...errorRest } = DefaultTheme.error;
    const { color: _warning, ...warningRest } = DefaultTheme.warning;
    const { color: _success, ...successRest } = DefaultTheme.success;
    expect(warningRest).toEqual(errorRest);
    expect(successRest).toEqual(errorRest);
  });
});
