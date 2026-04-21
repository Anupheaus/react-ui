# useBatchUpdates

Returns a function that batches multiple React state updates into a single render cycle, and allows side-effect callbacks to be deferred until after the batch completes.

## Signature

```ts
function useBatchUpdates(): BatchUpdate
```

## Parameters

No parameters.

## Returns

Returns a `BatchUpdate` function with an additional `onComplete` method:

| Property | Type | Description |
|----------|------|-------------|
| `(delegate)` | `<T>(delegate: () => T) => T` | Wraps synchronous or async state-setting work in a batch. |
| `onComplete` | `(id: string, delegate: () => unknown) => void` | Schedules a callback to run after the current batch completes. If no batch is active, the callback runs immediately. |

## Usage

```tsx
import { useBatchUpdates } from '@anupheaus/react-ui';

function MyComponent() {
  const batchUpdate = useBatchUpdates();
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const handleClick = () => {
    batchUpdate(() => {
      setA(1);
      setB(2);
      // Both updates are flushed in a single render.
    });
  };

  return <button onClick={handleClick}>Update</button>;
}
```

---

[← Back to Hooks](../AGENTS.md)
