import { renderHook } from '@testing-library/react';
import { useSet } from './useSet';

describe('useSet', () => {
  it('returns a Set instance', () => {
    const { result } = renderHook(() => useSet<number>());
    expect(result.current).toBeInstanceOf(Set);
  });

  it('returns the same Set reference across re-renders', () => {
    const { result, rerender } = renderHook(() => useSet<number>());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
