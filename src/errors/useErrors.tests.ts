import { renderHook } from '@testing-library/react';
import { useErrors } from './useErrors';

describe('useErrors — tryCatch', () => {
  it('returns the delegate result when it succeeds', () => {
    const { result } = renderHook(() => useErrors());
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    expect(result.current.tryCatch(() => 42)).toBe(42);
    consoleSpy.mockRestore();
  });

  it('returns undefined when delegate throws and no onError is provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    const { result } = renderHook(() => useErrors());
    const value = result.current.tryCatch(() => { throw new Error('boom'); });
    expect(value).toBeUndefined();
    consoleSpy.mockRestore();
  });

  it('logs to console.error when context isValid is false (default — no ErrorBoundary)', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    const { result } = renderHook(() => useErrors());
    result.current.tryCatch(() => { throw new Error('unhandled'); });
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
  });

  it('calls onError with the error and returns its result', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    const { result } = renderHook(() => useErrors());
    const onError = vi.fn().mockReturnValue('handled');
    const value = result.current.tryCatch(
      () => { throw new Error('oops'); },
      { onError }
    );
    expect(onError).toHaveBeenCalledTimes(1);
    expect(value).toBe('handled');
    consoleSpy.mockRestore();
  });

  it('does not call console.error when onError intercepts the throw', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    const { result } = renderHook(() => useErrors());
    result.current.tryCatch(() => { throw new Error('intercepted'); }, { onError: () => undefined });
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('returns the result when delegate returns a resolved promise', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    const { result } = renderHook(() => useErrors());
    const value = await result.current.tryCatch(async () => 'async-result');
    expect(value).toBe('async-result');
    consoleSpy.mockRestore();
  });

  it('handles a rejected promise and logs it', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    const { result } = renderHook(() => useErrors());
    await result.current.tryCatch(async () => { throw new Error('async-err'); });
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
  });

  it('calls onError when a promise rejects', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    const onError = vi.fn().mockReturnValue(undefined);
    const { result } = renderHook(() => useErrors());
    await result.current.tryCatch(
      async () => { throw new Error('async-oops'); },
      { onError }
    );
    expect(onError).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
  });

  it('accepts isAsync:true as a boolean shorthand', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    const { result } = renderHook(() => useErrors());
    const onError = vi.fn().mockReturnValue(undefined);
    result.current.tryCatch(() => { throw new Error('flagged'); }, { isAsync: true, onError });
    expect(onError).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
  });
});
