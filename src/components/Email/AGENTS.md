# Email

A text input for email addresses. It validates the format on blur and shows an inline error for invalid addresses. A send-email button (opens `mailto:`) is shown by default in the end toolbar; it is disabled while the value is empty or invalid.

## Props

Extends `InternalTextProps<string>` (all `Field` and `Text` props apply).

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | No | Controlled email string |
| `onChange` | `(value: string) => void` | No | Called with the new value on every change |
| `disableSendEmailButton` | `boolean` | No | Hide the send-email toolbar button (default: `false`) |
| `label` | `ReactNode` | No | Label rendered above the field |
| `error` | `ReactNode` | No | Overrides the built-in format validation error |
| `isOptional` | `boolean` | No | Empty value is valid when `true` |
| `wide` | `boolean` | No | Sets width to `100%` |
| `width` | `string \| number` | No | Fixed width |
| `placeholder` | `string` | No | Placeholder text |

## Usage

```tsx
import { Email } from '@anupheaus/react-ui';
import { useState } from 'react';

function ContactForm() {
  const [email, setEmail] = useState('');

  return (
    <Email
      label="Email address"
      value={email}
      onChange={setEmail}
      wide
    />
  );
}
```

### Without the send button

```tsx
<Email
  label="Email"
  value={email}
  onChange={setEmail}
  disableSendEmailButton
/>
```

---

[← Back to Components](../AGENTS.md)
