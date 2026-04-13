# useAPIGridRequest (useItems)

Manages paginated, virtualised item loading for grid/list components. It handles breaking requests into chunks, caching resolved items, and debounced state updates — supporting both a static in-memory array and an async `onRequest` callback as data sources.

> **Note:** The folder is named `useAPIGridRequest` but the exported hook is `useItems`. Import it as `useItems`.

## Signature

```ts
function useItems<T extends ListItemType>({
  initialLimit,
  items,
  actions,
  onRequest,
}: Props<T>): UseItemsResult<T>
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `initialLimit` | `number` | No | Initial page size (default `20`). |
| `items` | `T[]` | No | Static array of items; used when `onRequest` is not provided. |
| `actions` | `UseActions<UseItemsActions>` | No | Action bridge; exposes a `refresh()` method to the parent. |
| `onRequest` | `(request: UseDataRequest, response: (res: UseDataResponse<T>) => void) => Promise<void>` | No | Async callback invoked whenever a page is needed from a remote source. |

## Returns

| Property | Type | Description |
|----------|------|-------------|
| `items` | `(T \| DeferredPromise<T>)[]` | The currently visible slice of items. |
| `isLoading` | `boolean` | Whether any async requests are still in flight. |
| `total` | `number \| undefined` | Total number of items reported by the last response. |
| `limit` | `number` | Current page size. |
| `offset` | `number` | Current page start offset. |
| `error` | `Error \| undefined` | Any error thrown during the last request. |
| `request` | `(pagination: DataPagination) => void` | Triggers a new page request with the given pagination. |

## Usage

```tsx
import { useItems } from '@anupheaus/react-ui';

function MyGrid() {
  const { items, isLoading, total, request } = useItems({
    initialLimit: 50,
    onRequest: async ({ pagination }, respond) => {
      const data = await fetchPage(pagination);
      respond({ requestId: pagination.requestId, items: data.rows, total: data.count });
    },
  });

  return <VirtualList items={items} total={total} isLoading={isLoading} onPageChange={request} />;
}
```

---

[← Back to Hooks](../README.md)
