# Windows Component

## Overview

The Windows component renders draggable, resizable application windows. Window definitions are registered globally at `createWindow` time—they do not need to be passed as children.

## Usage

### 1. Mount the Windows component

```tsx
<Windows />
```

Or with optional persistence and callbacks:

```tsx
<Windows
  localStorageKey="my-app-windows"
  onChange={(states) => console.log('Windows changed', states)}
/>
```

### 2. Define windows with createWindow

```tsx
const MyWindow = createWindow('MyWindow', ({ Window, Content, id }) => (arg1: string, arg2?: number) => (
  <Window title={`Window ${id}`}>
    <Content>
      <p>{arg1} - {arg2}</p>
    </Content>
  </Window>
));
```

### 3. Open windows with useWindow

**When you provide an id at hook level** (`useWindow(definition, id)`):

- `open(args)` — id is fixed; only pass window args
- `close(response?)` — closes the window identified by the hook id

```tsx
const { openMyWindow, closeMyWindow } = useWindow(MyWindow, 'my-window-id');
await openMyWindow('hello', 42);
await closeMyWindow('done');
```

**When you do not provide an id** (`useWindow(definition)`):

- `open(id, args)` — id is required as the first argument
- `close(id, response?)` — id required to target which window to close

```tsx
const { openMyWindow, closeMyWindow } = useWindow(MyWindow);
await openMyWindow('instance-1', 'hello', 42);
await openMyWindow('instance-2', 'world');
await closeMyWindow('instance-1', 'done');
```

**When you provide no arguments** (`useWindow()`):

- Returns utilities for the **current window** — must be called from within window content (inside a window created with `createWindow`).
- `setTitle(title)` — update the window title dynamically
- `close(response?)` — close the current window

```tsx
const MyWindow = createWindow('MyWindow', ({ Window, Content, id }) => (name: string) => (
  <Window title={`Hello ${name}`}>
    <Content>
      <MyContent />
    </Content>
  </Window>
));

function MyContent() {
  const { setTitle, close } = useWindow();
  return (
    <>
      <button onClick={() => setTitle('Updated title')}>Change title</button>
      <button onClick={() => close('saved')}>Save & close</button>
    </>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Manager id. Defaults to `windows-default`. |
| `className` | `string` | CSS class for the container. |
| `children` | `ReactNode` | Optional content rendered alongside windows. |
| `states` | `WindowState[]` | Controlled initial/restored states. |
| `localStorageKey` | `string` | When provided, persists window state to localStorage. Omit to disable persistence. |
| `onChange` | `(states) => void` | Called when window states change. |

## Persistence

Persistence is **disabled by default**. Pass `localStorageKey` to enable:

```tsx
<Windows localStorageKey="my-windows" />
```

Only windows with simple (JSON-serializable) args are persisted. Use `doNotPersist: true` in `createWindow` options to exclude specific window types.

## Notes

- The `Windows` component must be mounted before any `open` calls. Manager lookup is deferred until open/close/focus/etc. are invoked, so opening in `useLayoutEffect` works even when the component using `useWindow` is an ancestor of `Windows`.
- `InternalWindows` is used internally by `Dialogs` and is not part of the public API.

## Contexts and content-based sizing

- **WindowRenderContext** is provided by `WindowRenderer` and holds `id`, `managerId`, `close`, `setTitle`, `title`. It is consumed by `Window`, `useWindow()` (no-arg form), and `WindowAction`. Definitions do not receive or pass any context to `Window`.
- **WindowContext** is provided by `Window` and holds only `{ disableScrolling?: boolean }`. It is consumed by `WindowContent` so content can opt out of the default Scroller (e.g. for layout that defines intrinsic height).

**Window sizing:**

- **disableScrolling** can be set on `Window`. When `true`, it is passed via `WindowContext` to `WindowContent` (which then does not wrap children in `Scroller`), and the window's initial **height** can be driven by the measured content wrapper. When `disableScrolling` is `false`, height follows the existing ResizeObserver/minHeight path.
- **Width** is set from the inner content wrapper measurement when no explicit width is provided (during the preparation phase).
- **Height** from the content wrapper is used only when `Window` has `disableScrolling` and no explicit height; otherwise height comes from ResizeObserver/minHeight.
- Auto-size (from content or ResizeObserver) runs only while the window is in the preparation phase (`preparationClassName !== undefined`). After preparation completes, dimensions change only via user resize.

---

## Decision rationale

**Why `registerGlobal` exists**

`createWindow` is called at module load time, before any React component has mounted. The window definition must be available globally so that `useWindow` can open a window from any component in the tree, including components that are ancestors of the `<Windows />` mount point. If definitions were passed as children or props, they could only be consumed by components that are descendants of `<Windows />`, which would require `<Windows />` to sit at the top of every app tree and prevent code-splitting window definitions.

`registerGlobal` stores the definition in the module-level `windowsDefinitionsManager` singleton. When `<Windows />` mounts it calls `registerManager`, which pairs each global definition with the concrete manager that will render it. Opening is deferred until a manager is available, so `useWindow` can be called from a component that renders before `<Windows />`.

**Why there are two separate contexts — `WindowContext` vs `WindowRenderContext`**

`WindowRenderContext` is provided by `WindowRenderer` and carries the runtime wiring for a single open window instance: its `id`, `managerId`, the `close` callback, and `setTitle`. It is consumed by `Window`, `useWindow()` (no-arg form), and `WindowAction`. This context exists for the lifetime of the rendered window.

`WindowContext` is provided by `Window` itself and carries only `{ disableScrolling }`. It exists solely so that `WindowContent` — a separate component one level down — can opt out of the default `Scroller` wrapper without needing a prop drilled through. The narrow scope is intentional: if `WindowContext` carried the full render wiring it would conflict when windows are nested.

Keeping the two contexts separate means adding new per-window-instance data to `WindowRenderContext` never risks leaking into `WindowContent`'s scroll decision, and vice versa.

## Ambiguities and gotchas

**Persistence requires `localStorageKey` — omitting it silently disables all persistence**

Window positions, sizes, and open/closed states are only persisted when `<Windows localStorageKey="..." />` is provided. Without it, every page reload resets all windows. The prop is optional with no default, so forgetting it produces no warning.

**Window position resets on remount without persistence**

If `<Windows />` unmounts and remounts (e.g. during a route transition), all open window state is lost unless `localStorageKey` is provided. There is no in-memory fallback between mounts; the state lives only in localStorage.

**`createWindow` vs `useWindow` vs `registerGlobal` — when to use each**

- `createWindow` — call once at module scope (outside any component) to define a window type. It automatically calls `registerGlobal`. Never call it inside a component or effect.
- `useWindow(MyWindow)` / `useWindow(MyWindow, id)` — call inside a component to get open/close/focus/restore/maximize commands for a specific window type. The hook form with no id returns commands that require an id at open time; the form with an id fixes the id at hook time.
- `useWindow()` (no args) — call from inside window content (a component rendered by a `createWindow` definition) to get `close` and `setTitle` for the current window. Throws if called outside window content.
- `registerGlobal` is an implementation detail on `windowsDefinitionsManager` — it is called by `createWindow` and should never be called directly.

**`<Windows />` must be mounted before any `open` call resolves**

`useWindow` defers manager lookup until `open` is called, not at hook time. Calling `open` before `<Windows />` has mounted will throw because no manager is registered. Opening in `useLayoutEffect` on a component that is a sibling or ancestor of `<Windows />` is safe as long as `<Windows />` has mounted first in the same layout pass.

**`doNotPersist: true` in `createWindow` options excludes a window type from localStorage**

Only windows whose args are JSON-serializable and whose definition does not set `doNotPersist: true` are written to localStorage. If a window type stores non-serializable args (e.g. functions, class instances), it is silently skipped during persistence. There is no warning.

## Related

- [../Dialog/AGENTS.md](../Dialog/AGENTS.md) — `Dialog` is built on top of `InternalWindows` with `managerType="dialogs"`; it shares `createWindow` definitions but uses `useDialog` rather than `useWindow`
- [../../providers/UIStateProvider/AGENTS.md](../../providers/UIStateProvider/AGENTS.md) — `UIStateProvider` with a `storageKey` is an alternative persistence mechanism used elsewhere in the library; the Windows `localStorageKey` prop is its own direct localStorage integration independent of that provider

---

[← Back to Components](../AGENTS.md)
