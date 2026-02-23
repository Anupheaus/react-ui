# Dialogs Component

## Overview

The Dialogs component renders modal dialogs. It uses the same window infrastructure as Windows but with dialog-specific styling and behavior (e.g., overlay, blur). Each `useDialog` hook instance manages a single dialog instance.

## Usage

### 1. Mount the Dialogs component

```tsx
<Dialogs />
```

Or with optional blur effect when dialogs are open:

```tsx
<Dialogs shouldBlurBackground />
```

### 2. Define dialogs with createDialog

```tsx
const MyDialog = createDialog('MyDialog', ({ Dialog, Content, Actions, OkButton, close }) => (message: string) => (
  <Dialog title="My Dialog">
    <Content>{message}</Content>
    <Actions>
      <OkButton />
    </Actions>
  </Dialog>
));
```

### 3. Open dialogs with useDialog

Dialogs use a **single instance per hook**—the id is derived from the hook. Call `open(args)` with only the dialog args:

```tsx
const { openMyDialog, closeMyDialog } = useDialog(MyDialog);
const result = await openMyDialog('Hello!');
// result is the value passed to close() when the dialog closes
```

### 4. Confirmation dialogs

Use `useConfirmationDialog` for yes/no confirmations:

```tsx
const { openConfirmationDialog } = useConfirmationDialog();
const confirmed = await openConfirmationDialog('Delete item?', 'This cannot be undone.');
if (confirmed) {
  // user clicked Yes
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Manager id. Defaults to `dialogs-default`. |
| `className` | `string` | CSS class for the container. |
| `shouldBlurBackground` | `boolean` | When true, blurs background content when dialogs are open. Default: `false`. |
| `children` | `ReactNode` | Content rendered behind the dialog overlay. |

## Notes

- Dialogs **do not persist**—there is no `localStorageKey` prop.
- Dialogs must be used within a mounted `<Dialogs>` component.
- `createDialog` returns a dialog-only definition; use `useDialog` (not `useWindow`) with it.
- The `close` method returns a promise that resolves with the value passed to `close()` when the dialog is dismissed.
