import { act, fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import { useBound } from '../../hooks';
import { Windows } from './Windows';
import { createWindow } from './createWindow';
import { useWindow } from './useWindow';
import { WindowsManager, WINDOWS_DEFAULT_ID } from './WindowsManager';
import type { WindowState } from './WindowsModels';

// A window opened from within another window (e.g. "Add task" in the Tasks window) must come to the front, above
// the window it was opened from — whatever state the opener is in when the user clicks.

const STORAGE_KEY = 'window-stacking-tests';
const OPENER_ID = 'stacking-opener';
const CHILD_ID = 'stacking-child';
/** Longer than any window event (opening, focusing) is allowed to stay pending. */
const ALL_WINDOW_EVENTS_SETTLED_MS = 5_000;

const StackingChildWindow = createWindow('StackingChildWindow', ({ Window, Content }) => () => (
  <Window title="Child">
    <Content>child</Content>
  </Window>
));

function OpenChildButton() {
  const { openStackingChildWindow } = useWindow(StackingChildWindow);
  const openChild = useBound(() => { void openStackingChildWindow(CHILD_ID); });
  return <button onClick={openChild}>Open child</button>;
}

const StackingOpenerWindow = createWindow('StackingOpenerWindow', ({ Window, Content }) => () => (
  <Window title="Opener">
    <Content><OpenChildButton /></Content>
  </Window>
));

function persistWindows(states: WindowState[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
}

function openerState(): WindowState {
  return { id: OPENER_ID, definitionId: OPENER_ID, windowTypeName: StackingOpenerWindow.name, args: [], x: 10, y: 10, width: 400, height: 300 };
}

function getWindowElement(id: string): HTMLElement {
  const element = document.querySelector(`window[data-window-id="${id}"]`);
  if (element == null) throw new Error(`Window "${id}" is not rendered.`);
  return element as HTMLElement;
}

/** What the user does to press a button inside a window: the press focuses that window, then the click fires. */
function pressButton(name: string): void {
  const button = Array.from(document.querySelectorAll('button')).find(element => element.textContent === name);
  if (button == null) throw new Error(`Button "${name}" is not rendered.`);
  fireEvent.mouseDown(button);
  fireEvent.mouseUp(button);
  fireEvent.click(button);
}

async function settleWindowEvents(): Promise<void> {
  await act(async () => { await vi.advanceTimersByTimeAsync(ALL_WINDOW_EVENTS_SETTLED_MS); });
}

beforeEach(() => {
  vi.useFakeTimers();
  window.localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  WindowsManager.remove(WINDOWS_DEFAULT_ID);
  window.localStorage.clear();
});

describe('a window opened from within another window', () => {
  it('opens in front of a persisted opener that is still restoring', async () => {
    persistWindows([openerState()]);
    render(<Windows localStorageKey={STORAGE_KEY} />);
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });

    pressButton('Open child');
    await settleWindowEvents();

    expect(WindowsManager.get(WINDOWS_DEFAULT_ID).entries.ids()).toEqual([OPENER_ID, CHILD_ID]);
  });

  it('is shown on top and focused, with the opener behind it', async () => {
    persistWindows([openerState()]);
    render(<Windows localStorageKey={STORAGE_KEY} />);
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });

    pressButton('Open child');
    await settleWindowEvents();

    const child = getWindowElement(CHILD_ID);
    const opener = getWindowElement(OPENER_ID);
    expect(Number(child.style.zIndex)).toBeGreaterThan(Number(opener.style.zIndex));
    expect(child).not.toHaveClass('is-not-focused');
    expect(opener).toHaveClass('is-not-focused');
  });

  it('opens in front of an opener that had finished opening', async () => {
    persistWindows([openerState()]);
    render(<Windows localStorageKey={STORAGE_KEY} />);
    await settleWindowEvents();

    pressButton('Open child');
    await settleWindowEvents();

    expect(WindowsManager.get(WINDOWS_DEFAULT_ID).entries.ids()).toEqual([OPENER_ID, CHILD_ID]);
  });

  it('opens in front when the opener sat behind another window before it was pressed', async () => {
    const otherState: WindowState = { ...openerState(), id: 'stacking-other', definitionId: 'stacking-other', windowTypeName: StackingChildWindow.name };
    persistWindows([openerState(), otherState]);
    render(<Windows localStorageKey={STORAGE_KEY} />);
    await settleWindowEvents();

    pressButton('Open child');
    await settleWindowEvents();

    expect(WindowsManager.get(WINDOWS_DEFAULT_ID).entries.ids().last()).toBe(CHILD_ID);
  });
});
