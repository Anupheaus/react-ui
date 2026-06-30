import type { ReactNode } from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DefaultTheme, ThemeProvider } from '../../theme';
import type { ReactListItem } from '../../models';
import type { ListActions, ListOnRequest } from './List';
import { List } from './List';

const items: ReactListItem[] = [
  { id: 'item-1', text: 'Alpha' },
  { id: 'item-2', text: 'Beta' },
];

function normaliseFooterCount(container: HTMLElement): string {
  return (container.querySelector('internal-list-footer-total')?.textContent ?? '').replace(/\s+/g, ' ').trim();
}

function renderList(children: ReactNode) {
  return render(
    <ThemeProvider theme={DefaultTheme}>
      <div style={{ width: 300, height: 400, display: 'flex' }}>
        {children}
      </div>
    </ThemeProvider>,
  );
}

function createListRequest(sourceItems: ReactListItem[]): ListOnRequest {
  return async ({ requestId, pagination: { offset = 0, limit } }, respondWith) => {
    respondWith({
      requestId,
      items: sourceItems.slice(offset, offset + limit),
      total: sourceItems.length,
    });
  };
}

const emptyListRequest: ListOnRequest = async ({ requestId }, respondWith) => {
  respondWith({ requestId, items: [], total: 0 });
};

describe('List', () => {
  it('shows the provided empty message when there are no items', async () => {
    const { container, getByText } = renderList(
      <List label="List" onRequest={emptyListRequest} emptyMessage="Nothing here yet" />,
    );

    await waitFor(() => {
      expect(getByText('Nothing here yet')).not.toBeNull();
    });

    expect(container.querySelectorAll('list-item')).toHaveLength(0);
  });

  it('shows the default empty message when emptyMessage is omitted', async () => {
    const { getByText } = renderList(
      <List label="List" onRequest={emptyListRequest} />,
    );

    await waitFor(() => {
      expect(getByText('No items to display')).not.toBeNull();
    });
  });

  it('renders no empty-state UI when emptyMessage is null', async () => {
    const { container } = renderList(
      <List label="List" onRequest={emptyListRequest} emptyMessage={null} />,
    );

    // Wait until the data source has confirmed `total === 0` (the footer reports "0 items")
    // before asserting the empty-state element is absent, otherwise the assertion could pass
    // simply because the list is still in its initial loading state.
    await waitFor(() => {
      expect(normaliseFooterCount(container)).toBe('0 items');
    });

    expect(container.querySelector('list-empty-message')).toBeNull();
  });

  it('does not show the empty message when items are returned', async () => {
    const { container, getByText } = renderList(
      <List label="List" onRequest={createListRequest(items)} emptyMessage="Nothing here yet" />,
    );

    await waitFor(() => {
      expect(getByText('Alpha')).not.toBeNull();
    });

    expect(container.querySelector('list-empty-message')).toBeNull();
  });

  it('renders a React element empty message', async () => {
    const { container } = renderList(
      <List label="List" onRequest={emptyListRequest} emptyMessage={<span data-testid="custom-empty">Custom</span>} />,
    );

    await waitFor(() => {
      expect(container.querySelector('[data-testid="custom-empty"]')).not.toBeNull();
    });
  });

  it('hides the empty message while a re-request is in flight even though total is 0', async () => {
    // Each onRequest call is captured but never auto-resolves, so the test controls exactly
    // when (and with what total) each request responds.
    const pendingCalls: Array<(total: number) => void> = [];
    const request: ListOnRequest = (req, respondWith) => new Promise<void>(() => {
      pendingCalls.push((total: number) => respondWith({ requestId: req.requestId, items: [], total }));
    });

    let listActions: ListActions | undefined;
    const { container } = renderList(
      <List label="List" onRequest={request} emptyMessage="Nothing here yet" actions={a => { listActions = a; }} />,
    );

    // Resolve the initial request with an empty result so we reach total === 0 and the message shows.
    await waitFor(() => expect(pendingCalls).toHaveLength(1));
    await act(async () => { pendingCalls[0](0); });
    await waitFor(() => expect(container.querySelector('list-empty-message')).not.toBeNull());

    // Trigger re-requests. The first stays in flight (keeping isLoading true) while the second
    // responds with total === 0, so the list settles on total === 0 with a request still loading.
    await act(async () => { listActions!.refresh(); });
    await act(async () => { listActions!.refresh(); });
    await waitFor(() => expect(pendingCalls).toHaveLength(3));
    await act(async () => { pendingCalls[2](0); });

    // Once the latest request reports total === 0 the loading skeletons disappear (so there are no
    // `list-item`s), proving total === 0 has been processed. A request is still in flight
    // (isLoading === true), so the guard must keep the empty message hidden despite total === 0.
    await waitFor(() => {
      expect(container.querySelectorAll('list-item')).toHaveLength(0);
      expect(container.querySelector('list-empty-message')).toBeNull();
    });
    expect(normaliseFooterCount(container)).toBe('0 items');
  });
});
