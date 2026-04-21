# useDistributedState

Provides a shared reactive state container that can be created once and observed by multiple components independently. Observers re-render only when they explicitly subscribe, and the state can be passed through React context to coordinate state across the tree.

## Signature

```ts
// Create a new state from a factory function (optionally re-initialised when dependencies change)
function useDistributedState<T>(state: () => T, dependencies?: unknown[]): DistributedStateApi<T>

// Attach to an existing DistributedState ref (e.g. from context)
function useDistributedState<T>(state: DistributedState<T>): DistributedStateApi<T>
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `state` | `() => T` or `DistributedState<T>` | Yes | Either a factory to create local state, or a `DistributedState<T>` ref received from a context or parent. |
| `dependencies` | `unknown[]` | No | When using the factory form, re-initialises state when these change (default `[]`). |

## Returns

| Property | Type | Description |
|----------|------|-------------|
| `state` | `DistributedState<T>` | The opaque state ref, suitable for passing via context. |
| `get` | `() => T` | Returns the current value without subscribing. |
| `getAndObserve` | `() => T` | Returns the current value and subscribes this component to future changes. |
| `observe` | `() => void` | Subscribes the current component to re-render when the state changes. |
| `set` | `(value: T) => void` | Updates the state; notifies all observers if the value has changed. |
| `modify` | `(modifier: (value: T) => T) => void` | Derives the next state from the current value. |
| `onChange` | `(handler: (value: T) => void) => void` | Registers a callback that fires whenever the state changes. Cleaned up on unmount. |

## Usage

```tsx
import { useDistributedState, DistributedState } from '@anupheaus/react-ui';
import { createContext, useContext } from 'react';

// Create a context to share the state ref
const CountContext = DistributedState.createContext<number>();

function Provider({ children }: { children: React.ReactNode }) {
  const api = useDistributedState(() => 0);

  return (
    <CountContext.Provider value={api.state}>
      {children}
    </CountContext.Provider>
  );
}

function Counter() {
  const stateRef = useContext(CountContext)!;
  const { getAndObserve, set } = useDistributedState(stateRef);

  const count = getAndObserve(); // subscribes this component

  return <button onClick={() => set(count + 1)}>Count: {count}</button>;
}
```

---

[← Back to Hooks](../AGENTS.md)
