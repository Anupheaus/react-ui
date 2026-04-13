# useForceUpdate

Returns a stable function that, when called, forces the component to re-render. Safe to call during or after the render phase: if called while the component is already rendering, the re-render is deferred to after the current commit.

## Signature

```ts
function useForceUpdate(): () => void
```

## Parameters

No parameters.

## Returns

Returns a stable `() => void` function. Calling it triggers a re-render of the component. Calls are ignored after the component has unmounted.

## Usage

```tsx
import { useForceUpdate } from '@anupheaus/react-ui';

function LiveClock() {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const id = setInterval(forceUpdate, 1000);
    return () => clearInterval(id);
  }, []);

  return <time>{new Date().toLocaleTimeString()}</time>;
}
```

---

[← Back to Hooks](../README.md)
