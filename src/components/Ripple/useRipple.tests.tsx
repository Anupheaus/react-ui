import { renderHook } from '@testing-library/react';
import { useRipple } from './useRipple';

describe('useRipple', () => {
  it('returns a rippleTarget value', () => {
    const { result } = renderHook(() => useRipple());
    expect(result.current.rippleTarget).toBeDefined();
  });

  it('rippleTarget is a function (ref callback)', () => {
    const { result } = renderHook(() => useRipple());
    expect(typeof result.current.rippleTarget).toBe('function');
  });

  it('returns a Ripple component', () => {
    const { result } = renderHook(() => useRipple());
    expect(result.current.Ripple).toBeDefined();
    expect(result.current.Ripple).not.toBeNull();
  });

  it('rippleTarget is stable across re-renders', () => {
    const { result, rerender } = renderHook(() => useRipple());
    const first = result.current.rippleTarget;
    rerender();
    expect(result.current.rippleTarget).toBe(first);
  });
});
