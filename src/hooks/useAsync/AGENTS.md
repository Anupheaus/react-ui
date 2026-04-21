# useAsync

Wraps an async (or sync) function so that it can be triggered from a component, tracking loading state, the last response value, and any error — while automatically cancelling in-flight requests on unmount or re-trigger.

## Signature

```ts
function useAsync<DelegateType extends AsyncDelegate>(
  delegate: DelegateType,
  dependencies?: unknown[],
  options?: { manuallyTriggered?: boolean }
): UseAsyncResult<DelegateType>
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `delegate` | `DelegateType` | Yes | The async function to manage. Receives a `UseAsyncState` context as `this` (with `requestId`, `onCancelled`, and `hasBeenCancelled`). |
| `dependencies` | `unknown[]` | No | Re-runs the delegate automatically when these change (default `[]`). If the delegate has parameters it is not auto-triggered — use `trigger` manually instead. |
| `options.manuallyTriggered` | `boolean` | No | When `true`, suppresses the automatic initial trigger even for zero-parameter delegates (default `false`). |

## Returns

| Property | Type | Description |
|----------|------|-------------|
| `trigger` | `(...args: Parameters<DelegateType>) => ReturnType<DelegateType>` | Manually invoke the async function. Cancels any in-flight request first. |
| `response` | `UnPromise<ReturnType<DelegateType>> \| undefined` | The most recently resolved value. |
| `isLoading` | `boolean` | Whether the delegate is currently awaiting a result. |
| `error` | `Error \| undefined` | Captured error from the last invocation (only populated when accessed). |
| `cancel` | `() => void` | Cancels the current in-flight request. |
| `onCancelled` | `(handler: UseAsyncCancelDelegate) => void` | Registers a global cancellation handler called with `{ requestId }`. |

## Usage

```tsx
import { useAsync } from '@anupheaus/react-ui';

function UserProfile({ userId }: { userId: string }) {
  const { response: user, isLoading, error } = useAsync(
    async () => fetchUser(userId),
    [userId]
  );

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <div>{user?.name}</div>;
}
```

### Manually triggered

```tsx
const { trigger, response, isLoading } = useAsync(
  async (id: string) => fetchUser(id),
  [],
);

return <button onClick={() => trigger('user-123')}>Load</button>;
```

---

[← Back to Hooks](../AGENTS.md)
