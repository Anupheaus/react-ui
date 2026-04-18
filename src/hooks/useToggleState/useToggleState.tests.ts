import { act, renderHook } from '@testing-library/react';
import { useToggleState } from './useToggleState';

describe('useToggleState', () => {
  it('initialises to false by default', () => {
    const { result } = renderHook(() => useToggleState());
    expect(result.current[0]).toBe(false);
  });

  it('accepts initial value true', () => {
    const { result } = renderHook(() => useToggleState(true));
    expect(result.current[0]).toBe(true);
  });

  it('accepts an initialiser function', () => {
    const { result } = renderHook(() => useToggleState(() => true));
    expect(result.current[0]).toBe(true);
  });

  it('toggle() flips false to true', () => {
    const { result } = renderHook(() => useToggleState(false));
    act(() => { result.current[1](); });
    expect(result.current[0]).toBe(true);
  });

  it('toggle() flips true to false', () => {
    const { result } = renderHook(() => useToggleState(true));
    act(() => { result.current[1](); });
    expect(result.current[0]).toBe(false);
  });
});
