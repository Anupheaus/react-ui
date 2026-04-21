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

## Decision rationale

**Radio vs Checkbox vs ToggleButtonGroup — when to use each.**
- Use `Radio` when the user must choose exactly one option from a short list and the semantic is "pick one from a set" — classic single-select with visible radio circles. The options are typically text labels, possibly with icons or help text.
- Use `Checkbox` for a single boolean value (on/off, agree/disagree) or for a multi-select list where each item is independently toggled.
- Use `ToggleButtonGroup` when the options are mode-like (e.g. "List / Grid / Table") and a button-bar visual is appropriate. ToggleButtonGroup renders `Button` elements; Radio renders its own circular graphic. Choose Radio when the form context demands standard form control appearance; choose ToggleButtonGroup for a toolbar or segmented-control look.

**How `useDistributedState` drives single-selection.** Radio creates a `DistributedState<string>` from the current `value` prop and passes it down to every `RadioOption`. Each `RadioOption` independently subscribes to that state with `getAndObserve()`. When any option is clicked it calls `set(item.id)`, which updates the shared state and re-renders only the options whose selected status changed — without re-rendering the `Radio` parent. The `onSelectedChange` subscription in `Radio` bridges the distributed state back to the `onChange` callback.

## Ambiguities and gotchas

- **`value` is a string ID, not the item object.** `onChange` also receives a string ID. Never pass the full `ReactListItem` object.
- **Single-selection is enforced by shared state, not by a native `<input type="radio">`.** There are no `name` attributes or native radio groups involved. The mutual exclusivity comes from all `RadioOption` components sharing the same `DistributedState` instance.
- **Clicking a selected option does not deselect it.** `set(item.id)` always writes the ID; there is no toggle. To allow deselection you would need a custom `onSelectChange` on the item — the core component does not support it.
- **`isOptional` defaults to `false`.** If you omit it, an empty selection will fail validation and display `requiredMessage`. Pass `isOptional={true}` to suppress validation.
- **`onSelectChange` on individual `ReactListItem` entries is called in addition to the group `onChange`.** This is useful for per-item side effects but can cause confusion if both callbacks are used simultaneously.

## Related

- [../Checkbox/AGENTS.md](../Checkbox/AGENTS.md) — sibling boolean/multi-select control; use Checkbox instead of Radio when the selection is not mutually exclusive or when it is a single on/off toggle.
- [../ToggleButtonGroup/AGENTS.md](../ToggleButtonGroup/AGENTS.md) — visual alternative for single-select from a fixed set; prefer when a button-bar appearance is appropriate.
- [../../models/AGENTS.md](../../models/AGENTS.md) — `ReactListItem` is the item type for `values`; the `id`, `text`/`label`, `iconName`, `help`, and `onSelectChange` fields are all relevant here.

---

[← Back to Components](../AGENTS.md)
