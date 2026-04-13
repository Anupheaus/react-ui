# useOnDOMChange

Attaches a `MutationObserver` to a DOM element and fires a callback whenever its child nodes, subtree, attributes, or character data change. Returns a ref-callback to assign to the target element.

## Signature

```ts
function useOnDOMChange(props?: UseDOMChangeProps): (element: HTMLElement | null) => void
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `isEnabled` | `boolean` | No | Whether the observer is active (default: `true`). Disconnects the observer while `false` |
| `onChange` | `(mutations: MutationRecord[], element: HTMLElement) => void` | No | Callback invoked with each mutation batch and the observed element |

## Returns

A stable ref-callback `(element: HTMLElement | null) => void` to pass as the `ref` prop of the element to observe.

## Usage

```tsx
const target = useOnDOMChange({
  onChange: (mutations, element) => {
    console.log('DOM mutated', mutations.length, 'times on', element);
  },
});

return <div ref={target}>observed content</div>;
```

---

[← Back to Hooks](../README.md)
