import { act, renderHook } from '@testing-library/react';
import { useUpdatableState } from './useUpdatableState';

describe('useUpdatableState', () => {
  it('returns the initial value on first render', () => {
    const { result } = renderHook(() => useUpdatableState(() => 42, []));
    expect(result.current[0]).toBe(42);
  });

  it('setter updates the value and triggers re-render', () => {
    const { result } = renderHook(() => useUpdatableState(() => 0, []));
    act(() => { result.current[1](99); });
    expect(result.current[0]).toBe(99);
  });

  it('setter with updater function receives current state', () => {
    const { result } = renderHook(() => useUpdatableState(() => 10, []));
    act(() => { result.current[1](prev => prev + 5); });
    expect(result.current[0]).toBe(15);
  });

  it('re-initialises when dependencies change', () => {
    const { result, rerender } = renderHook(
      ({ dep }) => useUpdatableState(() => dep * 2, [dep]),
      { initialProps: { dep: 3 } }
    );
    expect(result.current[0]).toBe(6);
    rerender({ dep: 5 });
    expect(result.current[0]).toBe(10);
  });
});
