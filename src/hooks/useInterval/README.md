# useInterval

Sets up a repeating interval that calls the given function every `interval` milliseconds, and automatically clears it when the component unmounts. Returns a function to cancel the interval early.

## Signature

```ts
function useInterval(
  delegate: () => void,
  interval: number,
  options?: UseIntervalOptions
): () => void
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `delegate` | `() => void` | Yes | Function to call on each tick. |
| `interval` | `number` | Yes | Delay between ticks in milliseconds. |
| `options.dependencies` | `unknown[]` | No | Re-creates the interval when these change (default `[]`). |
| `options.triggerOnUnmount` | `boolean` | No | When `true`, calls `delegate` one final time on unmount if the interval is still active (default `false`). |

## Returns

Returns a `() => void` function that cancels the interval when called.

## Usage

```tsx
import { useInterval } from '@anupheaus/react-ui';

function PollingWidget() {
  const [data, setData] = useState(null);

  useInterval(async () => {
    const result = await fetchLatest();
    setData(result);
  }, 5000);

  return <div>{JSON.stringify(data)}</div>;
}
```

### Manual cancellation

```tsx
function Timer() {
  const [count, setCount] = useState(0);

  const cancel = useInterval(() => {
    setCount(c => c + 1);
  }, 1000);

  return (
    <>
      <div>Ticks: {count}</div>
      <button onClick={cancel}>Stop</button>
    </>
  );
}
```

---

[← Back to Hooks](../README.md)
