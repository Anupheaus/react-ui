import { act, renderHook } from '@testing-library/react';
import { useDistributedState } from './useDistributedState';

describe('useDistributedState', () => {
  it('get() returns the initial value', () => {
    const { result } = renderHook(() => useDistributedState(() => 42));
    expect(result.current.get()).toBe(42);
  });

  it('set() updates state', async () => {
    const { result } = renderHook(() => useDistributedState(() => 0));
    await act(async () => { result.current.set(99); });
    expect(result.current.get()).toBe(99);
  });

  it('modify() applies an updater function', async () => {
    const { result } = renderHook(() => useDistributedState(() => 10));
    await act(async () => { result.current.modify(v => v + 5); });
    expect(result.current.get()).toBe(15);
  });

  it('onChange() fires when state changes', async () => {
    const cb = vi.fn();
    const { result } = renderHook(() => {
      const ds = useDistributedState(() => 0);
      ds.onChange(cb);
      return ds;
    });
    await act(async () => { result.current.set(1); });
    expect(cb).toHaveBeenCalledWith(1);
  });

  it('getAndObserve() triggers re-render when state changes', async () => {
    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      const ds = useDistributedState(() => 0);
      ds.getAndObserve();
      return ds;
    });
    const before = renderCount;
    await act(async () => { result.current.set(1); });
    expect(renderCount).toBeGreaterThan(before);
  });

  it('does not update when same value is set', async () => {
    const cb = vi.fn();
    const { result } = renderHook(() => {
      const ds = useDistributedState(() => ({ x: 1 }));
      ds.onChange(cb);
      return ds;
    });
    await act(async () => { result.current.set({ x: 1 }); });
    expect(cb).not.toHaveBeenCalled();
  });
});
