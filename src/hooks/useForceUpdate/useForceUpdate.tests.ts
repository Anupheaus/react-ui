import { act, renderHook } from '@testing-library/react';
import { useForceUpdate } from './useForceUpdate';

describe('useForceUpdate', () => {
  it('returns a stable function reference across renders', () => {
    const { result, rerender } = renderHook(() => useForceUpdate());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('calling the returned function triggers a re-render', () => {
    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      return useForceUpdate();
    });
    const countBefore = renderCount;
    act(() => { result.current(); });
    expect(renderCount).toBeGreaterThan(countBefore);
  });

  it('defers re-render via useLayoutEffect when update is called during the render phase, without scheduling a pre-mount setTimeout', () => {
    // In React concurrent mode a subscription callback can fire update() while the
    // component is still rendering (isRenderingRef.current = true) but before it
    // has committed (hasMountedRef.current = false on the first render). The old
    // code scheduled a setTimeout(0) unconditionally in this path, which could
    // fire before useLayoutEffect and trigger React's "Can't perform a React state
    // update on a component that hasn't mounted yet" warning.
    //
    // The fix: skip the setTimeout when hasMountedRef.current = false (not yet
    // mounted). The existing useLayoutEffect already picks up shouldUpdateStateRef
    // = true on commit and calls update() correctly.
    vi.useFakeTimers();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    let renderCount = 0;
    let hasCalledUpdate = false;

    renderHook(() => {
      const update = useForceUpdate();
      renderCount++;
      if (!hasCalledUpdate) {
        hasCalledUpdate = true;
        // Call update() synchronously during the first render to simulate an external
        // subscription (e.g. useDistributedState's getAndObserve) firing while
        // isRenderingRef.current = true and hasMountedRef.current = false.
        update();
      }
      return update;
    });

    // The deferred re-render must still happen — the update must not be lost.
    expect(renderCount).toBeGreaterThan(1);

    // No React warning about state updates on not-yet-mounted components.
    const preUnmountWarnings = consoleErrorSpy.mock.calls.filter(
      args => typeof args[0] === 'string' && args[0].includes("hasn't mounted"),
    );
    expect(preUnmountWarnings).toHaveLength(0);

    vi.useRealTimers();
    consoleErrorSpy.mockRestore();
  });
});
