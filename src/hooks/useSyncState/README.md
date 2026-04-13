# useSyncState

Provides a synchronously-readable state value backed by a ref, so that the latest state is always accessible in callbacks and async code without stale-closure issues. Triggers a re-render whenever the value changes.

## Signature

```ts
function useSyncState<S>(): SyncState<S | undefined>
function useSyncState<S>(initialState: () => S): SyncState<S>
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `initialState` | `() => S` | No | Factory function that produces the initial state value |

## Returns

An object with:

| Field | Type | Description |
|-------|------|-------------|
| `state` | `S \| undefined` | Current state value (always up-to-date) |
| `setState` | `(state: S \| ((prev: S) => S)) => void` | Updates state; accepts a value or an updater function; skips update if deeply equal |
| `getState` | `() => S \| undefined` | Synchronously returns the latest state — safe to call inside closures and async callbacks |

## Usage

```tsx
const { state, setState, getState } = useSyncState<number>(() => 0);

const handleAsync = async () => {
  await delay(1000);
  // getState() always returns the current value, not a stale closure value
  setState(getState()! + 1);
};
```

---

[← Back to Hooks](../README.md)
