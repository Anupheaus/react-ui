# UIStateProvider

Propagates UI state flags — `isLoading`, `isReadOnly`, and `isCompact` — through the component tree via React context, enabling components to react to inherited state without prop-drilling.

## When to mount

`UIStateProvider` is not a traditional `<Provider>` component; instead it exposes two entry points:

- **`UIState` component** — render it anywhere in the tree to set or override flags for its subtree. Flags are inherited from parent `UIState` nodes and can be overridden at any level.
- **`useUIState()` hook** — consume the current flags and optionally override them with local values.

No mandatory mount position; wrap any subtree section where you need to control loading or read-only state.

## Props (`UIState` component)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isLoading` | `boolean` | No | Marks the subtree as loading. Inherits parent loading state (`true` if either parent or this is `true`) |
| `isReadOnly` | `boolean` | No | Marks the subtree as read-only |
| `isCompact` | `boolean` | No | Marks the subtree as compact-layout mode |
| `children` | `ReactNode` | No | Content to wrap |

## Consuming

```tsx
import { UIState, useUIState } from '@anupheaus/react-ui';

// Wrap a section
<UIState isLoading={isFetching} isReadOnly={!canEdit}>
  <MyForm />
</UIState>

// Consume flags in a component
const { isLoading, isReadOnly, isCompact, useManagedUIState } = useUIState();

// Managed async loading state
const { waitOnProcess, ManagedUIState } = useManagedUIState();
<ManagedUIState>
  <button onClick={() => waitOnProcess(saveData)}>Save</button>
</ManagedUIState>
```

---

[← Back to Providers](../AGENTS.md)
