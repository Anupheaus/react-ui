# useOnChange

Runs a callback when specified dependencies change, skipping the initial mount — the opposite of `useEffect`'s default "run on mount" behaviour.

## Signature

```ts
function useOnChange(delegate: () => void, dependencies: unknown[]): void
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `delegate` | `() => void` | Yes | Callback to invoke on subsequent dependency changes |
| `dependencies` | `unknown[]` | Yes | Values to watch; `delegate` is called whenever any of these change after mount |

## Returns

Nothing (`void`).

## Usage

```tsx
useOnChange(() => {
  console.log('value changed:', value);
}, [value]);
```

---

[← Back to Hooks](../README.md)
