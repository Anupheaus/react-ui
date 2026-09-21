# ImageUpload

A generic image picker/preview component. It shows the current image inside a fixed-size frame; clicking anywhere on the frame opens the native file dialog to add or replace the image, and a small red trash button at the top-right clears it. When there is no image, the frame shows a plus icon and an "Add Image" caption, and clicking the whole area opens the dialog. Picked files are handed to a pluggable `onUpload` resolver that returns the URL to store. Designed for use as a `Field` component (e.g. editing a `logoUrl` string field), but works standalone.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | No | Current image source — a hosted URL or a `data:` URL. |
| `onChange` | `(value: string \| undefined) => void` | No | Emits the new source after a successful upload, or `undefined` when the image is removed. |
| `onUpload` | `(file: File) => Promise<string>` | No | Resolves a picked file to a stored URL. Defaults to `fileToDataUrl`, which base64-encodes the file as a `data:` URL — this makes the component fully functional with no backend, and is where a real uploader (e.g. one that posts to a server action) plugs in. |
| `fileTypes` | `string[]` | No | Accepted MIME types / extensions for the file picker. Defaults to `['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']`. |
| `maxSizeBytes` | `number` | No | Optional client-side size guard. Files larger than this are rejected with a notification before `onUpload` is called. |
| `label` | `string` | No | Optional caption rendered above the frame via the shared `Label` component. Omitted (or empty) renders no caption. |
| `className` | `string` | No | Additional CSS class applied to the root frame. |
| `width` | `number` | No | Frame width in pixels. Defaults to `160`. |
| `height` | `number` | No | Frame height in pixels. Defaults to `90`. |
| `previewBackground` | `'light' \| 'dark'` | No | Frame background colour, for previewing logos designed for a light or dark surface. Defaults to `'light'`. |

## Usage

```tsx
import { ImageUpload } from '@anupheaus/react-ui';

// Standalone — stores a base64 data: URL
<ImageUpload value={logoUrl} onChange={setLogoUrl} previewBackground="dark" />

// With a real uploader (e.g. a server action that returns a hosted URL)
<ImageUpload
  value={settings.logoLightUrl}
  onChange={url => updateSettings({ logoLightUrl: url })}
  onUpload={uploadLogoLight}
  maxSizeBytes={2 * 1024 * 1024}
/>

// As a Field component
<Field component={ImageUpload} field="logoLightUrl" label="Logo (light)" onUpload={uploadLight} previewBackground="light" />
```

## Architecture

- Renders `label` (when non-empty) as a caption above the frame using the shared `Label` component.
- The whole frame is clickable and opens the file dialog — to add an image when empty, or replace it when set. When empty it shows a plus (`add`) icon over an "Add Image" caption; when set it shows the image (a real `<img>` with `object-fit: contain` filling the frame — not a CSS `background-image`, whose unquoted `url(...)` is invalid for URLs containing parentheses/spaces) plus a red trash (`delete-list-item`) `Button` at the top-right that clears the value.
- Picking a file uses `useFileUploader`'s `selectFile()`/`FileUploader` pair (a hidden `<input type="file">`). The `FileUploader` is rendered as a sibling of (not inside) the clickable frame, so its programmatic `input.click()` does not bubble back into the frame's click handler and re-open the dialog.
- The picked `File` is passed to `onUpload` (or `fileToDataUrl` by default); the resolved URL is emitted via `onChange`. The trash button clears via `onChange(undefined)` — `Button` stops click propagation so clearing never also opens the dialog.
- Errors thrown by `onUpload` (or a `maxSizeBytes` violation) are surfaced via `useNotifications().showError` rather than thrown further.
- Respects `isReadOnly` from `UIState` — the frame click is a no-op and the trash button is hidden when read-only.

---

[← Back to Components](../AGENTS.md)
