# useBound

Returns a stable function reference that always delegates to the latest version of the provided callback, preventing unnecessary re-renders caused by changing function identities.

This module also exports `useDelegatedBound` for creating stable factories that return per-argument stable callbacks.

## Signature

```ts
function useBound<T extends Function>(delegate: T): T
```

```ts
function useDelegatedBound<T extends AnyFunction>(delegate: T): T
```

## Parameters

### `useBound`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `delegate` | `T` | Yes | The function to stabilise. The returned function always calls the latest version of this delegate. |

### `useDelegatedBound`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `delegate` | `T` | Yes | A factory function `(...args) => fn`. Returns a stable wrapper that, when called with the same arguments, always returns the same stable inner function reference. |

## Returns

### `useBound`

Returns a stable `T` whose identity never changes across renders, but always invokes the most recent `delegate`.

### `useDelegatedBound`

Returns a stable `T`. Calling it with the same arguments always returns the same stable inner function (keyed by a JSON-stringified argument signature).

## Usage

```tsx
import { useBound, useDelegatedBound } from '@anupheaus/react-ui';

// useBound — stable event handler
function SearchBox({ onSearch }: { onSearch(query: string): void }) {
  const handleChange = useBound((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  });

  return <input onChange={handleChange} />;
}

// useDelegatedBound — stable per-id handler factory
function ItemList({ items }: { items: { id: string }[] }) {
  const handleDelete = useDelegatedBound((id: string) => () => {
    deleteItem(id);
  });

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <button onClick={handleDelete(item.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

---

[← Back to Hooks](../AGENTS.md)
