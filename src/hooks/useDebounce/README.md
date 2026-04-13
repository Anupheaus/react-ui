# useDebounce

Wraps a function so that it is only called after a given delay has elapsed since the last invocation. Optionally accepts a maximum wait time to ensure the function is called eventually even under rapid invocation.

## Signature

```ts
function useDebounce<TFunc extends Function>(delegate: TFunc, ms: number, longestMs?: number): TFunc
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `delegate` | `TFunc` | Yes | The function to debounce. |
| `ms` | `number` | Yes | The debounce delay in milliseconds. Each new call resets the timer. |
| `longestMs` | `number` | No | Maximum time in milliseconds to wait before forcing a call regardless of continued invocations. Defaults to `0` (disabled). |

## Returns

Returns a debounced version of `delegate` with the same signature as `TFunc`. The returned function is stable across renders.

## Usage

```tsx
import { useDebounce } from '@anupheaus/react-ui';

function SearchInput() {
  const [results, setResults] = useState([]);

  const search = useDebounce(async (query: string) => {
    const data = await fetchResults(query);
    setResults(data);
  }, 300);

  return <input onChange={e => search(e.target.value)} />;
}
```

### With maximum wait time

```tsx
// Will call at most every 1000 ms even if the user keeps typing
const search = useDebounce(performSearch, 300, 1000);
```

---

[← Back to Hooks](../README.md)
