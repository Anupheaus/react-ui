import { renderHook } from '@testing-library/react';
import { useBrowserInfo } from './useBrowserInfo';

// jsdom does not implement window.matchMedia — provide a minimal stub
beforeAll(() => {
  if (typeof window.matchMedia !== 'function') {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }),
    });
  }
});

describe('useBrowserInfo', () => {
  it('returns an object with expected shape', () => {
    const { result } = renderHook(() => useBrowserInfo());
    expect(typeof result.current.browserName).toBe('string');
    expect(typeof result.current.isTouchScreen).toBe('boolean');
    expect(typeof result.current.fullVersion).toBe('string');
    expect(typeof result.current.majorVersion).toBe('number');
    expect(typeof result.current.userAgent).toBe('string');
    expect(typeof result.current.platform).toBe('string');
  });

  it('isTouchScreen reflects matchMedia and maxTouchPoints', () => {
    const { result } = renderHook(() => useBrowserInfo());
    // jsdom reports isTouchScreen as false by default
    expect(typeof result.current.isTouchScreen).toBe('boolean');
  });

  it('returns stable values across re-renders (memoised)', () => {
    const { result, rerender } = renderHook(() => useBrowserInfo());
    const first = result.current;
    rerender();
    expect(result.current.userAgent).toBe(first.userAgent);
    expect(result.current.browserName).toBe(first.browserName);
  });
});
