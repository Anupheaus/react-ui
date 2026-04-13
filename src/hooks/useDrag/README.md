# useDrag

Adds mouse-driven drag behaviour to a component. Spread `draggableProps` onto the drag handle element and optionally use `dragMovable` to specify a separate element that should be considered the "thing being moved" when computing drag offsets.

## Signature

```ts
function useDrag(props?: UseDragProps): { draggableProps: Partial<DOMAttributes<HTMLElement>>; dragMovable: HTMLTargetDelegate }
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `isEnabled` | `boolean` | No | Whether dragging is active (default `true`). |
| `onDragStart` | `(event: UseDragEvent) => void` | No | Called once the pointer has moved more than 10 px from where the drag began. |
| `onDragging` | `(event: UseDragEvent) => void` | No | Called on every `mousemove` after dragging starts. |
| `onDragEnd` | `(event: UseDragEvent) => void` | No | Called when the mouse button is released. |

### `UseDragEvent`

| Property | Type | Description |
|----------|------|-------------|
| `initiatorElement` | `HTMLElement` | The element that received the initial `mousedown`. |
| `movableElement` | `HTMLElement` | The element being tracked (the movable ref if set, otherwise the target). |
| `mouseStartingX` | `number` | Page-X coordinate at drag start. |
| `mouseStartingY` | `number` | Page-Y coordinate at drag start. |
| `originalTop` | `number` | Computed `top` style of the movable element at drag start. |
| `originalLeft` | `number` | Computed `left` style of the movable element at drag start. |
| `originalWidth` | `number` | Computed `width` of the movable element at drag start. |
| `originalHeight` | `number` | Computed `height` of the movable element at drag start. |
| `diffX` | `number` | Horizontal distance moved since drag start. |
| `diffY` | `number` | Vertical distance moved since drag start. |

## Returns

| Property | Type | Description |
|----------|------|-------------|
| `draggableProps` | `Partial<DOMAttributes<HTMLElement>>` | Spread onto the drag-handle element (`{ onMouseDown }`). |
| `dragMovable` | `HTMLTargetDelegate` | Assign to the `ref` of the element that should be measured/moved. |

## Usage

```tsx
import { useDrag } from '@anupheaus/react-ui';

function DraggableWindow() {
  const [position, setPosition] = useState({ top: 100, left: 100 });

  const { draggableProps, dragMovable } = useDrag({
    onDragging: ({ originalTop, originalLeft, diffX, diffY }) => {
      setPosition({ top: originalTop + diffY, left: originalLeft + diffX });
    },
  });

  return (
    <div
      ref={dragMovable}
      style={{ position: 'fixed', top: position.top, left: position.left }}
    >
      <div {...draggableProps} style={{ cursor: 'grab' }}>Title bar — drag here</div>
      <div>Window content</div>
    </div>
  );
}
```

---

[← Back to Hooks](../README.md)
