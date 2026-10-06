import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import type { ReactListItem } from '../../models';
import { DefaultTheme, ThemeProvider } from '../../theme';
import { List } from '../List';

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

const OUTSTANDING_TOOLTIP = 'Anything still owed: unpaid and part-paid invoices together';

const ITEMS: ReactListItem[] = [
  { id: 'outstanding', text: 'Outstanding', tooltip: OUTSTANDING_TOOLTIP },
  { id: 'all', text: 'All' },
];

function renderList() {
  return render(<ThemeProvider theme={DefaultTheme}><List label="Status" items={ITEMS} /></ThemeProvider>);
}

const outstandingItem = async () => (await screen.findByText('Outstanding')).closest('list-item') as HTMLElement;

describe('List item tooltip', () => {
  it('shows the tooltip when the item is hovered', async () => {
    renderList();

    fireEvent.mouseOver(await outstandingItem());

    expect(await screen.findByText(OUTSTANDING_TOOLTIP)).toBeTruthy();
  });

  it('shows the tooltip when the item gets keyboard focus', async () => {
    renderList();

    fireEvent.focus(await outstandingItem());

    expect(await screen.findByText(OUTSTANDING_TOOLTIP)).toBeTruthy();
  });

  it('links the explanation to the item for screen readers', async () => {
    renderList();

    const describedBy = (await outstandingItem()).getAttribute('aria-describedby');

    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)?.textContent).toBe(OUTSTANDING_TOOLTIP);
  });

  it('renders an item without a tooltip as before: no description, no tooltip', async () => {
    renderList();

    const plainItem = (await screen.findByText('All')).closest('list-item') as HTMLElement;
    fireEvent.mouseOver(plainItem);

    expect(plainItem.getAttribute('aria-describedby')).toBeNull();
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
  });
});
