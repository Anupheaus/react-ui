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
