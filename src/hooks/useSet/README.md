# useSet

Returns a stable `Set` instance that persists for the lifetime of the component without triggering re-renders when mutated.

## Signature

```ts
function useSet<T>(): Set<T>
```

## Returns

A stable `Set<T>` instance initialised once on mount.

## Usage

```tsx
const seen = useSet<string>();

seen.add('item-1');
console.log(seen.has('item-1')); // true
```

---

[← Back to Hooks](../README.md)
