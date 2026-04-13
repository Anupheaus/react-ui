# useUpdatableState

Like `useState`, but re-derives state from a factory function whenever specified dependencies change, allowing external data to flow in while still supporting imperative `setState` updates.

## Signature

```ts
function useUpdatableState<T>(delegate: (prevState?: T) => T, dependencies: unknown[]): [T, Dispatch<SetStateAction<T>>]
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `delegate` | `(prevState?: T) => T` | Yes | Factory called on mount and whenever `dependencies` change; receives the previous state so it can carry values forward |
| `dependencies` | `unknown[]` | Yes | Values to watch; when any change the factory is re-run to compute the new state |

## Returns

A tuple of `[state: T, setState: Dispatch<SetStateAction<T>>]` — the same shape as `useState`.

## Usage

```tsx
const [config, setConfig] = useUpdatableState(
  (prev) => ({ ...defaultConfig, ...externalConfig, ...(prev ?? {}) }),
  [externalConfig],
);

// Imperative update still works
<button onClick={() => setConfig(c => ({ ...c, darkMode: true }))}>
  Enable dark mode
</button>
```

---

[← Back to Hooks](../README.md)
