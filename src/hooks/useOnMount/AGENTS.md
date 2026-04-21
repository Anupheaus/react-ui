# useOnMount

Runs a callback exactly once after the component mounts, equivalent to `useEffect(() => delegate(), [])` but with a clearer intent.

## Signature

```ts
function useOnMount(delegate: () => void): void
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `delegate` | `() => void` | Yes | Function to call once after the component mounts |

## Returns

Nothing (`void`).

## Usage

```tsx
useOnMount(() => {
  console.log('Component mounted');
  fetchInitialData();
});
```

---

[← Back to Hooks](../AGENTS.md)
