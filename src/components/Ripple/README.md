# Ripple

A Material-style ink ripple effect for interactive elements. The ripple expands from the mouse-down position (or the element centre when triggered by keyboard focus) and fades out on release. Intended to be used via the `useRipple` hook rather than the `Ripple` component directly.

## `useRipple`

```ts
const { Ripple, rippleTarget } = useRipple();
```

| Return | Type | Description |
|--------|------|-------------|
| `Ripple` | Component | Renders the ripple overlay. Place it as a child of the interactive element. |
| `rippleTarget` | `ref callback` | Attach to the interactive element via `ref={rippleTarget}`. Wires up `mousedown`, `focus`, and `blur` event listeners. |

## Ripple Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isDisabled` | `boolean` | No | Suppress the animation without removing the component (default: `false`) |
| `stayWithinContainer` | `boolean` | No | Clip the ripple to the container bounds with `overflow: hidden` (default: `false`) |
| `ignoreMouseCoords` | `boolean` | No | Always expand from the element centre regardless of click position (default: `false`) |
| `className` | `string` | No | Class applied to the ripple animation element |
| `containerClassName` | `string` | No | Class applied to the ripple container element |

## Usage

```tsx
import { useRipple } from '@anupheaus/react-ui';

function MyButton({ children, onClick }) {
  const { Ripple, rippleTarget } = useRipple();

  return (
    <button ref={rippleTarget} style={{ position: 'relative', overflow: 'hidden' }} onClick={onClick}>
      <Ripple stayWithinContainer />
      {children}
    </button>
  );
}
```

## Architecture

`useRipple` creates two pieces of distributed state — `rippleState` (active flag, x/y coordinates) and `rippleConfig` (element reference, `ignoreMouseCoords` flag) — and returns a `rippleTarget` ref callback produced by `createRippleEventHandler`. That handler attaches `mousedown`, `focus`/`focusin`, and `blur`/`focusout` listeners to the target element. The `Ripple` component reads both states and applies CSS keyframe animations (`scale(0) → scale(1.2)` on activation, `scale(1.2) → opacity 0` on deactivation). The ripple size is computed as 2.5× the larger dimension of the container element.

---

[← Back to Components](../README.md)
