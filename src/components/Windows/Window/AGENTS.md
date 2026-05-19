# Window (internal rendering layer)

The internal components and hooks that render a single open window instance. This directory is consumed exclusively by `Windows/WindowRenderer.tsx` — do not use these directly from application code.

## Overview

When `WindowsManager` decides to render an open window, it passes control to `WindowRenderer`, which mounts `<Window>`. Everything in this directory handles what happens inside that mounted element: sizing, dragging, focus, open/close animation, validation gating, and form-dirty checking. The public API (`createWindow`, `useWindow`) lives one level up in `src/components/Windows/`.

## Contents

### Core component
- `Window.tsx` — the draggable, resizable window shell. Renders the `Titlebar`, close/maximize/restore buttons, a `UIState` loading overlay, validation, a `FormObserver`, and the `children` content area. Connects all sub-hooks.

### Content and actions
- `WindowContent.tsx` — wraps children in a `Scroller` unless `disableScrolling` is set via `WindowContext`. The no-scroll path allows the window height to be driven by content measurement rather than the ResizeObserver path.
- `WindowAction.tsx` — a single action button rendered in the window's bottom action bar. Reads `WindowRenderContext` to expose `close()` to the action.
- `WindowActions.tsx` — the bottom action bar container. Renders a `Flex` row of `WindowAction` children above the window content.
- `WindowOkAction.tsx` — a pre-built "OK" action that validates the window contents before closing.

### State and lifecycle hooks
- `useWindowState.ts` — bridges component state with `WindowsManager`. Initialises from `manager.get(id)`, subscribes to external state changes (manager broadcast), and mirrors local state back via `manager.updateStateWithoutNotifications`. Returns `[state, setState]`.
- `useWindowEvents.ts` — manages the open/close animation lifecycle. Drives the `is-visible` CSS class and calls `onClosing`/`onClosed` callbacks at the right moments. Returns `{ isVisible }`.
- `useWindowDimensions.ts` — the window sizing and preparation phase. During preparation (`preparing` → `prepared` CSS classes), measures content width/height and applies them as inline styles. After preparation, dimensions change only via user resize. Returns `{ style, preparationClassName, allowIsMaximized }`.

### Validation
- `WindowValidationContext.tsx` — provides a `WindowValidationProvider` that bridges `useValidation` (from `ValidationProvider`) into the window. Exposes `onCheckIsValid` so `WindowOkAction` can gate close on validation passing.

## Architecture

```
Window
├── Titlebar (drag handle, title, window controls)
├── UIState (isLoading overlay)
│   ├── WindowValidationProvider
│   │   └── FormObserver (dirty tracking via useFormObserver)
│   │       └── ValidateSection
│   │           └── WindowContext.Provider (disableScrolling)
│   │               └── children (e.g. WindowContent + WindowActions)
│   └── WindowResizer (drag handles on all 4 edges)
```

## Decision rationale

**The preparation phase (`preparing` → `prepared` → visible)**

Windows need to know their own dimensions before they become visible so they can be positioned correctly (centred, or at `initialPosition`). The preparation sequence:
1. Mount with `preparing` class — `transitionProperty: none`, opacity 0, scale 1. The window is invisible but in the layout.
2. Measure content width/height from the `contentWrapperRef`.
3. Apply measured dimensions as inline `style`. Switch to `prepared` class — opacity 0, scale 0.7.
4. On the next frame, remove `preparationClassName`. CSS transitions kick in: opacity 1, scale 1 → the window "pops in".

This avoids a flash of incorrectly sized/positioned content.

**`FormObserver` is embedded in every window**

`Window` calls `useFormObserver()` and wraps its content in the returned `<FormObserver>`. This means any `<Form>` rendered inside a window automatically reports its dirty state to the window. When the user clicks close, `closeWindow` calls `getIsDirty()` — if dirty, it blocks the close and shows an error notification instead of letting the user lose unsaved changes.

## Ambiguities and gotchas

- **`disableScrolling` is read from `WindowContext`, not a prop on `WindowContent`** — setting it on `Window` propagates to `WindowContent` via context. Do not pass it directly to `WindowContent`.
- **`allowIsMaximized`** is a separate flag from `isMaximized`. It is `false` during the preparation phase to prevent the maximize animation from firing before the window is sized. The `useLayoutEffect` that syncs `isMaximized` only fires when `allowIsMaximized` is `true`.
- **`WindowAction` reads `WindowRenderContext`** — this means it only works when rendered inside a window created with `createWindow`. Rendering it outside a window will throw (context will be the default empty value).
- **`useWindowState` calls `manager.updateStateWithoutNotifications` on every state change** — this pushes state back to the manager without triggering a re-render cascade. Do not replace this with `manager.setState` (the notifying variant) as it will cause an infinite loop.

## Related

- [../AGENTS.md](../AGENTS.md) — parent Windows component: public API (`createWindow`, `useWindow`), manager, persistence
- [../../Form/AGENTS.md](../../Form/AGENTS.md) — `useFormObserver` used by `Window` to block close when a child form is dirty
- [../../providers/ValidationProvider/AGENTS.md](../../../providers/ValidationProvider/AGENTS.md) — `useValidation` integrated via `WindowValidationContext`

---

[← Back to Windows](../AGENTS.md)
