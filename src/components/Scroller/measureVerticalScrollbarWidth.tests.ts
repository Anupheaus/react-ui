import { measureVerticalScrollbarWidth } from './measureVerticalScrollbarWidth';

function createScrollContainer({
  scrollHeight,
  clientHeight,
  offsetWidth,
  clientWidth,
}: {
  scrollHeight: number;
  clientHeight: number;
  offsetWidth: number;
  clientWidth: number;
}): HTMLDivElement {
  const element = document.createElement('div');
  Object.defineProperty(element, 'scrollHeight', { value: scrollHeight, configurable: true });
  Object.defineProperty(element, 'clientHeight', { value: clientHeight, configurable: true });
  Object.defineProperty(element, 'offsetWidth', { value: offsetWidth, configurable: true });
  Object.defineProperty(element, 'clientWidth', { value: clientWidth, configurable: true });
  return element;
}

describe('measureVerticalScrollbarWidth', () => {
  it('returns 0 when content does not overflow vertically', () => {
    const element = createScrollContainer({
      scrollHeight: 100,
      clientHeight: 100,
      offsetWidth: 300,
      clientWidth: 284,
    });

    expect(measureVerticalScrollbarWidth(element)).toBe(0);
  });

  it('returns 0 when overflow is within the one-pixel tolerance', () => {
    const element = createScrollContainer({
      scrollHeight: 101,
      clientHeight: 100,
      offsetWidth: 300,
      clientWidth: 284,
    });

    expect(measureVerticalScrollbarWidth(element)).toBe(0);
  });

  it('returns offsetWidth minus clientWidth when content overflows vertically', () => {
    const element = createScrollContainer({
      scrollHeight: 200,
      clientHeight: 100,
      offsetWidth: 300,
      clientWidth: 284,
    });

    expect(measureVerticalScrollbarWidth(element)).toBe(16);
  });

  it('never returns a negative width', () => {
    const element = createScrollContainer({
      scrollHeight: 200,
      clientHeight: 100,
      offsetWidth: 300,
      clientWidth: 300,
    });

    expect(measureVerticalScrollbarWidth(element)).toBe(0);
  });
});
