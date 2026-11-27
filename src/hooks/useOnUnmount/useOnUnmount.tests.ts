import { renderHook } from '@testing-library/react';
import { useOnUnmount } from './useOnUnmount';

describe('useOnUnmount', () => {
  it('calls the delegate when the component unmounts', () => {
    const delegate = vi.fn();
    const { unmount } = renderHook(() => useOnUnmount(delegate));
    expect(delegate).not.toHaveBeenCalled();
    unmount();
    expect(delegate).toHaveBeenCalledTimes(1);
  });

  it('calls the delegate from the latest render, not the one it mounted with', () => {
    const first = vi.fn();
    const latest = vi.fn();
    const { rerender, unmount } = renderHook(({ delegate }) => useOnUnmount(delegate), { initialProps: { delegate: first } });
    rerender({ delegate: latest });
    unmount();
    expect(first).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledTimes(1);
  });

  it('works with no delegate provided', () => {
    const { unmount } = renderHook(() => useOnUnmount());
    expect(() => unmount()).not.toThrow();
  });

  it('hasUnmounted() returns false before unmount', () => {
    const { result } = renderHook(() => useOnUnmount());
    expect(result.current()).toBe(false);
  });

  it('hasUnmounted() returns true after unmount', () => {
    const { result, unmount } = renderHook(() => useOnUnmount());
    unmount();
    expect(result.current()).toBe(true);
  });
});
