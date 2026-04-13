# useCallbacks

Creates a shared callback registry that multiple components or hooks can register handlers into. All registered handlers are invoked together when `invoke` is called, with support for render-phase awareness.

## Signature

```ts
function useCallbacks<T extends CallbackFunction = () => void>(): UseCallbacks<T>
```

## Parameters

No parameters. The generic parameter `T` defines the signature of the callback functions.

## Returns

| Property | Type | Description |
|----------|------|-------------|
| `invoke` | `T` | Calls all currently registered handlers in parallel. |
| `register` | `(delegate: AddCallbackState<T>) => void` | Registers a handler in the current component. The handler is automatically removed when the component unmounts. Receives a `CallbackState` context via `this` with `isDuringRenderPhase` and `waitOnRenderPhaseComplete`. |
| `registerOutOfRenderPhaseOnly` | `(delegate: AddCallbackState<T>, options?: { timeout?: number; updateAfterTimeout?: number }) => void` | Like `register`, but the handler waits for the render phase to finish before executing (useful for DOM operations that must run post-commit). |

## Usage

```tsx
import { useCallbacks } from '@anupheaus/react-ui';

// Create the callbacks instance (typically in a parent or shared context)
function useSharedEvent() {
  const callbacks = useCallbacks<(value: string) => void>();
  return callbacks;
}

// In a provider / orchestrator:
function Parent() {
  const onChange = useCallbacks<(value: string) => void>();

  const triggerChange = () => onChange.invoke('new-value');

  return (
    <>
      <button onClick={triggerChange}>Trigger</button>
      <Child onRegister={onChange.register} />
    </>
  );
}

// In a child component:
function Child({ onRegister }: { onRegister: UseCallbacks<(v: string) => void>['register'] }) {
  onRegister(function (value) {
    console.log('received:', value);
  });
  return null;
}
```

---

[← Back to Hooks](../README.md)
