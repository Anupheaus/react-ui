# ToggleButtonGroup

A group of mutually exclusive toggle buttons. Exactly one button can be active at a time. Renders each item as a `Button` and highlights the selected one. Supports validation (required selection) via the standard `Field` container.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `ReactListItem[]` | Yes | The buttons to render. Each item requires at least `id` and `text` (or `label`) |
| `value` | `string` | No | The `id` of the currently selected item |
| `isOptional` | `boolean` | No | When `false` (default) a selection is required; validation triggers when empty |
| `requiredMessage` | `string` | No | Validation message shown when no item is selected. Defaults to `'Please select an option'` |
| `label` | `ReactNode` | No | Label rendered above the group |
| `help` | `ReactNode` | No | Help tooltip content |
| `error` | `ReactNode` | No | External error message |
| `assistiveHelp` | `ReactNode` | No | Secondary help text |
| `wide` | `boolean` | No | Grow to fill available width |
| `width` | `string \| number` | No | Explicit width |
| `onChange` | `(value: string) => void` | No | Called with the `id` of the item that was clicked |

## Usage

```tsx
import { ToggleButtonGroup } from '@anupheaus/react-ui';

const views = [
  { id: 'list', text: 'List' },
  { id: 'grid', text: 'Grid' },
  { id: 'table', text: 'Table' },
];

function Example() {
  const [view, setView] = useState('list');

  return (
    <ToggleButtonGroup
      label="View"
      items={views}
      value={view}
      onChange={setView}
    />
  );
}
```

---

[← Back to Components](../README.md)
