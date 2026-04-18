import { act, renderHook } from '@testing-library/react';
import { useExpander } from './useExpander';

describe('useExpander', () => {
  it('isExpanded starts false by default', () => {
    const { result } = renderHook(() => {
      const hook = useExpander();
      return { ...hook, isExpanded: hook.isExpanded };
    });
    expect(result.current.isExpanded).toBe(false);
  });

  it('isExpanded starts true when initialState is true', () => {
    const { result } = renderHook(() => {
      const hook = useExpander(true);
      return { ...hook, isExpanded: hook.isExpanded };
    });
    expect(result.current.isExpanded).toBe(true);
  });

  it('isExpanded uses the value returned by an initialiser function', () => {
    const { result } = renderHook(() => {
      const hook = useExpander(() => true);
      return { ...hook, isExpanded: hook.isExpanded };
    });
    expect(result.current.isExpanded).toBe(true);
  });

  it('toggle() flips false to true', () => {
    const { result } = renderHook(() => {
      const hook = useExpander(false);
      return { ...hook, isExpanded: hook.isExpanded };
    });
    act(() => { result.current.toggle(); });
    expect(result.current.isExpanded).toBe(true);
  });

  it('toggle() flips true to false', () => {
    const { result } = renderHook(() => {
      const hook = useExpander(true);
      return { ...hook, isExpanded: hook.isExpanded };
    });
    act(() => { result.current.toggle(); });
    expect(result.current.isExpanded).toBe(false);
  });

  it('setExpanded(true) sets isExpanded to true', () => {
    const { result } = renderHook(() => {
      const hook = useExpander(false);
      return { ...hook, isExpanded: hook.isExpanded };
    });
    act(() => { result.current.setExpanded(true); });
    expect(result.current.isExpanded).toBe(true);
  });

  it('setExpanded(false) sets isExpanded to false', () => {
    const { result } = renderHook(() => {
      const hook = useExpander(true);
      return { ...hook, isExpanded: hook.isExpanded };
    });
    act(() => { result.current.setExpanded(false); });
    expect(result.current.isExpanded).toBe(false);
  });

  it('onExpand callback fires with the new value after toggle', () => {
    const onExpand = vi.fn();
    const { result } = renderHook(() => {
      const hook = useExpander(false, onExpand);
      return { ...hook, isExpanded: hook.isExpanded };
    });
    act(() => { result.current.toggle(); });
    expect(onExpand).toHaveBeenCalledWith(true);
  });

  it('Expander is a non-null React component object', () => {
    const { result } = renderHook(() => useExpander());
    expect(result.current.Expander).toBeDefined();
    expect(result.current.Expander).not.toBeNull();
  });
});
