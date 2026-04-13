# PIN

A PIN entry input rendered as a row of individual digit boxes. Each box accepts one character; focus advances automatically as digits are entered and retreats on delete. Supports censored (masked) mode and fires `onSubmit` when the last digit is filled.

## Props

Extends `FieldProps` (label, error, help, width, isOptional, etc.).

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | No | Controlled PIN value (partial values are accepted) |
| `onChange` | `(value: string) => void` | No | Called with the trimmed PIN string on every digit change |
| `onSubmit` | `(value: string) => void` | No | Called when the last digit is entered and the PIN is complete |
| `length` | `number` | No | Number of digit boxes (default: `4`) |
| `isCensored` | `boolean` | No | Show `•` instead of the entered digit (default: `true`) |
| `initialFocus` | `boolean` | No | Auto-focus the first digit box on mount |
| `label` | `ReactNode` | No | Label rendered above the PIN |
| `error` | `ReactNode` | No | Error message shown below the PIN |
| `help` | `ReactNode` | No | Help text shown next to the label |
| `isOptional` | `boolean` | No | Marks the field as optional |
| `className` | `string` | No | Additional class on the outer field element |

## Usage

```tsx
import { PIN } from '@anupheaus/react-ui';
import { useState } from 'react';

function PINEntry() {
  const [pin, setPin] = useState('');

  return (
    <PIN
      label="Enter PIN"
      length={4}
      value={pin}
      onChange={setPin}
      onSubmit={pin => console.log('submitted:', pin)}
      initialFocus
    />
  );
}
```

### Uncensored (visible digits)

```tsx
<PIN label="PIN" length={6} value={pin} onChange={setPin} isCensored={false} />
```

## Architecture

`PIN` delegates layout and label/error rendering to `Field` (with `noContainer` so it has no bordered box) and renders a `Flex` row of `PINDigit` sub-components. Each `PINDigit` manages focus hand-off to adjacent digits via a shared `elementsRef`.

---

[← Back to Components](../README.md)
