import { act, renderHook } from '@testing-library/react';
import { useTimeout } from './useTimeout';

describe('useTimeout', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('calls delegate after the specified timeout', () => {
    const fn = vi.fn();
    renderHook(() => useTimeout(fn, 300));
    expect(fn).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(300); });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('cancelTimeout() prevents the delegate from firing', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useTimeout(fn, 300));
    act(() => { result.current(); vi.advanceTimersByTime(300); });
    expect(fn).not.toHaveBeenCalled();
  });

  it('re-runs timeout when dependencies change', () => {
    const fn = vi.fn();
    const { rerender } = renderHook(
      ({ dep }) => useTimeout(fn, 300, { dependencies: [dep] }),
      { initialProps: { dep: 1 } }
    );
    act(() => { vi.advanceTimersByTime(300); });
    expect(fn).toHaveBeenCalledTimes(1);
    rerender({ dep: 2 });
    act(() => { vi.advanceTimersByTime(300); });
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('triggerOnUnmount: true fires delegate on unmount if timeout is pending', () => {
    const fn = vi.fn();
    const { unmount } = renderHook(() => useTimeout(fn, 300, { triggerOnUnmount: true }));
    unmount();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not fire after unmount when triggerOnUnmount is false', () => {
    const fn = vi.fn();
    const { unmount } = renderHook(() => useTimeout(fn, 300));
    unmount();
    act(() => { vi.advanceTimersByTime(300); });
    expect(fn).not.toHaveBeenCalled();
  });
});
