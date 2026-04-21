# useItems

Manages paginated, async-loaded lists of items with loading state, skeleton placeholders, and optional selection persistence. Handles both static item arrays and request-based data fetching.

## Signature

```ts
function useItems<T = void>(props: UseItemsProps<T>): UseItemsResult<T>
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `initialLimit` | `number` | No | Number of items to load per page (default: `20`) |
| `items` | `ReactListItem<T>[]` | No | Static array of items; used when `onRequest` is not provided |
| `selectedItemIds` | `string[]` | No | IDs of currently selected items; persisted across refreshes |
| `useSkeletons` | `boolean` | No | Show skeleton placeholder items while loading (default: `false`) |
| `actions` | `UseActions<UseItemsActions>` | No | Exposes a `refresh()` action to the parent |
| `onRequest` | `(request, response) => Promise<void>` | No | Async data-fetch callback invoked with pagination parameters |
| `onItemsChange` | `(items) => void` | No | Called (debounced) whenever the resolved item list changes |

## Returns

An object containing:

| Field | Type | Description |
|-------|------|-------------|
| `items` | `ReactListItem<T>[]` | Current page of (possibly skeleton) items |
| `isLoading` | `boolean` | Whether a fetch is in progress |
| `total` | `number \| undefined` | Total number of available items reported by the data source |
| `limit` | `number` | Current page size |
| `offset` | `number` | Current page offset |
| `error` | `Error \| undefined` | Last fetch error, if any |
| `request` | `(pagination: DataPagination) => void` | Trigger a new page request |

## Usage

```tsx
const { items, isLoading, total, request } = useItems<MyData>({
  initialLimit: 20,
  useSkeletons: true,
  onRequest: async ({ pagination }, respond) => {
    const { items, total } = await fetchPage(pagination);
    respond({ requestId: pagination.requestId, items, total });
  },
});
```

---

[← Back to Hooks](../AGENTS.md)
