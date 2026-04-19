import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { LoggerProvider } from './LoggerProvider';
import { useLogger } from './useLogger';
import { Logger } from '@anupheaus/common';

function wrapper({ children }: { children: ReactNode }) {
  return createElement(LoggerProvider, { loggerName: 'test', logger: undefined }, children);
}

describe('useLogger', () => {
  it('throws InternalError when called outside LoggerProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useLogger())).toThrow();
    spy.mockRestore();
  });

  it('returns a Logger instance inside LoggerProvider', () => {
    const { result } = renderHook(() => useLogger(), { wrapper });
    expect(result.current).toBeInstanceOf(Logger);
  });

  it('returns a sub-logger when subLogName is provided', () => {
    const { result: parent } = renderHook(() => useLogger(), { wrapper });
    const { result: child } = renderHook(() => useLogger('child'), { wrapper });
    expect(child.current).toBeInstanceOf(Logger);
    expect(child.current).not.toBe(parent.current);
  });

  it('returns the same logger when props do not change', () => {
    const { result, rerender } = renderHook(() => useLogger(), { wrapper });
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
