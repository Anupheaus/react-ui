import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import { DefaultTheme, ThemeProvider } from '../../theme';
import type { ReactListItem } from '../../models';
import type { ListOnRequest } from './List';
import { List } from './List';

const items: ReactListItem[] = [
  { id: 'item-1', text: 'Alpha' },
  { id: 'item-2', text: 'Beta' },
];

class MockIntersectionObserver {
  observe() { return undefined; }
  unobserve() { return undefined; }
  disconnect() { return undefined; }
}

class MockResizeObserver {
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
  Object.defineProperty(globalThis, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: MockResizeObserver,
  });
});

function renderList(children: React.ReactNode) {
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

    await waitFor(() => {
      expect(container.querySelector('list-content')).not.toBeNull();
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

  it('does not show the empty message while loading', async () => {
    const pendingRequest: ListOnRequest = () => new Promise<void>(() => void 0);
    const { container } = renderList(
      <List label="List" onRequest={pendingRequest} emptyMessage="Nothing here yet" />,
    );

    await waitFor(() => {
      expect(container.querySelector('list-content')).not.toBeNull();
    });

    expect(container.querySelector('list-empty-message')).toBeNull();
  });
});
