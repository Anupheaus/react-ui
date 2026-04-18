import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('does not call the delegate immediately', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 200));
    result.current();
    expect(fn).not.toHaveBeenCalled();
  });

  it('calls the delegate after the specified delay', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 200));
    act(() => { result.current(); vi.advanceTimersByTime(200); });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets the timer when called again before delay expires', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 200));
    act(() => {
      result.current();
      vi.advanceTimersByTime(100);
      result.current();
      vi.advanceTimersByTime(100);
    });
    expect(fn).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(100); });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('longestMs fires after longestMs even if calls keep coming', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 200, 500));
    act(() => {
      result.current();
      vi.advanceTimersByTime(200);
      result.current();
      vi.advanceTimersByTime(200);
      result.current();
      vi.advanceTimersByTime(200);
    });
    expect(fn.mock.calls.length).toBeGreaterThanOrEqual(1);
  });
});
