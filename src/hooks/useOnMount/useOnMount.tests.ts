import { renderHook } from '@testing-library/react';
import { useOnMount } from './useOnMount';

describe('useOnMount', () => {
  it('calls the delegate exactly once after mount', () => {
    const delegate = vi.fn();
    renderHook(() => useOnMount(delegate));
    expect(delegate).toHaveBeenCalledTimes(1);
  });

  it('does not call the delegate on re-renders', () => {
    const delegate = vi.fn();
    const { rerender } = renderHook(() => useOnMount(delegate));
    rerender();
    rerender();
    expect(delegate).toHaveBeenCalledTimes(1);
  });
});
