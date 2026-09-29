import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import type { WindowState } from '../WindowsModels';
import { useFitWindowToContent } from './useFitWindowToContent';

// jsdom has no layout, so the window's DOM is built by hand with the sizes a browser would report, and the observers
// are captured so a test can say "the content changed".

let observerCallbacks: (() => void)[] = [];

class CapturingObserver {
  constructor(callback: () => void) { observerCallbacks.push(callback); }
  observe() { return undefined; }
  disconnect() { return undefined; }
}

function contentChanged(): void {
  observerCallbacks.forEach(callback => callback());
}

interface Sizes {
  window: { width: number; height: number };
  /** What the content scroller shows (the window's content area). */
  viewport: number;
  /** The content's own height when it is not stretched. */
  naturalHeight: number;
}

function defineSize(element: HTMLElement, name: string, read: () => number): void {
  Object.defineProperty(element, name, { configurable: true, get: read });
}

/** A window in a 1280×800 host, with its content scroller, reporting `sizes` (which a test changes as it goes). */
function buildWindow(sizes: Sizes): HTMLElement {
  const host = document.createElement('windows');
  defineSize(host, 'clientWidth', () => 1280);
  defineSize(host, 'clientHeight', () => 800);
  const windowElement = document.createElement('window');
  windowElement.innerHTML = '<window-content><scroller><scroller-container><scroller-content><div></div></scroller-content></scroller-container></scroller></window-content>';
  host.appendChild(windowElement);
  document.body.appendChild(host);
  const applyWindowSize = () => {
    windowElement.style.width = `${sizes.window.width}px`;
    windowElement.style.height = `${sizes.window.height}px`;
  };
  applyWindowSize();
  const container = windowElement.querySelector('scroller-container') as HTMLElement;
  const content = windowElement.querySelector('scroller-content') as HTMLElement;
  defineSize(container, 'clientHeight', () => sizes.viewport);
  defineSize(container, 'clientWidth', () => sizes.window.width);
  // Stretched to fill the viewport, so it scrolls only by what is taller than that.
  defineSize(container, 'scrollHeight', () => Math.max(sizes.naturalHeight, sizes.viewport));
  defineSize(container, 'scrollWidth', () => sizes.window.width);
  defineSize(content, 'offsetHeight', () => (content.style.minHeight === '0px' ? sizes.naturalHeight : Math.max(sizes.naturalHeight, sizes.viewport)));
  return windowElement;
}

interface HookProps {
  hasUserResized: boolean;
}

function renderFit(windowElement: HTMLElement, sizes: Sizes) {
  const setState = vi.fn((changes: Partial<WindowState>) => {
    // The window takes the size it is given, as Window does from its state.
    const { height = sizes.window.height } = changes;
    sizes.viewport += Number(height) - sizes.window.height;
    sizes.window = { ...sizes.window, height: Number(height) };
    windowElement.style.height = `${height}px`;
  });
  const result = renderHook(({ hasUserResized }: HookProps) => {
    const windowElementRef = useRef<HTMLElement>(windowElement);
    useFitWindowToContent({ isEnabled: true, hasUserResized, windowElementRef, setState });
  }, { initialProps: { hasUserResized: false } });
  return { ...result, setState };
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'ResizeObserver', { writable: true, configurable: true, value: CapturingObserver });
  Object.defineProperty(globalThis, 'MutationObserver', { writable: true, configurable: true, value: CapturingObserver });
});

beforeEach(() => {
  observerCallbacks = [];
  document.body.innerHTML = '';
});

describe('useFitWindowToContent', () => {
  it('grows a dialog whose content grows past it', () => {
    const sizes: Sizes = { window: { width: 420, height: 200 }, viewport: 120, naturalHeight: 120 };
    const { setState } = renderFit(buildWindow(sizes), sizes);

    sizes.naturalHeight = 300;
    contentChanged();

    expect(setState).toHaveBeenLastCalledWith(expect.objectContaining({ height: 380 }));
  });

  it('never shrinks a dialog whose full-height list is shorter than it', () => {
    // A resizable Import review dialog opened at 560 with a list that fills it: the list's own height is tiny.
    const sizes: Sizes = { window: { width: 900, height: 560 }, viewport: 480, naturalHeight: 40 };
    const { setState } = renderFit(buildWindow(sizes), sizes);

    contentChanged();

    expect(setState).not.toHaveBeenCalled();
  });

  it('does not snap back a dialog the user has resized', () => {
    const sizes: Sizes = { window: { width: 420, height: 200 }, viewport: 120, naturalHeight: 120 };
    const windowElement = buildWindow(sizes);
    const { setState, rerender } = renderFit(windowElement, sizes);
    sizes.naturalHeight = 300;
    contentChanged();
    setState.mockClear();

    // The user drags it taller to see more, then the content changes again.
    windowElement.style.height = '700px';
    rerender({ hasUserResized: true });
    sizes.naturalHeight = 100;
    contentChanged();

    expect(setState).not.toHaveBeenCalled();
  });

  it('gives back only the growth once the content that caused it goes', () => {
    const sizes: Sizes = { window: { width: 420, height: 200 }, viewport: 120, naturalHeight: 120 };
    const { setState } = renderFit(buildWindow(sizes), sizes);
    sizes.naturalHeight = 300;
    contentChanged();

    sizes.naturalHeight = 20;
    contentChanged();

    expect(setState).toHaveBeenLastCalledWith(expect.objectContaining({ height: 200 }));
  });
});
