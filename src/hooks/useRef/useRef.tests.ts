import { renderHook } from '@testing-library/react';
import { useRef } from './useRef';

describe('useRef', () => {
  it('returns a ref with the value produced by the initialiser', () => {
    const { result } = renderHook(() => useRef(() => 42));
    expect(result.current.current).toBe(42);
  });

  it('returns the same ref object across re-renders', () => {
    const { result, rerender } = renderHook(() => useRef(() => 42));
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('does not re-run the initialiser on re-render', () => {
    const init = vi.fn(() => 42);
    const { rerender } = renderHook(() => useRef(init));
    rerender();
    rerender();
    expect(init).toHaveBeenCalledTimes(1);
  });
});
