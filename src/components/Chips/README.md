# Chips

A multi-select input that renders selected items as removable chip tokens inside a dropdown field. It is built on top of `InternalDropDown` and `Field` so it inherits the standard field chrome (label, error, disabled, readOnly states).

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `T[]` | No | Array of selected item IDs (where `T extends string`). |
| `values` | `ReactListItem[]` | No | Full list of available options. Each item must have `id` and `text` (or `label`). |
| `onChange` | `(values: T[]) => void` | No | Called with the updated selection after an item is added or removed. |
| *(InternalDropDownProps)* | | | All `InternalDropDown` props are forwarded (e.g. `label`, `error`, `disabled`, `readOnly`, `placeholder`). |

## Usage

```tsx
import { Chips } from '@anupheaus/react-ui';
import { ListItem } from '@anupheaus/common';

const options: ListItem[] = [
  { id: '1', text: 'Design' },
  { id: '2', text: 'Engineering' },
  { id: '3', text: 'Marketing' },
];

function MyForm() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <Chips
      label="Departments"
      values={options}
      value={selected}
      onChange={setSelected}
    />
  );
}
```

## Architecture

Each selected ID is rendered as a `Chip` token inside a synthetic list item injected into the dropdown's header area. Selecting an item from the dropdown calls `onChange` with the new deduplicated array; clicking the `x` button on a chip removes that ID from the array.

---

[← Back to Components](../README.md)
