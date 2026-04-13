# useFileUploader

Provides a programmatic file-picker experience: returns a `selectFile` function that opens the native file dialog and resolves with the chosen files, plus a `FileUploader` component that must be rendered in the tree to host the hidden `<input type="file">`.

## Signature

```ts
function useFileUploader(): { selectFile: () => Promise<File[]>; FileUploader: ComponentType<FileUploaderProps> }
```

## Parameters

No parameters on the hook itself. The `FileUploader` component accepts:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `allowMultiple` | `boolean` | No | Whether the user can select more than one file (default `false`). |
| `fileTypes` | `string[]` | No | Array of accepted MIME types or file extensions passed to the `accept` attribute (default `[]`). |

## Returns

| Property | Type | Description |
|----------|------|-------------|
| `selectFile` | `() => Promise<File[]>` | Opens the file picker and resolves with the selected files. Resolves with an empty array if the user cancels. |
| `FileUploader` | `ComponentType<FileUploaderProps>` | A hidden `<input type="file">` component that must be rendered somewhere in the tree for `selectFile` to work. |

## Usage

```tsx
import { useFileUploader } from '@anupheaus/react-ui';

function ImagePicker() {
  const { selectFile, FileUploader } = useFileUploader();

  const handlePick = async () => {
    const files = await selectFile();
    if (files.length > 0) {
      console.log('Selected:', files[0].name);
    }
  };

  return (
    <>
      <FileUploader allowMultiple={false} fileTypes={['image/*']} />
      <button onClick={handlePick}>Choose image</button>
    </>
  );
}
```

---

[← Back to Hooks](../README.md)
