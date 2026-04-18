import { renderHook } from '@testing-library/react';
import { useBound } from './useBound';

describe('useBound', () => {
  it('returns the same function reference across renders', () => {
    const { result, rerender } = renderHook(() => useBound(() => 42));
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('calls the latest delegate when invoked', () => {
    let value = 1;
    const { result, rerender } = renderHook(() => useBound(() => value));
    const bound = result.current;
    value = 2;
    rerender();
    expect(bound()).toBe(2);
  });

  it('passes arguments through to the delegate', () => {
    const { result } = renderHook(() => useBound((a: number, b: number) => a + b));
    expect(result.current(3, 4)).toBe(7);
  });
});
