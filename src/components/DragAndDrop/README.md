# DragAndDrop

A drag-and-drop system composed of two components: `Draggable` (the item being dragged) and `DropArea` (the zone that accepts dropped items). While dragging, the original item fades to 30% opacity and a full-opacity clone follows the cursor. A colour-coded overlay on `DropArea` signals whether the dragged items are valid for that target.

## Components

### `Draggable`

Wraps any content to make it draggable. Each `Draggable` carries a `data` record that is passed to `DropArea` callbacks on drop.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `Record` | Yes | Data payload attached to this draggable item. Must have at least an `id` property. |
| `children` | `ReactNode` | Yes | Content to render as the draggable item. |
| `tagName` | `string` | No | Custom HTML tag name for the wrapper element (default: `'draggable'`). |
| `className` | `string` | No | CSS class on the original element. |
| `onDraggingClassName` | `string` | No | CSS class added to the original element while it is being dragged. |
| `clonedClassName` | `string` | No | CSS class on the floating clone element. |
| `onDraggingClonedClassName` | `string` | No | CSS class added to the clone while dragging. |

### `DropArea`

Defines a region that can receive dropped `Draggable` items. An overlay (valid=green, invalid=red) is rendered while dragged items hover over the area.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Content rendered inside the drop zone. |
| `onDroppedItems` | `(items: DraggedItem<T>[]) => void` | No | Called with the array of dropped items when the user releases the mouse over a valid drop area. |
| `onDraggingOverItem` | `(item: DraggedItem<T>, allDragging: DraggedItem<T>[], event: MouseMoveEvent) => void` | No | Called continuously as the cursor moves over a child `Draggable` inside this area. |
| `onValidateDraggedItems` | `(items: DraggedItem[]) => boolean` | No | Return `false` to mark the current drag as invalid (shows red overlay). Defaults to always-valid. |
| `onDraggedOut` | `(items: DraggedItem<T>[], event: MouseLeaveEvent) => void` | No | Called when dragged items leave this drop area. |
| `disableOverlay` | `boolean` | No | Suppresses the colour-coded validity overlay. Default: `false`. |
| `overlayClassName` | `string` | No | CSS class applied to the overlay element. |

## Usage

```tsx
import { Draggable, DropArea } from '@anupheaus/react-ui';

const item = { id: 'task-1', title: 'Implement feature X' };

function KanbanBoard() {
  const handleDrop = (droppedItems) => {
    console.log('dropped', droppedItems);
  };

  return (
    <DropArea onDroppedItems={handleDrop}>
      <Draggable data={item}>
        <div className="card">{item.title}</div>
      </Draggable>
    </DropArea>
  );
}
```

## Architecture

`Draggable` uses the `useDrag` hook to track pointer events. When a drag starts, it:
1. Snapshots the element's screen coordinates and dimensions.
2. Registers the item in the module-level `DragAndDropData` store.
3. Creates a portal-mounted clone that is translated in sync with the pointer via `transform`.

`DropArea` listens for mouse events via `useInteractionEvents` and consults `DragAndDropData` to resolve what is being dragged. The `InteractionProvider` / `useInteractionProvider` pair propagates mouse-move events down through nested `Draggable` children so that `onDraggingOverItem` knows which specific child the cursor is over.

---

[← Back to Components](../README.md)
