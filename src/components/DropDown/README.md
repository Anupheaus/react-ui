# DropDown

A single-select dropdown (select box) built on top of `InternalDropDown`. Clicking the field opens a popover list; selecting an item closes the popover and fires `onChange`. Supports optional items, custom value rendering, filtering, and validation.

## Props

`DropDown` accepts all props from `InternalDropDown`:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | No | The `id` of the currently selected item |
| `values` | `ReactListItem[]` | No | The list of items to display in the dropdown |
| `isOptional` | `boolean` | No | When `true` an "N/A" entry is prepended to the list, allowing the user to clear the selection |
| `optionalItemLabel` | `ReactNode` | No | Custom label for the optional "N/A" entry. Defaults to `'N/A'` |
| `readOnlyValue` | `ReactNode` | No | Custom content shown in place of the selected value when the field is read-only |
| `endAdornments` | `ReactNode` | No | Additional adornments rendered after the built-in chevron button |
| `requiredMessage` | `string` | No | Validation message when nothing is selected and `isOptional` is `false`. Defaults to `'Please select a value'` |
| `onFilterValues` | `(values: ReactListItem[]) => PromiseMaybe<ReactListItem[]>` | No | Optional async transform applied to `values` before the list is rendered |
| `label` | `ReactNode` | No | Field label |
| `help` | `ReactNode` | No | Help tooltip content |
| `error` | `ReactNode` | No | External error message |
| `assistiveHelp` | `ReactNode` | No | Secondary help text |
| `wide` | `boolean` | No | Grow to fill available width |
| `width` | `string \| number` | No | Explicit width |
| `onChange` | `(id: string \| undefined) => void` | No | Called with the selected item's `id`, or `undefined` when the optional "N/A" entry is chosen |
| `onBlur` | `(event: FocusEvent<HTMLDivElement>) => void` | No | Called when the field loses focus |

## Usage

```tsx
import { DropDown } from '@anupheaus/react-ui';

const options = [
  { id: '1', text: 'Option 1' },
  { id: '2', text: 'Option 2' },
  { id: '3', text: 'Option 3' },
];

function Example() {
  const [value, setValue] = useState<string>();

  return (
    <DropDown
      label="Choose an option"
      values={options}
      value={value}
      onChange={setValue}
    />
  );
}
```

---

[← Back to Components](../README.md)
