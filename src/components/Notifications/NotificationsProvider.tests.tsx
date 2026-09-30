import { act, render } from '@testing-library/react';
import { NotificationsProvider } from './NotificationsProvider';
import { useTabs } from '../Tabs';

// Toasts sit 16px above the bottom of the viewport. A mobile navigation bar (`Tabs variant="navigation"`) also sits at
// the bottom, so while one is on screen the toasts are lifted above it — otherwise a toast covers the app's main
// navigation. The lift follows the bar's height (a rotation or resize) and drops back when the bar goes away.

class MockIntersectionObserver {
  observe() { return undefined; }
  unobserve() { return undefined; }
  disconnect() { return undefined; }
}

const VIEWPORT_HEIGHT = 812;
let navBarHeight = 56;
let navBarIsAtBottom = true;

/** A layout box (jsdom has no DOMRect constructor). */
function box(top: number, height: number): DOMRect {
  return { top, bottom: top + height, height, left: 0, right: 375, width: 375, x: 0, y: top, toJSON: () => ({}) } as DOMRect;
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'IntersectionObserver', { writable: true, configurable: true, value: MockIntersectionObserver });
});

beforeEach(() => {
  navBarHeight = 56;
  navBarIsAtBottom = true;
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: VIEWPORT_HEIGHT });
  // jsdom has no layout: the navigation strip reports the box a phone would give it.
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this.tagName.toLowerCase() !== 'tabs-buttons') return box(0, 0);
    const bottom = navBarIsAtBottom ? window.innerHeight : window.innerHeight - 200;
    return box(bottom - navBarHeight, navBarHeight);
  });
});

afterEach(() => { vi.restoreAllMocks(); });

function NavigationApp() {
  const { Tabs, Tab } = useTabs();
  return (
    <Tabs variant="navigation">
      <Tab label="Schedule">schedule</Tab>
      <Tab label="Settings">settings</Tab>
    </Tabs>
  );
}

function StripTabsApp() {
  const { Tabs, Tab } = useTabs();
  return (
    <Tabs>
      <Tab label="Details">details</Tab>
      <Tab label="Notes">notes</Tab>
    </Tabs>
  );
}

function renderApp(showNavigation: boolean) {
  return render(<NotificationsProvider>{showNavigation ? <NavigationApp /> : <StripTabsApp />}</NotificationsProvider>);
}

const toasterBottom = () => (document.querySelector('[data-rht-toaster]') as HTMLElement).style.bottom;

describe('NotificationsProvider', () => {
  it('keeps toasts 16px from the bottom when there is no navigation bar', () => {
    renderApp(false);

    expect(toasterBottom()).toBe('16px');
  });

  it('lifts toasts above a navigation bar at the bottom of the screen', () => {
    renderApp(true);

    expect(toasterBottom()).toBe(`${16 + 56}px`);
  });

  it('follows the navigation bar when its height changes, e.g. on rotation', () => {
    renderApp(true);

    navBarHeight = 72;
    act(() => { window.dispatchEvent(new Event('resize')); });

    expect(toasterBottom()).toBe(`${16 + 72}px`);
  });

  it('drops the toasts back down when the navigation bar goes away', () => {
    const { rerender } = renderApp(true);

    rerender(<NotificationsProvider><StripTabsApp /></NotificationsProvider>);

    expect(toasterBottom()).toBe('16px');
  });

  it('does not lift toasts for a navigation bar that is not at the bottom of the screen', () => {
    navBarIsAtBottom = false;

    renderApp(true);

    expect(toasterBottom()).toBe('16px');
  });

  it('keeps toasts where they were when the navigation bar is used outside a NotificationsProvider', () => {
    expect(() => render(<NavigationApp />)).not.toThrow();
  });
});
