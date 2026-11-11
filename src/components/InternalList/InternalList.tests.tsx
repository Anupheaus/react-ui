import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactListItem } from '../../models';
import { DefaultTheme, ThemeProvider } from '../../theme';
import { Dialogs } from '../Dialog/Dialogs';
import { List } from '../List';

// A list whose rows wrap to different heights (a history of "Moved from ... to ... by ..." lines) used to re-measure for
// ever: the row height came from the first rendered row, every window started on a different row, and each new height
// moved the window. React stopped with "Maximum update depth exceeded" and the page went blank. The list now settles:
// after a few changes it holds its height until its items change.

const LIST_HEIGHT = 400;
/** Far more rows than the list ever draws at once, so some are always left below the window. */
const ROW_COUNT = 300;
/** How many times the rows' height is changed in a row: far more than the list may follow. */
const MEASURE_COUNT = 40;
/** Long enough for the list's debounced row requests to land. */
const SETTLE_MS = 400;

const resizeCallbacks: Array<() => void> = [];

class MockResizeObserver {
  constructor(callback: () => void) { resizeCallbacks.push(callback); }
  observe() { return undefined; }
  unobserve() { return undefined; }
  disconnect() { return undefined; }
}

let rowHeight = 40;

const buildItems = (count: number): ReactListItem[] => Array.from({ length: count }, (_, index) => ({ id: `row-${index}`, text: `Row ${index}`, ordinal: index }));

beforeEach(() => {
  resizeCallbacks.length = 0;
  Object.defineProperty(globalThis, 'ResizeObserver', { writable: true, configurable: true, value: MockResizeObserver });
  // jsdom has no layout: report the list's height and every row's height straight from the element.
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function getBoundingClientRect(this: Element) {
    if (this.tagName === 'LIST-ITEM') return { height: rowHeight } as DOMRect;
    if (this.tagName === 'SCROLLER-CONTAINER') return { height: LIST_HEIGHT } as DOMRect;
    return { height: 0 } as DOMRect;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

const listOf = (count: number) => <ThemeProvider theme={DefaultTheme}><Dialogs><List label="Changes" items={buildItems(count)} fullHeight /></Dialogs></ThemeProvider>;

/** The space the list keeps for the rows below its window: it moves whenever the list changes its row height. */
const footerHeight = (): string => (document.querySelector('lazy-load-footer') as HTMLElement).style.height;

/** The rows now measure `height` and the list's content has resized, as it does when the rows' text wraps differently. */
async function resizeRowsTo(height: number): Promise<void> {
  rowHeight = height;
  await act(async () => { resizeCallbacks.forEach(callback => callback()); });
}

describe('InternalList when its measured row height keeps changing', () => {
  it('stops following the measures after a few changes, so it can never re-render without end', async () => {
    rowHeight = 40;
    render(listOf(ROW_COUNT));
    await screen.findByText('Row 0');

    const seen = new Set<string>([footerHeight()]);
    // Alternating tall and short measures, many more than the list may follow.
    for (let measure = 0; measure < MEASURE_COUNT; measure += 1) {
      await resizeRowsTo(measure % 2 === 0 ? 100 : 20);
      seen.add(footerHeight());
    }

    // Written independently of the code: the starting height plus at most three changes.
    expect(seen.size).toBeLessThanOrEqual(4);
  });

  it('follows the measures again once its items change', async () => {
    rowHeight = 40;
    const { rerender } = render(listOf(ROW_COUNT));
    await screen.findByText('Row 0');
    for (let measure = 0; measure < MEASURE_COUNT; measure += 1) await resizeRowsTo(measure % 2 === 0 ? 100 : 20);
    // Let the list's own debounced requests for rows finish, so only the row height can move the footer.
    await act(async () => { await new Promise(resolve => setTimeout(resolve, SETTLE_MS)); });
    // Held: more measures change nothing.
    const held = new Set<string>();
    for (let measure = 0; measure < 6; measure += 1) {
      await resizeRowsTo(measure % 2 === 0 ? 100 : 20);
      held.add(footerHeight());
    }
    expect(held.size).toBe(1);

    rerender(listOf(ROW_COUNT - 10));
    await screen.findByText('Row 0');
    await act(async () => { await new Promise(resolve => setTimeout(resolve, SETTLE_MS)); });
    await resizeRowsTo(100);
    const followed = new Set<string>();
    for (let measure = 0; measure < 6; measure += 1) {
      await resizeRowsTo(measure % 2 === 0 ? 20 : 100);
      followed.add(footerHeight());
    }

    expect(followed.size).toBeGreaterThan(1);
  });
});
