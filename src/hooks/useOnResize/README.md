# useOnResize

Observes a DOM element's dimensions using a `ResizeObserver` and returns the current `width` and `height`, triggering a re-render whenever they change.

## Signature

```ts
function useOnResize(props?: UseResizerProps): UseOnResizeResult
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `isEnabled` | `boolean` | No | Whether size tracking is active (default: `true`) |
| `observeWidthOnly` | `boolean` | No | Only re-render when `width` changes (default: `false`) |
| `observeHeightOnly` | `boolean` | No | Only re-render when `height` changes (default: `false`) |

## Returns

An object with:

| Field | Type | Description |
|-------|------|-------------|
| `hasDimensions` | `boolean` | `true` once both `width` and `height` are known |
| `width` | `number \| undefined` | Current element width in pixels |
| `height` | `number \| undefined` | Current element height in pixels |
| `elementRef` | `React.MutableRefObject<HTMLElement \| null>` | Ref to the observed element |
| `target` | `(element: HTMLElement \| null) => void` | Ref-callback to attach to the element |

## Usage

```tsx
const { target, width, height, hasDimensions } = useOnResize();

return (
  <div ref={target}>
    {hasDimensions && <p>{width} x {height}</p>}
  </div>
);
```

---

[← Back to Hooks](../README.md)
