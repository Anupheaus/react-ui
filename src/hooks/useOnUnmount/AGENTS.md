# useOnUnmount

Registers a cleanup callback that fires when the component unmounts, and returns a function that can be called at any time to check whether the component has already unmounted.

## Signature

```ts
function useOnUnmount(): () => boolean
function useOnUnmount(delegate: () => void): () => boolean
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `delegate` | `() => void` | No | Cleanup function to call on unmount |

## Returns

A function `() => boolean` that returns `true` after the component has unmounted. Useful for guarding async operations started inside the component.

## Usage

```tsx
// With cleanup callback
const isUnmounted = useOnUnmount(() => {
  subscription.unsubscribe();
});

// Guard async work
useOnMount(async () => {
  const data = await fetchData();
  if (!isUnmounted()) setState(data);
});
```

---

[← Back to Hooks](../AGENTS.md)
