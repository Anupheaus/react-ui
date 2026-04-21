# Switch

A boolean toggle rendered as a Material UI switch, wrapped in the standard `Field` container so it receives a label, help tooltip, error display, and assistive text.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `boolean` | No | Current on/off state. Defaults to `false` |
| `label` | `ReactNode` | No | Label rendered above or beside the switch |
| `isOptional` | `boolean` | No | Marks the field as optional |
| `help` | `ReactNode` | No | Help tooltip content |
| `error` | `ReactNode` | No | External error message |
| `assistiveHelp` | `ReactNode` | No | Secondary help text |
| `wide` | `boolean` | No | Grow to fill available width |
| `width` | `string \| number` | No | Explicit width |
| `onChange` | `(value: boolean) => void` | No | Called with the new state when the user toggles the switch |

## Usage

```tsx
import { Switch } from '@anupheaus/react-ui';

function Example() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch
      label="Enable notifications"
      value={enabled}
      onChange={setEnabled}
    />
  );
}
```

---

[← Back to Components](../AGENTS.md)
