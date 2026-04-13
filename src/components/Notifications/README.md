# Notifications

A toast notification system built on `react-hot-toast`. `NotificationsProvider` mounts the toast renderer once near the root of the app; the `useNotifications` hook is used anywhere in the tree to fire toasts programmatically.

## Exports

| Export | Description |
|--------|-------------|
| `NotificationsProvider` | Component — mounts the `react-hot-toast` `<Toaster>` at the bottom-centre of the viewport. |
| `useNotifications` | Hook — returns functions for showing typed toast messages. |

---

## NotificationsProvider

Wrap your application (or the portion of it that needs notifications) once with this provider. It renders a `<Toaster position="bottom-center">` from `react-hot-toast` and passes children through unchanged.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Application content. |

---

## useNotifications

Returns four functions, one per notification type. Each function deduplicates toasts by message string — a second call with the same message replaces the existing toast rather than stacking a duplicate.

### Return value

| Function | Signature | Description |
|----------|-----------|-------------|
| `showSuccess` | `(message: string, options?: NotificationProps) => void` | Green success toast with a checkmark icon. |
| `showError` | `(message: string, options?: NotificationProps) => void` | Dark-red error toast with an error icon. |
| `showWarning` | `(message: string, options?: NotificationProps) => void` | Amber warning toast with a warning icon. |
| `showInfo` | `(message: string, options?: NotificationProps) => void` | Blue info toast. |

### NotificationProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `timeout` | `number` | No | Duration in milliseconds before the toast auto-dismisses. Defaults to `5000`. Pass `0` for a persistent toast — a close button is added automatically. |

## Usage

```tsx
import { NotificationsProvider, useNotifications } from '@anupheaus/react-ui';

// 1. Mount the provider once near the app root
function App() {
  return (
    <NotificationsProvider>
      <Router />
    </NotificationsProvider>
  );
}

// 2. Use the hook anywhere inside the tree
function SaveButton() {
  const { showSuccess, showError } = useNotifications();

  const handleSave = async () => {
    try {
      await api.save();
      showSuccess('Changes saved successfully.');
    } catch (e) {
      showError('Save failed — please try again.', { timeout: 0 });
    }
  };

  return <Button onClick={handleSave}>Save</Button>;
}
```

## Architecture

- Toast styling is driven by the active theme's `notifications` token (`base`, `success`, `error`, `warning`, `info`). Sensible defaults are applied when the theme does not define this token.
- Persistent toasts (`timeout: 0`) include an inline close button. Error toasts style the close button with a white-on-transparent hover theme.
- The `toast` id is set to the message string, so calling the same message twice updates the existing toast in place.

---

[← Back to Components](../README.md)
