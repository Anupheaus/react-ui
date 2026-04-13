# Text

A single-line (or multiline) text input that wraps `InternalText` and `Field`. Use it whenever you need a plain string input with label, error, and help support.

## Props

Extends `FieldProps` (label, error, help, width, isOptional, etc.) via `InternalTextProps<string>`.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | No | Controlled value |
| `onChange` | `(value: string) => void` | No | Called with the new string on every change |
| `multiline` | `number` | No | When > 1, renders a `<textarea>` with this many visible rows |
| `placeholder` | `string` | No | Placeholder text shown when the input is empty |
| `maxLength` | `number` | No | Maximum number of characters allowed |
| `transform` | `'uppercase' \| 'lowercase' \| 'capitalize' \| 'none'` | No | CSS text transform applied to the input (default: `'none'`) |
| `initialFocus` | `boolean` | No | Automatically focus the input on mount |
| `startAdornments` | `ReactNode` | No | Content rendered in a toolbar at the start of the field |
| `endAdornments` | `ReactNode` | No | Content rendered in a toolbar at the end of the field |
| `useFloatingStartAdornments` | `boolean` | No | Start adornments slide in on focus instead of being always visible |
| `useFloatingEndAdornments` | `boolean` | No | End adornments slide in on focus instead of being always visible |
| `onFocus` | `FocusEvent handler` | No | Called when the input gains focus |
| `onBlur` | `FocusEvent handler` | No | Called when the input loses focus |
| `onKeyDown` | `KeyboardEvent handler` | No | Called on key down |
| `onKeyUp` | `KeyboardEvent handler` | No | Called on key up |
| `onEnter` | `KeyboardEvent handler` | No | Convenience handler called when Enter is pressed |
| `label` | `ReactNode` | No | Label rendered above the field |
| `error` | `ReactNode` | No | Error message shown below the field |
| `help` | `ReactNode` | No | Help content shown next to the label |
| `isOptional` | `boolean` | No | Marks the field as optional |
| `wide` | `boolean` | No | Sets width to `100%` |
| `width` | `string \| number` | No | Fixed width |

## Usage

```tsx
import { Text } from '@anupheaus/react-ui';
import { useState } from 'react';

function Example() {
  const [name, setName] = useState('');

  return (
    <Text
      label="Full name"
      value={name}
      onChange={setName}
      placeholder="Enter your name"
      wide
    />
  );
}
```

### Multiline

```tsx
<Text
  label="Notes"
  value={notes}
  onChange={setNotes}
  multiline={4}
/>
```

---

[← Back to Components](../README.md)
