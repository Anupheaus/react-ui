# extensions

Global prototype extensions and React-specific type predicates that are auto-applied when this package is imported.

## Overview

This directory patches browser globals (`HTMLElement`, `Document`) with geometry/event utilities, and extends the `is` object from `@anupheaus/common` with React-aware predicates. It also defines the `UseDataRequest` / `UseDataResponse` interfaces used by the lazy-loading request protocol throughout the library.

All extensions are applied as side-effects on import of the package's root `index.ts` — consumers do not call them explicitly.

## Contents

### HTMLElement prototype extensions

Added to every `HTMLElement` in the browser. Available nowhere in SSR (all extensions are guarded by `typeof window`).

- `screenCoordinates()` — position relative to the viewport, adjusted for parent margin/border
- `pageCoordinates()` — position relative to the document (includes scroll offset)
- `coordinates()` — `{ clientLeft, clientTop }` (rarely needed; prefer `pageCoordinates`)
- `centreCoordinates()` — centre point of the element, margin-excluded
- `dimensions(options?)` — width/height/top/left including margins by default; pass `{ excludingMargin, excludingPadding, excludingBorder }` to strip individual layers
- `geometry()` — `pageCoordinates` combined with margin-excluded width/height; the canonical "where is this element on the page" call
- `isUnderCoordinates(coords)` — whether a `{ x, y }` point falls within this element's `geometry()`
- `distanceTo(coords)` — Euclidean distance from `{ x, y }` to the nearest edge of this element; returns `0` if the point is inside
- `parentElements(untilElement?)` — ancestor `HTMLElement[]` walking up the DOM, stopping before `untilElement`
- `parentNodes(untilNode?)` — ancestor `Node[]` (including non-element nodes) walking up the DOM
- `simulateEvent(eventName, eventData)` — delegates to `Document.simulateEvent` with `this` as the target

### Document prototype extension

- `simulateEvent(eventName, eventData)` — constructs and dispatches a real DOM event on the document. Currently only mouse events are supported (`mousedown`, `mousemove`, `mouseup`, `mouseenter`, `mouseleave`, `mouseover`, `mouseout`). Non-mouse event names are silently ignored.

### `is` extensions (`is.ts`)

Extends the `is` object from `@anupheaus/common` with React predicates:

- `is.reactElement(value)` — delegates to React's `isValidElement`
- `is.reactComponent(value)` — true for class component instances and objects with `$$typeof` symbol (function components as JSX values)
- `is.reactRef(value)` — true for `{ current: ... }` ref objects
- `is.theme(value)` — true for objects matching the `LegacyTheme` shape: `{ id, definition, createVariant }`
- `is.fixedCSSDimension(value)` — true for numbers or strings ending in `px` / `em`

### Global types (`global.ts`)

Utility types shared across the library's lazy-loading protocol:

- `AddChildren<TProps>` — adds `children?: ReactNode` to a props type if it doesn't already include `children`
- `UseDataRequest` — request shape for `onRequest` callbacks: `{ requestId: string, pagination: DataPagination }`
- `UseDataResponse<T>` — response shape: `{ requestId: string, items: T[], total: number }`

## Architecture

Extensions are applied via `Object.extendPrototype` from `@anupheaus/common`, which merges methods from a class prototype onto a target object's prototype. This avoids collisions with native browser properties by only adding methods that don't already exist.

The `HTMLElement.ts` file imports `./Document` as a side-effect to ensure `Document` extensions are present before calling `simulateEvent`.

## Ambiguities and gotchas

- `dimensions()` **includes margins by default** — the returned `top`/`left` values are negative when margins are present (they represent the outer edge, not the content edge). Pass `{ excludingMargin: true }` to get the behaviour you probably want.
- `screenCoordinates()` adjusts for the **parent's** margin and border, not the element's own — this is intentional for drag-and-drop hit-testing but counter-intuitive when called in isolation.
- `simulateEvent` on `Document` only dispatches to the document itself. To fire on a specific element, call `element.simulateEvent(...)` which routes through the document with `this` bound to the element.
- None of these extensions are present in SSR / Node environments — the `typeof window` guard skips all prototype patching.

## Related

- [../models/AGENTS.md](../models/AGENTS.md) — `UseDataRequest` / `UseDataResponse` types are defined here and consumed by `InternalList`, `List`, and `Table`
- [../components/DragAndDrop/AGENTS.md](../components/DragAndDrop/AGENTS.md) — heavy consumer of `geometry()`, `distanceTo()`, and `isUnderCoordinates()`
