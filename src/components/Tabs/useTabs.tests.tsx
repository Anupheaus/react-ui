import React from 'react';
import { act, fireEvent, render, renderHook, waitFor } from '@testing-library/react';
import { useTabs } from './useTabs';

class MockIntersectionObserver {
  observe() { return undefined; }
  unobserve() { return undefined; }
  disconnect() { return undefined; }
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
});

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

  describe('vertical orientation', () => {
    function VerticalTabs() {
      const { Tabs, Tab } = useTabs();
      return (
        <Tabs orientation="vertical">
          <Tab label="A">Content A</Tab>
          <Tab label="B">Content B</Tab>
        </Tabs>
      );
    }

    it('outer tabs element is horizontal (no is-vertical class) when orientation="vertical"', async () => {
      const { container } = render(<VerticalTabs />);
      await waitFor(() => {
        const tabsEl = container.querySelector('tabs');
        expect(tabsEl).not.toBeNull();
        expect(tabsEl!.className).not.toContain('is-vertical');
      });
    });

    it('tabs-buttons element has is-vertical class when orientation="vertical"', async () => {
      const { container } = render(<VerticalTabs />);
      await waitFor(() => {
        const buttonsEl = container.querySelector('tabs-buttons');
        expect(buttonsEl).not.toBeNull();
        expect(buttonsEl!.className).toContain('is-vertical');
      });
    });

    it('switching tabs in vertical mode applies slide-up to inactive tab content (not slide-left)', async () => {
      function VerticalTabsWithButton() {
        const { Tabs, Tab, selectTab } = useTabs();
        const goToB = React.useCallback(() => selectTab(1), [selectTab]);
        return (
          <div>
            <Tabs orientation="vertical">
              <Tab label="A">Content A</Tab>
              <Tab label="B">Content B</Tab>
            </Tabs>
            <button onClick={goToB}>Go to B</button>
          </div>
        );
      }
      const { container, getByText } = render(<VerticalTabsWithButton />);
      await waitFor(() => expect(container.querySelectorAll('tab').length).toBeGreaterThan(0));

      act(() => { fireEvent.click(getByText('Go to B')); });

      await waitFor(() => {
        const tabEls = container.querySelectorAll('tab');
        expect(tabEls[0].className).toContain('slide-up');
        expect(tabEls[0].className).not.toContain('slide-left');
        expect(tabEls[1].className).toContain('is-visible');
      });
    });

    it('switching tabs in horizontal mode still applies slide-left (no regression)', async () => {
      function HorizontalTabsWithButton() {
        const { Tabs, Tab, selectTab } = useTabs();
        const goToB = React.useCallback(() => selectTab(1), [selectTab]);
        return (
          <div>
            <Tabs>
              <Tab label="A">Content A</Tab>
              <Tab label="B">Content B</Tab>
            </Tabs>
            <button onClick={goToB}>Go to B</button>
          </div>
        );
      }
      const { container, getByText } = render(<HorizontalTabsWithButton />);
      await waitFor(() => expect(container.querySelectorAll('tab').length).toBeGreaterThan(0));

      act(() => { fireEvent.click(getByText('Go to B')); });

      await waitFor(() => {
        const tabEls = container.querySelectorAll('tab');
        expect(tabEls[0].className).toContain('slide-left');
        expect(tabEls[0].className).not.toContain('slide-up');
      });
    });
  });
});
