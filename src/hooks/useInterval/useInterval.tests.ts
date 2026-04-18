import { act, renderHook } from '@testing-library/react';
import { useInterval } from './useInterval';

describe('useInterval', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('calls delegate repeatedly on the interval', () => {
    const fn = vi.fn();
    renderHook(() => useInterval(fn, 100));
    act(() => { vi.advanceTimersByTime(350); });
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('cancelInterval() stops future calls', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useInterval(fn, 100));
    act(() => {
      vi.advanceTimersByTime(150);
      result.current();
      vi.advanceTimersByTime(300);
    });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('re-sets interval when dependencies change', () => {
    const fn = vi.fn();
    const { rerender } = renderHook(
      ({ dep }) => useInterval(fn, 100, { dependencies: [dep] }),
      { initialProps: { dep: 1 } }
    );
    act(() => { vi.advanceTimersByTime(150); });
    expect(fn).toHaveBeenCalledTimes(1);
    rerender({ dep: 2 });
    act(() => { vi.advanceTimersByTime(150); });
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('cleans up interval on unmount', () => {
    const fn = vi.fn();
    const { unmount } = renderHook(() => useInterval(fn, 100));
    act(() => { vi.advanceTimersByTime(150); });
    unmount();
    act(() => { vi.advanceTimersByTime(300); });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('triggerOnUnmount: true fires delegate on unmount if interval is running', () => {
    const fn = vi.fn();
    const { unmount } = renderHook(() => useInterval(fn, 100, { triggerOnUnmount: true }));
    unmount();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
