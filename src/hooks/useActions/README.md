# useActions

Creates a bridge that lets a parent component call methods defined inside a child component. The child registers its action implementations via `setActions`, and the parent invokes those methods through the returned proxy object.

## Signature

```ts
function useActions<T extends {}>(): UseActionsApi<T>
```

## Parameters

No parameters.

## Returns

Returns a `UseActionsApi<T>` proxy object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `hasActions` | `boolean` | Whether actions have been registered by the child. |
| `setActions` | `(actions: T) => void` | Called by the child component to register its action implementations. |
| `waitOnActions` | `(timeout?: number) => Promise<void>` | Waits until actions are registered, or rejects after the given timeout (default 100 ms). |
| `setMappedActions` | `(id: string \| number) => (actions: T) => void` | Registers actions keyed by an id, for managing multiple children. |
| `getMappedActions` | `(id: string \| number) => T & { hasActions: boolean }` | Retrieves the action proxy for a specific child id. |
| `[method]` | `(...args) => any` | Any property on `T` is forwarded to the currently registered actions. |

## Usage

```tsx
import { useActions, UseActions } from '@anupheaus/react-ui';

interface ChildActions {
  focus(): void;
  reset(): void;
}

// In the parent component:
function Parent() {
  const childActions = useActions<ChildActions>();

  return (
    <>
      <Child setActions={childActions.setActions} />
      <button onClick={() => childActions.focus()}>Focus child</button>
    </>
  );
}

// In the child component:
interface ChildProps {
  setActions: UseActions<ChildActions>;
}

function Child({ setActions }: ChildProps) {
  setActions({
    focus: () => { /* ... */ },
    reset: () => { /* ... */ },
  });
  return <div />;
}
```

---

[← Back to Hooks](../README.md)
