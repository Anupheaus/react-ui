import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import type { ReactListItem } from '../../models';
import { DefaultTheme, ThemeProvider } from '../../theme';
import type { ListOnRequest } from './List';
import { List } from './List';

// The footer count is the list's true total. Staff read it as "how many there are", so a long list given all its items
// up front must not count only the rows drawn so far (an appointment with 30 changes said "23 changes", sc-2502).

class MockResizeObserver {
  observe() { return undefined; }
  unobserve() { return undefined; }
  disconnect() { return undefined; }
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'ResizeObserver', { writable: true, configurable: true, value: MockResizeObserver });
});

/**
 * More than the 50 rows the list asks for before it has measured anything (jsdom never measures), so a count of the rows
 * loaded so far would be wrong. The real-browser case (30 rows in a space for about 10) is the List story
 * CountsEveryItemBeforeScrolling.
 */
const LONG_LIST_LENGTH = 60;

const createItems = (count: number): ReactListItem[] => new Array(count).fill(0).map((_, index) => ({
  id: `change-${index + 1}`,
  text: `Change ${index + 1}`,
  ordinal: index,
}));

function renderInTheme(children: React.ReactNode) {
  return render(<ThemeProvider theme={DefaultTheme}>{children}</ThemeProvider>);
}

describe('List footer count', () => {
  it('shows the total of a long list given all its items up front, before any scrolling', async () => {
    renderInTheme(<List items={createItems(LONG_LIST_LENGTH)} unitName="change" />);
    expect(await screen.findByText('60 changes')).toBeTruthy();
  });

  it('changes by one straight away when an item is added or removed', async () => {
    const { rerender } = renderInTheme(<List items={createItems(LONG_LIST_LENGTH)} unitName="change" />);
    await screen.findByText('60 changes');
    rerender(<ThemeProvider theme={DefaultTheme}><List items={createItems(LONG_LIST_LENGTH + 1)} unitName="change" /></ThemeProvider>);
    expect(await screen.findByText('61 changes')).toBeTruthy();
    rerender(<ThemeProvider theme={DefaultTheme}><List items={createItems(LONG_LIST_LENGTH - 1)} unitName="change" /></ThemeProvider>);
    expect(await screen.findByText('59 changes')).toBeTruthy();
  });

  it('shows its empty message when it has no items', async () => {
    renderInTheme(<List items={[]} unitName="change" emptyMessage="No changes yet" />);
    expect(await screen.findByText('No changes yet')).toBeTruthy();
  });

  it('shows the server total for a list that pages from the server', async () => {
    const SERVER_TOTAL = 500;
    const serverItems = createItems(SERVER_TOTAL);
    const onRequest: ListOnRequest = async ({ requestId, pagination: { offset = 0, limit } }, respond) => {
      respond({ requestId, items: serverItems.slice(offset, offset + limit), total: SERVER_TOTAL });
    };
    renderInTheme(<List onRequest={onRequest} unitName="change" />);
    expect(await screen.findByText('500 changes')).toBeTruthy();
  });

  it('hides the count when asked to', async () => {
    renderInTheme(<List items={createItems(LONG_LIST_LENGTH)} unitName="change" hideRecordCount />);
    await screen.findByText('Change 1');
    expect(screen.queryByText(/changes$/)).toBeNull();
  });
});
