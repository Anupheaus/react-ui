import { act, renderHook } from '@testing-library/react';
import { useObservable } from './useObservable';

describe('useObservable', () => {
  it('get() returns the initial value', () => {
    const { result } = renderHook(() => useObservable(42));
    expect(result.current.get()).toBe(42);
  });

  it('set(value) updates the value', () => {
    const { result } = renderHook(() => useObservable(0));
    act(() => { result.current.set(99); });
    expect(result.current.get()).toBe(99);
  });

  it('set(fn) receives current value and sets result', () => {
    const { result } = renderHook(() => useObservable(10));
    act(() => { result.current.set(v => v + 5); });
    expect(result.current.get()).toBe(15);
  });

  it('onChange callback fires when value changes', async () => {
    const cb = vi.fn();
    const { result } = renderHook(() => {
      const obs = useObservable(0);
      obs.onChange(cb);
      return obs;
    });
    await act(async () => { result.current.set(1); });
    expect(cb).toHaveBeenCalledWith(1);
  });

  it('onChange does not fire when value is set to the same reference', async () => {
    const cb = vi.fn();
    const obj = { x: 1 };
    const { result } = renderHook(() => {
      const obs = useObservable(obj);
      obs.onChange(cb);
      return obs;
    });
    await act(async () => { result.current.set(obj); });
    expect(cb).not.toHaveBeenCalled();
  });

  it('updates when dependency array changes', () => {
    const { result, rerender } = renderHook(
      ({ dep }) => useObservable(dep, [dep]),
      { initialProps: { dep: 1 } }
    );
    expect(result.current.get()).toBe(1);
    rerender({ dep: 2 });
    expect(result.current.get()).toBe(2);
  });
});
