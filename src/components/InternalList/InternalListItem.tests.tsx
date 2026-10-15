import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { ReactListItem } from '../../models';
import { DefaultTheme, ThemeProvider } from '../../theme';
import { Dialogs } from '../Dialog/Dialogs';
import { List } from '../List';

// A row with an `onClick` is the thing you press, so it must work from the keyboard as well as the mouse: Enter or Space on
// a focused clickable row does what a click does. A row with no click does nothing, and a key typed into a control inside
// the row belongs to that control.
//
// A list item with a `tooltip` explains itself: the words show when the item is pointed at or reached with the
// keyboard, and a screen reader reads them with the item. An item without one renders as it always did.

class MockResizeObserver {
  observe() { return undefined; }
  unobserve() { return undefined; }
  disconnect() { return undefined; }
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'ResizeObserver', { writable: true, configurable: true, value: MockResizeObserver });
});

function renderList(items: React.ComponentProps<typeof List>['items']) {
  return render(<ThemeProvider theme={DefaultTheme}><Dialogs><List label="Things" items={items} /></Dialogs></ThemeProvider>);
}

const rowOf = async (text: string) => (await screen.findByText(text)).closest('list-item') as HTMLElement;

describe('InternalListItem keyboard activation', () => {
  it.each(['Enter', ' '])('fires a clickable row\'s onClick on %j', async key => {
    const onClick = vi.fn();
    renderList([{ id: 'one', text: 'Roller Blind', onClick }]);

    fireEvent.keyDown(await rowOf('Roller Blind'), { key });

    await waitFor(() => expect(onClick).toHaveBeenCalledTimes(1));
  });

  it('does nothing on a row that has no click', async () => {
    const onClick = vi.fn();
    renderList([{ id: 'one', text: 'Venetian Blind' }, { id: 'two', text: 'Roller Blind', onClick }]);

    fireEvent.keyDown(await rowOf('Venetian Blind'), { key: 'Enter' });

    expect(onClick).not.toHaveBeenCalled();
  });

  it('ignores other keys', async () => {
    const onClick = vi.fn();
    renderList([{ id: 'one', text: 'Roller Blind', onClick }]);

    fireEvent.keyDown(await rowOf('Roller Blind'), { key: 'a' });

    expect(onClick).not.toHaveBeenCalled();
  });

  it('leaves a key typed into an input inside the row to that input', async () => {
    const onClick = vi.fn();
    renderList([{ id: 'one', text: 'Roller Blind', onClick, label: <input aria-label="note" /> }]);

    fireEvent.keyDown(await screen.findByLabelText('note'), { key: 'Enter' });

    expect(onClick).not.toHaveBeenCalled();
  });
});

const OUTSTANDING_TOOLTIP = 'Anything still owed: unpaid and part-paid invoices together';

const ITEMS: ReactListItem[] = [
  { id: 'outstanding', text: 'Outstanding', tooltip: OUTSTANDING_TOOLTIP },
  { id: 'all', text: 'All' },
];

function renderTooltipList() {
  return render(<ThemeProvider theme={DefaultTheme}><List label="Status" items={ITEMS} /></ThemeProvider>);
}

const outstandingItem = async () => (await screen.findByText('Outstanding')).closest('list-item') as HTMLElement;

describe('List item tooltip', () => {
  it('shows the tooltip when the item is hovered', async () => {
    renderTooltipList();

    fireEvent.mouseOver(await outstandingItem());

    expect(await screen.findByText(OUTSTANDING_TOOLTIP)).toBeTruthy();
  });

  it('shows the tooltip when the item gets keyboard focus', async () => {
    renderTooltipList();

    fireEvent.focus(await outstandingItem());

    expect(await screen.findByText(OUTSTANDING_TOOLTIP)).toBeTruthy();
  });

  it('links the explanation to the item for screen readers', async () => {
    renderTooltipList();

    const describedBy = (await outstandingItem()).getAttribute('aria-describedby');

    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)?.textContent).toBe(OUTSTANDING_TOOLTIP);
  });

  it('renders an item without a tooltip as before: no description, no tooltip', async () => {
    renderTooltipList();

    const plainItem = (await screen.findByText('All')).closest('list-item') as HTMLElement;
    fireEvent.mouseOver(plainItem);

    expect(plainItem.getAttribute('aria-describedby')).toBeNull();
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
  });
});
