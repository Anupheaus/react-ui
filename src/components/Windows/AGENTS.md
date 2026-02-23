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
