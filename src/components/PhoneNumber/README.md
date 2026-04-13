# PhoneNumber

A text input for telephone numbers. It restricts keyboard input to digits and the characters `+`, `(`, `)`, `-`, and space, validates the format on blur, and shows a make-call button (opens `tel:`) by default. Maximum length is enforced at 15 characters.

## Props

Extends `InternalTextProps<string>` (all `Field` and `Text` props apply).

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | No | Controlled phone number string |
| `onChange` | `(value: string) => void` | No | Called with the new value on every change |
| `disableMakeCallButton` | `boolean` | No | Hide the make-call toolbar button (default: `false`) |
| `label` | `ReactNode` | No | Label rendered above the field |
| `error` | `ReactNode` | No | Overrides the built-in format validation error |
| `isOptional` | `boolean` | No | Empty value is valid when `true` |
| `wide` | `boolean` | No | Sets width to `100%` |
| `width` | `string \| number` | No | Fixed width |
| `placeholder` | `string` | No | Placeholder text |

## Usage

```tsx
import { PhoneNumber } from '@anupheaus/react-ui';
import { useState } from 'react';

function ContactForm() {
  const [phone, setPhone] = useState('');

  return (
    <PhoneNumber
      label="Phone number"
      value={phone}
      onChange={setPhone}
      wide
    />
  );
}
```

### Without the call button

```tsx
<PhoneNumber
  label="Phone"
  value={phone}
  onChange={setPhone}
  disableMakeCallButton
/>
```

---

[← Back to Components](../README.md)
