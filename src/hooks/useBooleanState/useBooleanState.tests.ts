import { act, renderHook } from '@testing-library/react';
import { useBooleanState } from './useBooleanState';

describe('useBooleanState', () => {
  it('initialises to false by default', () => {
    const { result } = renderHook(() => useBooleanState());
    expect(result.current[0]).toBe(false);
  });

  it('accepts a custom initial value of true', () => {
    const { result } = renderHook(() => useBooleanState(true));
    expect(result.current[0]).toBe(true);
  });

  it('setTrue sets state to true', () => {
    const { result } = renderHook(() => useBooleanState(false));
    act(() => { result.current[1](); });
    expect(result.current[0]).toBe(true);
  });

  it('setFalse sets state to false', () => {
    const { result } = renderHook(() => useBooleanState(true));
    act(() => { result.current[2](); });
    expect(result.current[0]).toBe(false);
  });

  it('raw setter sets an arbitrary value', () => {
    const { result } = renderHook(() => useBooleanState(false));
    act(() => { result.current[3](true); });
    expect(result.current[0]).toBe(true);
  });
});
