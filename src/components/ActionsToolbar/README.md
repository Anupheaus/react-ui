# ActionsToolbar

A pre-built toolbar for form-like views that provides Save, Cancel, and Delete buttons with consistent ordering and optional confirmation dialogs. Integrates with the `Form` component's `useFormActions` hook so that Save and Cancel can operate on the surrounding form automatically.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSave` | `() => void` | No | Save handler. If omitted and the toolbar is inside a `Form`, the form's save action is used |
| `onCancel` | `() => void` | No | Cancel handler. If omitted and inside a `Form`, the form's cancel action is used |
| `onDelete` | `() => void` | No | When provided, a Delete button is rendered |
| `saveLabel` | `string` | No | Label for the Save button (default: `'Save'`) |
| `cancelLabel` | `string` | No | Label for the Cancel button (default: `'Cancel'`) |
| `deleteLabel` | `string` | No | Label for the Delete button (default: `'Delete'`) |
| `cancelDialogTitle` | `string` | No | Title of the confirmation dialog shown before cancelling (default: `'Are you sure?'`) |
| `cancelDialogMessage` | `ReactNode` | No | Message shown in the cancel confirmation dialog; omit to skip the dialog |
| `deleteDialogTitle` | `string` | No | Title of the confirmation dialog shown before deleting (default: `'Are you sure?'`) |
| `deleteDialogMessage` | `ReactNode` | No | Message shown in the delete confirmation dialog; omit to skip the dialog |
| `saveClassName` | `string` | No | Additional CSS class for the Save button |
| `cancelClassName` | `string` | No | Additional CSS class for the Cancel button |
| `deleteClassName` | `string` | No | Additional CSS class for the Delete button |
| `className` | `string` | No | Additional CSS class for the toolbar container |
| `isLoading` | `boolean` | No | When `true`, disables all buttons via `UIState` |
| `isSaveReadOnly` | `boolean` | No | When `true`, disables only the Save button |
| `isCancelReadOnly` | `boolean` | No | When `true`, disables only the Cancel button |
| `isDeleteReadOnly` | `boolean` | No | When `true`, disables only the Delete button |
| `children` | `ReactNode` | No | Additional elements appended after the standard buttons |

> **Note:** `cancelDialogMessage` and `deleteDialogMessage` require the toolbar to be rendered inside a `Dialog` that provides `ConfirmationDialogContext`. An error is thrown if a dialog message is set without the context.

## Usage

```tsx
import { ActionsToolbar } from '@anupheaus/react-ui';

// Standalone use
<ActionsToolbar
  onSave={handleSave}
  onCancel={handleCancel}
  onDelete={handleDelete}
  deleteDialogMessage="This record will be permanently removed."
/>

// Inside a Form — onSave and onCancel are inferred automatically
<Form onSave={submitForm} onCancel={resetForm}>
  {/* form fields */}
  <ActionsToolbar />
</Form>
```

---

[← Back to Components](../README.md)
