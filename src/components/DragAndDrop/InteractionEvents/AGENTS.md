# InteractionEvents

The event coordination layer between `Draggable` items and their parent `DropArea`. Provides typed mouse event interfaces, a React context for bubbling events up from nested draggables, and low-level DOM event attachment utilities.

## Overview

`DropArea` needs to know which specific child `Draggable` the cursor is currently over during a drag, not just that the cursor is inside the drop area. This directory solves that: `InteractionProvider` wraps each `Draggable` and pushes `mousemove` events up to any ancestor `DropArea` that is listening via `useInteractionEvents`. The event carries the `data` payload of the specific draggable item under the cursor.

## Contents

### Event type definitions
- `InteractionEvents.ts` — TypeScript interfaces for the five augmented mouse event types:
  - `MouseMoveEvent` — extends `MouseEvent` with `data?: T`, `elementPctX`, `elementPctY` (cursor position as a percentage of the element's width/height)
  - `MouseEnteredEvent`, `MouseLeaveEvent`, `MouseUpEvent`, `MouseDownEvent` — extend `MouseEvent` with `data?: T`

### React context
- `InteractionContext.ts` — a React context whose value is a single `(event: Event) => void` callback. `InteractionProvider` sets the callback; consumers (nested `Draggable` items via `useInteractionProvider`) call it to bubble events upward.
- `InteractionProvider.tsx` — wraps a `Draggable` child. Provides an event callback via `InteractionContext` that forwards `mousemove` events to the `onMouseMove` prop. Used by `Draggable` to participate in the event chain.

### Event attachment
- `useInteractionEvents.ts` — the hook used by `DropArea`. Takes `data` and mouse event callbacks; returns a ref callback (`target`) to attach to a DOM element. Calls `captureMouseMoveEvents` and `captureMouseClickEvents` to wire up native DOM listeners. Detaches all listeners on unmount.
- `useInteractionProvider.ts` — the hook used by `Draggable`. Reads `InteractionContext` and returns the callback for forwarding events to the parent provider chain.
- `captureMouseMoveEvents.ts` — attaches `mousemove`, `mouseenter`, `mouseleave` listeners directly to a DOM element. Augments the native `MouseEvent` with `data` (from props) and `elementPctX`/`elementPctY` computed from `getBoundingClientRect`.
- `captureMouseClickEvents.ts` — attaches `mousedown`, `mouseup` listeners to a DOM element. Augments the event with `data`.
- `InterationEventUtils.ts` — *(note: intentional typo in filename — `Interation` not `Interaction`)* — shared geometry helpers used by the capture functions.

## Architecture

```
DropArea
└── useInteractionEvents(target)         ← attaches native DOM listeners to DropArea element
    └── captureMouseMoveEvents           ← fires onMouseMove with augmented event
        └── InteractionContext callback  ← bubbled up from nested Draggable
            └── InteractionProvider     ← wraps each Draggable
                └── useInteractionProvider ← reads context, returns forwarder
```

When the cursor moves over a `Draggable` inside a `DropArea`:
1. Native `mousemove` fires on the `Draggable`'s DOM element.
2. `captureMouseMoveEvents` (on the `DropArea` element) receives the event, attaches `data` and percentage coords.
3. It calls the `InteractionContext` callback provided by the nearest `InteractionProvider` ancestor.
4. `InteractionProvider` forwards this to its `onMouseMove` prop, which is `DropArea`'s handler.
5. `DropArea` receives `event.data` — the payload of the specific child `Draggable` under the cursor.

## Decision rationale

**Why a context-based event chain rather than bubbling native events?**

Standard DOM event bubbling would deliver `mousemove` to the `DropArea` element, but the event's `target` would be whatever DOM element is under the cursor — not necessarily the `Draggable` wrapper. Identifying which `Draggable`'s `data` the cursor is over would require walking up the DOM from `target` to find a `Draggable` boundary, which is fragile and doesn't work with portals. The `InteractionContext` chain solves this cleanly: each `Draggable` controls its own `InteractionProvider`, so the context value is always the correct draggable's callback.

**`elementPctX` / `elementPctY` on `MouseMoveEvent`**

Raw pixel coordinates are not useful for "where within this item is the cursor?" — they depend on the element's position on the page. Percentage coordinates (0–1) give consumers a stable, position-independent signal for things like "is the cursor in the top half (reorder above) or bottom half (reorder below) of this item?".

## Ambiguities and gotchas

- **`InterationEventUtils.ts` has a typo** — the filename is `Interation` (missing the 'c'). Do not rename it without updating all imports; the typo is in the original source.
- **`useInteractionEvents` uses a ref callback, not a `useRef`** — the returned `target` must be passed as a `ref` prop to the DOM element. Passing it to `ref` on a React component (not a DOM element) will not work.
- **Listeners are native DOM listeners, not React synthetic events** — they are added with `addEventListener` and removed on unmount. Do not replace them with React `onMouseMove` props; that would go through the React event system and miss the `InteractionContext` chain.
- **`data` on events is `undefined` if not provided** — `DropArea`'s `onDraggingOverItem` will receive `undefined` for `event.data` if the `Draggable` did not set a `data` prop.

## Related

- [../AGENTS.md](../AGENTS.md) — parent DragAndDrop component: `Draggable` and `DropArea` public API, portal/transform architecture
- [../../../extensions/AGENTS.md](../../../extensions/AGENTS.md) — `geometry()` and `dimensions()` HTMLElement extensions used in the capture functions for percentage coordinate calculation

---

[← Back to DragAndDrop](../AGENTS.md)
