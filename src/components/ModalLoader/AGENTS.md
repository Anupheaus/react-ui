# ModalLoader

A modal loading overlay that blurs and dims the page content while one or more async operations are in progress. Each operation is tracked independently with its own message and status icon. When all operations complete the modal slides out. Use `useModalLoader` to show and hide individual loading entries from anywhere in the component tree.

## Exports

| Export | Description |
|--------|-------------|
| `ModalLoader` | Component — wraps a section of the UI and renders the modal overlay. |
| `useModalLoader` | Hook — returns `showLoading` / `hideLoading` functions for a single tracked operation. |

---

## ModalLoader

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Application content to render behind the overlay. |
| `hidingDelay` | `number` | No | Milliseconds to wait after marking an operation successful before removing it from the list. Allows the success icon to be visible briefly. Defaults to `500`. |

---

## useModalLoader

Must be called inside a `ModalLoader` subtree. Each call site gets a unique auto-generated ID so multiple concurrent operations can be tracked independently.

### Return value

| Function | Signature | Description |
|----------|-----------|-------------|
| `showLoading` | `(message: ReactNode) => void` | Registers this operation as in-progress and displays `message` in the modal. Shows the modal if it is not already visible. |
| `hideLoading` | `() => void` | Marks this operation as successful (shows a tick icon), then removes it after `hidingDelay` ms. |

## Usage

```tsx
import { ModalLoader, useModalLoader } from '@anupheaus/react-ui';

// 1. Mount the provider once around the content that should be overlaid
function PageLayout({ children }: { children: ReactNode }) {
  return (
    <ModalLoader>
      {children}
    </ModalLoader>
  );
}

// 2. Use the hook in any child component
function DataGrid() {
  const { showLoading, hideLoading } = useModalLoader();

  const handleRefresh = async () => {
    showLoading('Refreshing data…');
    try {
      await fetchData();
    } finally {
      hideLoading();
    }
  };

  return <Button onClick={handleRefresh}>Refresh</Button>;
}
```

## Architecture

- The overlay uses CSS `blur` + `brightness` on the children wrapper to indicate blocking.
- The modal dialog slides in from above via a CSS keyframe animation and slides down when all items have succeeded.
- Multiple `useModalLoader` callers within the same `ModalLoader` each contribute a row to the modal; rows are displayed in insertion order.
- `showLoading` and `hideLoading` are safe to call after the `ModalLoader` unmounts — the `useOnUnmount` guard prevents state updates on an unmounted component.

---

[← Back to Components](../AGENTS.md)
