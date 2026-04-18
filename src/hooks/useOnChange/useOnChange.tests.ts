import { renderHook } from '@testing-library/react';
import { useOnChange } from './useOnChange';

describe('useOnChange', () => {
  it('does not call the delegate on the initial render', () => {
    const delegate = vi.fn();
    renderHook(({ val }) => useOnChange(delegate, [val]), { initialProps: { val: 1 } });
    expect(delegate).not.toHaveBeenCalled();
  });

  it('calls the delegate when a dependency changes', () => {
    const delegate = vi.fn();
    const { rerender } = renderHook(({ val }) => useOnChange(delegate, [val]), { initialProps: { val: 1 } });
    rerender({ val: 2 });
    expect(delegate).toHaveBeenCalledTimes(1);
  });

  it('calls the delegate again on each subsequent change', () => {
    const delegate = vi.fn();
    const { rerender } = renderHook(({ val }) => useOnChange(delegate, [val]), { initialProps: { val: 1 } });
    rerender({ val: 2 });
    rerender({ val: 3 });
    expect(delegate).toHaveBeenCalledTimes(2);
  });

  it('does not call the delegate when dependencies are the same', () => {
    const delegate = vi.fn();
    const { rerender } = renderHook(({ val }) => useOnChange(delegate, [val]), { initialProps: { val: 1 } });
    rerender({ val: 1 });
    expect(delegate).not.toHaveBeenCalled();
  });
});
