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
