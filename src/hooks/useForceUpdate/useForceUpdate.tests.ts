import { act, renderHook } from '@testing-library/react';
import { useForceUpdate } from './useForceUpdate';

describe('useForceUpdate', () => {
  it('returns a stable function reference across renders', () => {
    const { result, rerender } = renderHook(() => useForceUpdate());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('calling the returned function triggers a re-render', async () => {
    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      return useForceUpdate();
    });
    const countBefore = renderCount;
    await act(async () => { result.current(); });
    expect(renderCount).toBeGreaterThan(countBefore);
  });
});
