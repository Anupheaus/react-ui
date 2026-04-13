# Radio

A radio button group that renders a list of mutually exclusive options. Supports horizontal and vertical layouts, validation, and the standard `Field` decorators (label, help, error, assistive text).

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `values` | `ReactListItem[]` | No | The list of options to render. Each item has at least `id` and `text` (or `label`) |
| `value` | `string` | No | The `id` of the currently selected option |
| `isHorizontal` | `boolean` | No | Renders options in a row when `true`. Defaults to `false` (vertical) |
| `isOptional` | `boolean` | No | When `false` (default) a selection is required; triggers validation when empty |
| `requiredMessage` | `ReactNode` | No | Validation message shown when no option is selected and the field is required. Defaults to `'You must select an option'` |
| `label` | `ReactNode` | No | Label rendered above the group (from `FieldProps`) |
| `help` | `ReactNode` | No | Help tooltip content |
| `error` | `ReactNode` | No | External error message to display |
| `assistiveHelp` | `ReactNode` | No | Secondary help text below the group |
| `width` | `string \| number` | No | Explicit width |
| `wide` | `boolean` | No | Grow to fill available width |
| `onChange` | `(value: string) => void` | No | Called with the `id` of the newly selected option |

## Usage

```tsx
import { Radio } from '@anupheaus/react-ui';

const options = [
  { id: 'a', text: 'Option A' },
  { id: 'b', text: 'Option B' },
  { id: 'c', text: 'Option C' },
];

function Example() {
  const [selected, setSelected] = useState('');

  return (
    <Radio
      label="Choose an option"
      values={options}
      value={selected}
      onChange={setSelected}
    />
  );
}
```

---

[← Back to Components](../README.md)
