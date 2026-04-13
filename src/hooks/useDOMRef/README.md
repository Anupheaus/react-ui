# useDOMRef

Creates a stable callback ref (`HTMLTargetDelegate`) that can be attached to a JSX element's `ref` prop. It normalises callback refs and object refs, and optionally triggers lifecycle callbacks or a force-update when the referenced element mounts or unmounts.

## Signature

```ts
// Default: returns a [ref, setTarget] tuple
function useDOMRef(): [RefObject<HTMLElement>, HTMLTargetDelegate]

// Trigger a force-update when the element changes
function useDOMRef(forceRefresh: boolean): [RefObject<HTMLElement>, HTMLTargetDelegate]

// Forward the element to one or more other refs
function useDOMRef(refs: (Ref<any> | undefined)[]): HTMLTargetDelegate

// Forward + lifecycle callbacks
function useDOMRef(refs: (Ref<any> | undefined)[], config: UseDOMConfig): HTMLTargetDelegate

// Lifecycle callbacks only
function useDOMRef(config: UseDOMConfig): HTMLTargetDelegate
```

### `UseDOMConfig`

| Property | Type | Description |
|----------|------|-------------|
| `connected` | `(element: HTMLElement) => void` | Called when an element is assigned. |
| `disconnected` | `(element: HTMLElement) => void` | Called when the element is removed or replaced. |

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `forceRefresh` | `boolean` | No | When `true`, forces a component re-render whenever the element reference changes. |
| `refs` | `(Ref<any> \| undefined)[]` | No | Additional refs to forward the element to. |
| `config` | `UseDOMConfig` | No | Lifecycle callbacks for element connect/disconnect events. |

## Returns

- When called with no arguments or `forceRefresh`: returns `[RefObject<HTMLElement>, HTMLTargetDelegate]`.
- When called with `refs` or `config`: returns `HTMLTargetDelegate` directly (no ref object needed).

`HTMLTargetDelegate` is `(element: HTMLElement | null) => void` — assign it to a JSX `ref` prop.

## Usage

```tsx
import { useDOMRef } from '@anupheaus/react-ui';

// Basic usage
function MyComponent() {
  const [elementRef, setElement] = useDOMRef();
  return <div ref={setElement} />;
}

// With lifecycle callbacks
function Tooltip() {
  const setElement = useDOMRef({
    connected: el => { /* el is now in the DOM */ },
    disconnected: el => { /* el has left the DOM */ },
  });
  return <span ref={setElement}>Hover me</span>;
}

// Force re-render when element changes
function Measurer() {
  const [ref, setElement] = useDOMRef(true);
  const width = ref.current?.offsetWidth ?? 0;
  return <div ref={setElement}>Width: {width}px</div>;
}
```

---

[← Back to Hooks](../README.md)
