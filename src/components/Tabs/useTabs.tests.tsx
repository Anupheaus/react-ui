import { act, renderHook } from '@testing-library/react';
import { useTabs } from './useTabs';

describe('useTabs', () => {
  it('selectedTabIndex starts at 0', () => {
    const { result } = renderHook(() => {
      const hook = useTabs();
      return { ...hook, selectedTabIndex: hook.selectedTabIndex };
    });
    expect(result.current.selectedTabIndex).toBe(0);
  });

  it('selectTab(n) sets selectedTabIndex to n', () => {
    const { result } = renderHook(() => {
      const hook = useTabs();
      return { ...hook, selectedTabIndex: hook.selectedTabIndex };
    });
    act(() => { result.current.selectTab(2); });
    expect(result.current.selectedTabIndex).toBe(2);
  });

  it('selectTab(fn) receives current index and sets the returned value', () => {
    const { result } = renderHook(() => {
      const hook = useTabs();
      return { ...hook, selectedTabIndex: hook.selectedTabIndex };
    });
    act(() => { result.current.selectTab(3); });
    act(() => { result.current.selectTab(i => i + 1); });
    expect(result.current.selectedTabIndex).toBe(4);
  });

  it('Tabs is a non-null React component object', () => {
    const { result } = renderHook(() => useTabs());
    expect(result.current.Tabs).toBeDefined();
    expect(result.current.Tabs).not.toBeNull();
  });

  it('Tab is a non-null React component object', () => {
    const { result } = renderHook(() => useTabs());
    expect(result.current.Tab).toBeDefined();
    expect(result.current.Tab).not.toBeNull();
  });
});
