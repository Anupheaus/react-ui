import { renderHook } from '@testing-library/react';
import { useBinder } from './useBinder';

describe('useBinder', () => {
  it('returns a binder factory function', () => {
    const { result } = renderHook(() => useBinder());
    expect(typeof result.current).toBe('function');
  });

  it('bound function returns the same reference across renders', () => {
    const { result, rerender } = renderHook(() => {
      const bind = useBinder();
      return bind(() => 42);
    });
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('bound function calls the latest delegate', () => {
    let value = 1;
    const { result, rerender } = renderHook(() => {
      const bind = useBinder();
      return bind(() => value);
    });
    const bound = result.current;
    value = 99;
    rerender();
    expect(bound()).toBe(99);
  });
});
