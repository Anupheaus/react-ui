import { act, renderHook } from '@testing-library/react';
import { useItems } from './useItems';
import type { UseDataRequest, UseDataResponse } from '../../extensions';
import type { ReactListItem } from '../../models';

type Item = { name: string };

function makeRequest(items: ReactListItem<Item>[]) {
  return async (req: UseDataRequest, respond: (r: UseDataResponse<ReactListItem<Item>>) => void) => {
    respond({ requestId: req.requestId, items, total: items.length });
  };
}

describe('useItems', () => {
  it('populates items from the onRequest response', async () => {
    const items: ReactListItem<Item>[] = [{ id: '1', text: 'Alice', data: { name: 'Alice' } }];
    const { result } = renderHook(() =>
      useItems<Item>({ onRequest: makeRequest(items) })
    );
    // Wait for the async request and debounced updates (default debounce is 25-150ms)
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('1');
  });

  it('isLoading starts as true when data is initially loading', async () => {
    const items: ReactListItem<Item>[] = [{ id: '1', text: 'Alice', data: { name: 'Alice' } }];
    const { result } = renderHook(() =>
      useItems<Item>({ onRequest: makeRequest(items) })
    );
    // isLoading should be true initially because the request is in flight
    expect(result.current.isLoading).toBe(true);

    // After response and processing, items should be populated
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
    });
    expect(result.current.items).toHaveLength(1);
  });

  it('renders static items prop without calling onRequest', () => {
    const items: ReactListItem<Item>[] = [
      { id: '1', text: 'Bob', data: { name: 'Bob' } },
      { id: '2', text: 'Carol', data: { name: 'Carol' } },
    ];
    const { result } = renderHook(() => useItems<Item>({ items }));
    expect(result.current.items).toHaveLength(2);
  });

  it('refresh() triggers a new request', async () => {
    const requestFn = vi.fn(async (req: UseDataRequest, respond: (r: UseDataResponse<ReactListItem<Item>>) => void) => {
      respond({ requestId: req.requestId, items: [], total: 0 });
    });
    const { result } = renderHook(() => useItems<Item>({ onRequest: requestFn }));
    await act(async () => {});
    const callsBefore = requestFn.mock.calls.length;
    await act(async () => { result.current.request({ offset: 0, limit: 20 }); });
    expect(requestFn.mock.calls.length).toBeGreaterThan(callsBefore);
  });
});
