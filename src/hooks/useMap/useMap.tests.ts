import { renderHook } from '@testing-library/react';
import { useMap } from './useMap';

describe('useMap', () => {
  it('returns a Map instance', () => {
    const { result } = renderHook(() => useMap<string, number>());
    expect(result.current).toBeInstanceOf(Map);
  });

  it('returns the same Map reference across re-renders', () => {
    const { result, rerender } = renderHook(() => useMap<string, number>());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
