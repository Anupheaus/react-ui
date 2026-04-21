# Drawer

A slide-in panel that opens from the right side of the screen. Use the `useDrawer` hook to obtain a bound `Drawer` component together with `openDrawer` / `closeDrawer` helpers, avoiding manual state management.

## Usage

```tsx
import { useDrawer } from '@anupheaus/react-ui';

function MyComponent() {
  const { Drawer, openDrawer } = useDrawer();

  return (
    <>
      <Button onClick={openDrawer}>Open settings</Button>
      <Drawer title="Settings" onClose={reason => console.log('closed:', reason)}>
        <p>Drawer content here</p>
      </Drawer>
    </>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `ReactNode` | No | Title displayed in the drawer's header bar |
| `headerActions` | `ReactNode` | No | Additional action elements rendered in the header alongside the title |
| `children` | `ReactNode` | No | Body content of the drawer |
| `className` | `string` | No | Additional CSS class applied to the drawer paper element |
| `disableBackdropClick` | `boolean` | No | Prevent the drawer from closing when the backdrop is clicked |
| `disableEscapeKeyDown` | `boolean` | No | Prevent the drawer from closing on Escape key |
| `onClose` | `(reason: DrawerCloseReasons) => boolean \| void` | No | Called before closing; return `false` to cancel the close |

`DrawerCloseReasons` is `'backdropClick' | 'escapeKeyDown' | 'drawerClosed'`.

## useDrawer return value

| Property | Type | Description |
|----------|------|-------------|
| `Drawer` | Component | The drawer component pre-bound to internal open/close state |
| `openDrawer` | `() => void` | Open the drawer |
| `closeDrawer` | `() => void` | Close the drawer |

## Architecture

- **`Drawer.tsx`** — renders a MUI `Drawer` with an `AppBar`/`Toolbar` header containing a close button, title, and optional header actions. Accepts a `DistributedState<boolean>` prop for open state.
- **`useDrawer.tsx`** — creates the `DistributedState<boolean>`, wraps `Drawer` to inject it, and exposes `openDrawer` / `closeDrawer`.

---

[← Back to Components](../AGENTS.md)
