# Checkbox

A boolean toggle input rendered as a styled checkbox with an optional label. Respects the global `UIState` read-only flag — clicking has no effect when read-only.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `boolean` | No | Current checked state |
| `label` | `ReactNode` | No | Label text/element. If omitted, `children` is used instead |
| `labelPosition` | `'left' \| 'right' \| 'top' \| 'bottom'` | No | Where the label renders relative to the checkbox. Defaults to `'right'` |
| `assistiveHelp` | `ReactNode` | No | Secondary help text rendered below the checkbox |
| `width` | `string \| number` | No | Explicit width for the component |
| `minWidth` | `string \| number` | No | Minimum width |
| `wide` | `boolean` | No | When `true` the component grows to fill available width. Defaults to `false` |
| `help` | `ReactNode` | No | Help tooltip content (forwarded to `Label`) |
| `isOptional` | `boolean` | No | Marks the field as optional (forwarded to `Label`) |
| `onChange` | `(value: boolean) => void` | No | Called with the new checked state when the user toggles the checkbox |

## Usage

```tsx
import { Checkbox } from '@anupheaus/react-ui';

function Example() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox value={checked} onChange={setChecked} labelPosition="right">
      Accept terms and conditions
    </Checkbox>
  );
}
```

---

[← Back to Components](../README.md)
