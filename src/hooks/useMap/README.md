# useMap

Returns a stable `Map` instance that persists for the lifetime of the component without triggering re-renders when mutated.

## Signature

```ts
function useMap<K, V>(): Map<K, V>
```

## Returns

A stable `Map<K, V>` instance initialised once on mount.

## Usage

```tsx
const cache = useMap<string, number>();

cache.set('count', 42);
console.log(cache.get('count')); // 42
```

---

[← Back to Hooks](../README.md)
