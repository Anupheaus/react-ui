# useRef

A thin wrapper around React's `useRef` that initialises the ref value from a factory function exactly once, avoiding the need for a separate `useMemo` call.

## Signature

```ts
function useRef<T>(delegate: () => T): React.MutableRefObject<T>
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `delegate` | `() => T` | Yes | Factory function called once on mount to produce the initial ref value |

## Returns

A `React.MutableRefObject<T>` whose `.current` is set to the result of `delegate()` and never reset on re-render.

## Usage

```tsx
const mapRef = useRef(() => new Map<string, number>());

mapRef.current.set('key', 1);
```

---

[← Back to Hooks](../README.md)
