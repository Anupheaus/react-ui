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

## Decision rationale

**Portal + CSS transform rather than DOM reordering**

During a drag, the visual clone is inserted into `document.body` via `createPortal` at a fixed `position: absolute; top: 0; left: 0` with a CSS `transform: translate(diffX, diffY)` that updates on every pointer move. The original `Draggable` element stays in place with 30% opacity.

Reordering the actual DOM nodes during a drag would require re-running layout on the whole list on every mouse-move event, which causes jank at high frame rates. It would also complicate hit-testing for `DropArea` because the items would be shifting under the cursor. The portal+transform approach keeps the layout tree static during the drag and puts the visual feedback entirely in the compositor layer (transform is GPU-accelerated and does not trigger layout).

Additionally, reordering DOM nodes would fire React reconciliation on every mouse-move. The module-level store (see below) exists precisely to avoid that.

**The module-level `DragAndDropData` store**

`DragAndDropData` is a `Records<DraggedItem>` instance created at module scope — outside any React component. It holds the currently-dragged items without going through React state. This is intentional: `DropArea` needs to read which items are being dragged on every `mousemove` event. If the dragged items were stored in React state, every `mousemove` would trigger a state update, which would re-render every `DropArea` on every pixel of movement. Instead, `DropArea` reads from the module store on demand and only calls `setDraggedItemsAreValid` (React state) when the validation result changes.

## Ambiguities and gotchas

**Nesting `Draggable` inside `DropArea` — it works, with caveats**

A `Draggable` can be a direct or indirect child of a `DropArea`. The `InteractionProvider` / `useInteractionProvider` pair is specifically designed for this: `onDraggingOverItem` on the `DropArea` fires with the specific child `Draggable` the cursor is over, resolved by reading the `data` from `InteractionContext`. However, nesting a `DropArea` inside another `DropArea` is not tested and may produce unpredictable overlay behaviour because both areas will receive `mousemove` and `mouseup` events.

**What happens when you drag outside all drop areas**

The clone follows the cursor regardless of whether the cursor is over a valid `DropArea`. If the user releases the mouse outside any `DropArea`, no `onDroppedItems` callback fires and the drag ends silently on the `dragend`/`mouseup` event in `useDrag`. The `DragAndDropData` store is cleared in `onDragEnd` inside `Draggable`. The original element returns to full opacity and the clone is hidden.

**`onDroppedItems` callback signature**

`onDroppedItems` is called with an array of `DraggedItem<T>` — all items that are currently in `DragAndDropData` at the moment `mouseup` fires over a valid drop area. It is only called when `draggedItemsAreValid` is `true` at the time of the `mouseup` event. If `onValidateDraggedItems` returned `false` for the current drag (red overlay), `onDroppedItems` is NOT called even though the mouse was released inside the `DropArea`.

**`onDraggingOverItem` only fires for child `Draggable` items, not arbitrary children**

`onDraggingOverItem` fires only when `event.data` is non-null — i.e., when the cursor is over a child element that has an `InteractionProvider` registered via `useInteractionProvider`. Plain HTML children of `DropArea` that are not wrapped in `Draggable` will not trigger `onDraggingOverItem`.

**The clone is an HTML snapshot, not a live React subtree**

When a drag starts, `Draggable` snapshots `element.outerHTML` and sets it as `dangerouslySetInnerHTML` on the portal clone. The clone is a static HTML copy — event handlers and React state inside the original component are not present in the clone. Do not rely on interactive elements inside the clone being functional.

## Related

- [../../extensions/AGENTS.md](../../extensions/AGENTS.md) — `useDOMRef`, `screenCoordinates()`, and `dimensions()` are extension methods on `HTMLElement` from the extensions module; `Draggable` uses these to snapshot position and size at drag-start for the clone's initial placement

---

[← Back to Components](../AGENTS.md)
