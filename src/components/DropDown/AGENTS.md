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

## Decision rationale

`DropDown` is deliberately a near-empty pass-through. All logic — popover open/close, width tracking, optional-item injection, async filtering, validation, and loading state — lives in `InternalDropDown`. `DropDown` exists solely to provide the public API surface and the `tagName="dropdown"` discriminator that scopes validation IDs.

**When to use DropDown vs Autocomplete vs Selector:**
- Use `DropDown` when the user must pick exactly one item from a fixed or pre-loaded list and does not need to type to search.
- Use `Autocomplete` when the user types to filter or search (locally or via server) and the list may be too large to show all at once.
- Use `Selector` when you need a button-group or toggle-style selection rather than a popover list (see `Selector/AGENTS.md` for its model).

## Ambiguities and gotchas

- **`DropDown` has no logic of its own** — if the component behaves unexpectedly, the bug is almost certainly in `InternalDropDown`, not here. Do not add business logic to `DropDown.tsx`.
- **`renderSelectedValue` is not in the public props** — `DropDownProps extends InternalDropDownProps`, and `InternalDropDownProps` does not include `renderSelectedValue` (it is on the internal `Props` type). If you need a custom selected-value renderer, you will have to add it to `InternalDropDownProps` first.
- **`onChange` receives `undefined` for the optional item** — when `isOptional` is `true` and the user picks "N/A", `onChange` is called with `undefined`, not with the sentinel item ID. Type `(id: string | undefined) => void` is correct and intentional.

## Related

- [../InternalDropDown/AGENTS.md](../InternalDropDown/AGENTS.md) — contains all real logic; `DropDown` is just a named wrapper around it
- [../Autocomplete/AGENTS.md](../Autocomplete/AGENTS.md) — searchable sibling; use when users need to type-to-filter
- [../Selector/AGENTS.md](../Selector/AGENTS.md) — button-group sibling; use for toggle/inline selection without a popover
- [../Chips/AGENTS.md](../Chips/AGENTS.md) — multi-select sibling built on `InternalDropDown`
- [../../models/AGENTS.md](../../models/AGENTS.md) — `ReactListItem` is the type for `values`

---

[← Back to Components](../AGENTS.md)
