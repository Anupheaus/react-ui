# useObserver

Wraps a `MutationObserver` and provides a stable `target` ref-callback to attach to a DOM element, invoking `onChange` whenever the observed element's subtree, attributes, or children mutate.

## Signature

```ts
function useObserver(props?: UseObserverProps): { target: (element: HTMLElement | null) => void }
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `isEnabled` | `boolean` | No | Whether observation is active (default: `true`). Disconnects the observer when `false` |
| `onChange` | `(element: HTMLElement, mutations: MutationRecord[]) => void` | No | Callback invoked on each mutation batch; also called immediately with an empty array on attach |

## Returns

An object with:

| Field | Type | Description |
|-------|------|-------------|
| `target` | `(element: HTMLElement \| null) => void` | Ref-callback to attach to the DOM element you want to observe |

## Usage

```tsx
const { target } = useObserver({
  onChange: (element, mutations) => {
    console.log('DOM changed on', element, mutations);
  },
});

return <div ref={target}>watched content</div>;
```

---

[← Back to Hooks](../README.md)
