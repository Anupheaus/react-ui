# Password

A password input that extends `Text` / `InternalText` with a built-in show/hide toggle button. The toggle switches between `type="password"` (masked) and `type="text"` (visible) on click.

## Props

Extends all props from `InternalTextProps<string>` (same as `Text`). The key additional prop is:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | No | Controlled value |
| `onChange` | `(value: string) => void` | No | Called with the new string on every change |
| `endAdornments` | `ReactElement[]` | No | Additional buttons appended after the show/hide toggle in the end toolbar |
| `label` | `ReactNode` | No | Label rendered above the field |
| `error` | `ReactNode` | No | Error message shown below the field |
| `isOptional` | `boolean` | No | Marks the field as optional |
| `wide` | `boolean` | No | Sets width to `100%` |
| `width` | `string \| number` | No | Fixed width |
| `placeholder` | `string` | No | Placeholder text |
| `maxLength` | `number` | No | Maximum character count |
| `initialFocus` | `boolean` | No | Auto-focus on mount |

See [`Text`](../Text/AGENTS.md) for the full inherited prop list.

## Usage

```tsx
import { Password } from '@anupheaus/react-ui';
import { useState } from 'react';

function LoginForm() {
  const [password, setPassword] = useState('');

  return (
    <Password
      label="Password"
      value={password}
      onChange={setPassword}
      wide
    />
  );
}
```

---

[← Back to Components](../AGENTS.md)
