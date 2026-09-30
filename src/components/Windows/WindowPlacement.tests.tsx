import { act, render } from '@testing-library/react';
import { vi } from 'vitest';
import { useBound } from '../../hooks';
import { Windows } from './Windows';
import { createWindow } from './createWindow';
import { useWindow } from './useWindow';
import { WindowsManager, WINDOWS_DEFAULT_ID } from './WindowsManager';
import type { WindowState } from './WindowsModels';

// A window whose default or remembered size is bigger than the space it opens in must open clamped inside that space,
// with its title bar and its bottom buttons on screen; a remembered position that is now off screen is pulled back.
// jsdom has no layout, so the host reports the size a browser would give it and the window reports the size a browser
// would lay it out at (its min size, when that is bigger than its content).

const STORAGE_KEY = 'window-placement-tests';
const WINDOW_ID = 'placement-window';
/** Longer than a window's opening (preparing → prepared → visible) takes. */
const OPENING_SETTLED_MS = 5_000;

interface Size { width: number; height: number; }

let hostSize: Size = { width: 1024, height: 560 };
let laidOutWindowSize: Size | undefined;

vi.mock('use-resize-observer/polyfilled.js', () => ({
  default: () => ({ ref: () => undefined, width: laidOutWindowSize?.width, height: laidOutWindowSize?.height }),
}));

const clientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
const clientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');

function reportHostSize(): void {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get(this: HTMLElement) { return this.tagName === 'WINDOWS' ? hostSize.width : 0; } });
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, get(this: HTMLElement) { return this.tagName === 'WINDOWS' ? hostSize.height : 0; } });
}

function restoreClientSizes(): void {
  if (clientWidth != null) Object.defineProperty(HTMLElement.prototype, 'clientWidth', clientWidth);
  if (clientHeight != null) Object.defineProperty(HTMLElement.prototype, 'clientHeight', clientHeight);
}

/** Like the Supplier product window: a minimum size bigger than a 1280×720 screen leaves under the app bar. */
const BigWindow = createWindow('PlacementBigWindow', ({ Window, Content }) => () => (
  <Window title="Big" minWidth={1100} minHeight={720} initialPosition="center">
    <Content>big</Content>
  </Window>
));

const PlainWindow = createWindow('PlacementPlainWindow', ({ Window, Content }) => () => (
  <Window title="Plain">
    <Content>plain</Content>
  </Window>
));

function OpenBigWindowOnMount() {
  const { openPlacementBigWindow } = useWindow(BigWindow);
  const open = useBound(() => { void openPlacementBigWindow(WINDOW_ID); });
  return <button onClick={open}>Open</button>;
}

function persistWindow(state: Partial<WindowState>): void {
  const stored: WindowState = { id: WINDOW_ID, definitionId: WINDOW_ID, windowTypeName: PlainWindow.name, args: [], ...state };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([stored]));
}

async function settleOpening(): Promise<void> {
  await act(async () => { await vi.advanceTimersByTimeAsync(OPENING_SETTLED_MS); });
}

interface RenderedPlacement { left: number; top: number; width: number; height: number; minWidth: number; minHeight: number; }

function getRenderedPlacement(): RenderedPlacement {
  const element = document.querySelector(`window[data-window-id="${WINDOW_ID}"]`) as HTMLElement | null;
  if (element == null) throw new Error(`Window "${WINDOW_ID}" is not rendered.`);
  const { left, top, width, height, minWidth, minHeight } = element.style;
  return { left: parseFloat(left), top: parseFloat(top), width: parseFloat(width), height: parseFloat(height), minWidth: parseFloat(minWidth), minHeight: parseFloat(minHeight) };
}

function expectWhollyInsideHost(placement: RenderedPlacement): void {
  expect(placement.left).toBeGreaterThanOrEqual(0);
  expect(placement.top).toBeGreaterThanOrEqual(0);
  expect(placement.left + placement.width).toBeLessThanOrEqual(hostSize.width);
  expect(placement.top + placement.height).toBeLessThanOrEqual(hostSize.height);
}

beforeEach(() => {
  vi.useFakeTimers();
  window.localStorage.clear();
  hostSize = { width: 1024, height: 560 };
  laidOutWindowSize = undefined;
  reportHostSize();
});

afterEach(() => {
  vi.useRealTimers();
  restoreClientSizes();
  WindowsManager.remove(WINDOWS_DEFAULT_ID);
  window.localStorage.clear();
});

describe('window placement', () => {
  it('opens a window whose default size is bigger than the host wholly inside it', async () => {
    laidOutWindowSize = { width: 1100, height: 720 };
    const { getByText } = render(<Windows><OpenBigWindowOnMount /></Windows>);
    act(() => { getByText('Open').click(); });
    await settleOpening();

    const placement = getRenderedPlacement();
    expectWhollyInsideHost(placement);
    expect(placement).toMatchObject({ left: 0, top: 0, width: 1024, height: 560 });
  });

  it('caps a minimum size bigger than the host, so the browser cannot push the window past it', async () => {
    laidOutWindowSize = { width: 1100, height: 720 };
    const { getByText } = render(<Windows><OpenBigWindowOnMount /></Windows>);
    act(() => { getByText('Open').click(); });
    await settleOpening();

    const { minWidth, minHeight } = getRenderedPlacement();
    expect({ minWidth, minHeight }).toEqual({ minWidth: 1024, minHeight: 560 });
  });

  it('opens a window with a remembered size bigger than the host wholly inside it', async () => {
    persistWindow({ x: 40, y: 30, width: 1400, height: 900 });
    render(<Windows localStorageKey={STORAGE_KEY} />);
    await settleOpening();

    expect(getRenderedPlacement()).toMatchObject({ left: 0, top: 0, width: 1024, height: 560 });
  });

  it('pulls a remembered position that is now off screen back inside the host, clear of its edges', async () => {
    persistWindow({ x: 1900, y: 1000, width: 400, height: 300 });
    render(<Windows localStorageKey={STORAGE_KEY} />);
    await settleOpening();

    expect(getRenderedPlacement()).toMatchObject({ left: 608, top: 244, width: 400, height: 300 });
  });

  it('keeps a remembered placement that already fits exactly where it was', async () => {
    persistWindow({ x: 120, y: 80, width: 400, height: 300 });
    render(<Windows localStorageKey={STORAGE_KEY} />);
    await settleOpening();

    expect(getRenderedPlacement()).toMatchObject({ left: 120, top: 80, width: 400, height: 300 });
  });

  it('never lets a window scroll the page: the host clips anything outside it', () => {
    render(<Windows />);
    const host = document.getElementById(WINDOWS_DEFAULT_ID) as HTMLElement;

    expect(window.getComputedStyle(host).overflow).toBe('hidden');
  });
});
