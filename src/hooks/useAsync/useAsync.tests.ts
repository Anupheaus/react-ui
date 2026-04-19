import { act, renderHook } from '@testing-library/react';
import { useAsync } from './useAsync';

describe('useAsync', () => {
  it('isLoading is false before trigger, true during, false after resolve', async () => {
    let resolve!: () => void;
    const { result } = renderHook(() =>
      useAsync(async () => new Promise<void>(r => { resolve = r; }), [], { manuallyTriggered: true })
    );
    expect(result.current.isLoading).toBe(false);
    act(() => { result.current.trigger(); });
    expect(result.current.isLoading).toBe(true);
    await act(async () => { resolve(); });
    expect(result.current.isLoading).toBe(false);
  });

  it('response is undefined initially, populated after resolve', async () => {
    const { result } = renderHook(() =>
      useAsync(async () => 'hello', [], { manuallyTriggered: true })
    );
    expect(result.current.response).toBeUndefined();
    await act(async () => { result.current.trigger(); });
    expect(result.current.response).toBe('hello');
  });

  it('cancel() prevents the response from being applied', async () => {
    let resolve!: (v: string) => void;
    const { result } = renderHook(() =>
      useAsync(async () => new Promise<string>(r => { resolve = r; }), [], { manuallyTriggered: true })
    );
    act(() => { result.current.trigger(); });
    act(() => { result.current.cancel(); });
    await act(async () => { resolve('cancelled-value'); });
    expect(result.current.response).toBeUndefined();
  });

  it('error is populated when the delegate throws', async () => {
    const { result } = renderHook(() =>
      useAsync(function() { throw new Error('boom'); }, [], { manuallyTriggered: true })
    );
    // Access error getter first to enable error capture
    void result.current.error;
    act(() => { result.current.trigger(); });
    // Now error should be captured
    expect(result.current.error?.message).toBe('boom');
  });

  it('manuallyTriggered: false auto-fires on mount', async () => {
    const fn = vi.fn().mockResolvedValue('auto');
    const { result } = renderHook(() => useAsync(fn, []));
    await act(async () => {});
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result.current.response).toBe('auto');
  });
});
