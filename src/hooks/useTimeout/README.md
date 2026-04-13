# useTimeout

Schedules a callback to fire after a delay, automatically cancelling and rescheduling when dependencies change, and cleaning up on unmount.

## Signature

```ts
function useTimeout(delegate: () => void, timeout: number, options?: UseTimeoutOptions): () => void
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `delegate` | `() => void` | Yes | Function to call when the timeout fires |
| `timeout` | `number` | Yes | Delay in milliseconds |
| `options` | `UseTimeoutOptions` | No | Additional options (see below) |

### `UseTimeoutOptions`

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `dependencies` | `unknown[]` | No | When these change the existing timeout is cancelled and a new one is scheduled (default: `[]`) |
| `triggerOnUnmount` | `boolean` | No | If `true` and the timeout is still pending when the component unmounts, `delegate` is called immediately (default: `false`) |

## Returns

A `cancel` function `() => void` that clears the pending timeout when called.

## Usage

```tsx
const cancel = useTimeout(() => {
  console.log('Fired after 500ms');
}, 500);

// Cancel early if needed
<button onClick={cancel}>Cancel</button>
```

---

[← Back to Hooks](../README.md)
