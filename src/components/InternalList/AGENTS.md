# InternalList

The core virtualised list engine used by both `List` and `Table`. It implements an `onRequest`-based lazy-loading protocol with DOM-height-driven virtualisation — only the items visible in the viewport (plus a small buffer) are rendered at any time. It is not intended to be used directly in application code, but understanding it is useful when working with `List` or `Table`.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `tagName` | `string` | Yes | HTML tag name applied to the root element (used for styling and test selectors). |
| `items` | `ReactListItem<T>[]` | No | Static item array. Use this **or** `onRequest`, not both. |
| `onRequest` | `(request: UseDataRequest, response: (data: UseDataResponse<ReactListItem<T>>) => void) => Promise<void>` | No | Async callback for paginated/lazy loading. See the `onRequest` / `response` contract below. |
| `gap` | `FlexProps['gap']` | No | Gap between items. Defaults to `4`. |
| `minWidth` | `FlexProps['minWidth']` | No | Minimum width of the list container. |
| `minHeight` | `FlexProps['minHeight']` | No | Minimum height of the list container. |
| `maxSelectableItems` | `number` | No | Maximum number of simultaneously selectable items. `0` disables selection. |
| `selectedItemIds` | `string[]` | No | Controlled selection state — array of selected item IDs. |
| `fullHeight` | `boolean` | No | When `true`, the scroller fills its parent's height. |
| `showSkeletons` | `boolean` | No | Show skeleton placeholders while items are loading. |
| `addTooltip` | `ReactNode` | No | Tooltip text for the built-in Add button. |
| `deleteTooltip` | `ReactNode` | No | Tooltip text shown on each item's delete control. |
| `stickyHeader` | `ReactNode` | No | Content rendered in a `StickyHideHeader` above the scrollable area. Hides on scroll down, reappears on scroll up. |
| `delayRenderingItems` | `boolean` | No | When `true`, item rendering is deferred by ~100 ms after mount (useful to avoid flash during animation). |
| `className` | `string` | No | Class applied to the root `Flex` container. |
| `contentClassName` | `string` | No | Class applied to the inner scroller content area. |
| `disableShadowsOnScroller` | `boolean` | No | Disable scroll-shadow decorations on the scroller. |
| `useParentScrollContext` | `boolean` | No | When `true`, the scroller consumes the nearest parent `ScrollContext` and reports scroll events to it (used by `Table` for sticky headers). |
| `actions` | `UseActions<InternalListActions>` | No | Ref-style callback to receive an `InternalListActions` handle. |
| `onScroll` | `(values: OnScrollEventData) => void` | No | Called on every scroll event. |
| `onScrollTopChange` | `(scrollTop: number) => void` | No | Called when the vertical scroll position changes (used for virtualisation bookkeeping). |
| `onItemsChange` | `(items: ReactListItem<T>[]) => void` | No | Called whenever the current item array changes. |
| `onSelectedItemsChange` | `(ids: string[]) => void` | No | Called whenever the set of selected item IDs changes. |
| `onActive` | `(event: ListItemEvent<T>, isActive: boolean) => void` | No | Called when an item gains or loses the active (hover/focus) state. |
| `onClick` | `(event: ListItemClickEvent<T>) => PromiseMaybe<void>` | No | Called when an item is clicked. |
| `onDelete` | `(event: ListItemEvent<T>) => void` | No | Called when an item's delete control is activated. |
| `onAdd` | `(event: MouseEvent<HTMLElement>) => PromiseMaybe<T \| void>` | No | Renders a built-in Add button in the sticky header when provided. |
| `onMouseEnter` | `(event: MouseEvent) => void` | No | Forwarded to the root container. |
| `onError` | `(error: Error) => void` | No | Called if the `onRequest` handler rejects or throws. |

### `InternalListActions`

Obtained via the `actions` prop:

| Method | Description |
|--------|-------------|
| `refresh()` | Re-issues the current data request, reloading visible items. |
| `scrollTo(value: number \| 'bottom')` | Programmatically scrolls to a pixel offset or to the bottom of the list. |

## `onRequest` / `response` contract

`onRequest` is the primary integration point for server-side or async data. The engine calls it whenever the visible window changes.

```ts
onRequest(request: UseDataRequest, response: (data: UseDataResponse<ReactListItem<T>>) => void): Promise<void>
```

**`UseDataRequest`**

```ts
interface UseDataRequest {
  requestId: string;          // Opaque ID — echo it back in the response
  pagination: DataPagination; // { offset?: number; limit: number }
}
```

**`UseDataResponse<T>`**

```ts
interface UseDataResponse<T> {
  requestId: string;  // Must match the request's requestId
  items: T[];         // The page of items for this request
  total: number;      // Total number of items in the full dataset
}
```

Key rules:
- Always call `response(...)` exactly once, even on errors (use `onError` to surface them separately).
- Echo the `requestId` back — stale responses with mismatched IDs are silently discarded.
- `total` drives virtualisation: the engine allocates invisible spacer elements above and below the rendered window to reproduce the correct scroll height.

## Usage

```tsx
import { InternalList } from '@anupheaus/react-ui';

// Static items
<InternalList tagName="my-list" items={myItems} />

// Lazy-loaded items
<InternalList
  tagName="my-list"
  showSkeletons
  onRequest={async ({ requestId, pagination }, respond) => {
    const page = await fetchPage(pagination.offset ?? 0, pagination.limit);
    respond({ requestId, items: page.items, total: page.total });
  }}
/>
```

## Architecture

```
InternalList
├── Scroller                   — scrollable viewport; fires onScroll
│   ├── StickyHideHeader       — optional header (add button, custom controls)
│   ├── lazy-load-header       — invisible spacer above the rendered window
│   ├── InternalListContextProvider  — distributes delete/select/active callbacks
│   │   └── InternalListItem × N     — one per visible item in the window
│   └── lazy-load-footer       — invisible spacer below the rendered window
└── (useItems hook)            — owns request lifecycle, skeleton generation
```

**Virtualisation algorithm:**
1. On each scroll event the component reads `containerElement.scrollHeight` and derives an average item height.
2. It calculates `requestOffset` and `requestLimit` based on the viewport height, average item height, and current scroll position.
3. It calls `request(...)` which ultimately invokes `onRequest`.
4. Header/footer spacers are sized to `offset * itemHeight` and `(total - offset - limit) * itemHeight` respectively, so the scroll bar reflects the full dataset even though only a slice is in the DOM.

---

## Related

- [../List/AGENTS.md](../List/AGENTS.md) — higher-level wrapper that adds `Field` container, validation, and selection binding on top of `InternalList`
- [../Table/AGENTS.md](../Table/AGENTS.md) — wraps `InternalList` for tabular data; converts records to `ReactListItem` internally
- [../../models/AGENTS.md](../../models/AGENTS.md) — `ReactListItem`, `UseDataRequest`, `UseDataResponse` — the item and request/response types this component is built around

---

[← Back to Components](../AGENTS.md)
