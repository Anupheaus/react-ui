# ToggleButtonGroup

A group of toggle buttons supporting **single-select** (mutually exclusive — exactly one active) or **multi-select** (any number active) modes. Renders each item as a `Button` and highlights the selected one(s). Supports validation (required selection) via the standard `Field` container.

## Single vs multi-select

The mode is **inferred from the type of `value`** — there is no `multiple` prop:

- **Single-select** (default): `value?: string` / `onChange?(value: string)`. Active when `value` is a string or `undefined`.
- **Multi-select**: `value?: string[]` / `onChange?(values: string[])`. Active when `value` is an array (including an empty `[]`). Clicking a button toggles its `id` in/out of the array.

The props are typed as a discriminated union, so `value` and `onChange` must agree:

```ts
type Props = FieldProps & { items: ReactListItem[] } & (
  | { value?: string; onChange?(value: string): void }       // single
  | { value?: string[]; onChange?(values: string[]): void }  // multi
);
```

To start in multi-select mode with nothing selected, pass `value={[]}` rather than `undefined` — an undefined `value` resolves to single-select.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `ReactListItem[]` | Yes | The buttons to render. Each item requires at least `id` and `text` (or `label`) |
| `value` | `string \| string[]` | No | Single mode: the `id` of the selected item. Multi mode: the `id`s of all selected items. The type chosen here selects the mode |
| `isOptional` | `boolean` | No | When `false` (default) a selection is required; validation triggers when empty (single: no value; multi: empty array) |
| `requiredMessage` | `string` | No | Validation message shown when no item is selected. Defaults to `'Please select an option'` |
| `label` | `ReactNode` | No | Label rendered above the group |
| `help` | `ReactNode` | No | Help tooltip content |
| `error` | `ReactNode` | No | External error message |
| `assistiveHelp` | `ReactNode` | No | Secondary help text |
| `wide` | `boolean` | No | Grow to fill available width |
| `width` | `string \| number` | No | Explicit width |
| `onChange` | `(value: string) => void` \| `(values: string[]) => void` | No | Single mode: called with the `id` of the clicked item. Multi mode: called with the full array of selected `id`s after toggling |

## Usage

```tsx
import { ToggleButtonGroup } from '@anupheaus/react-ui';

const views = [
  { id: 'list', text: 'List' },
  { id: 'grid', text: 'Grid' },
  { id: 'table', text: 'Table' },
];

// Single-select — value is a string
function SingleExample() {
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

// Multi-select — value is a string[] (start with [] for "nothing selected")
function MultiExample() {
  const [selectedViews, setSelectedViews] = useState<string[]>([]);

  return (
    <ToggleButtonGroup
      label="Views"
      items={views}
      value={selectedViews}
      onChange={setSelectedViews}
    />
  );
}
```

---

## Decision rationale

**ToggleButtonGroup vs Radio — how to choose.**
- Use `ToggleButtonGroup` when the options represent modes or views (e.g. "List / Grid / Table", "Day / Week / Month") and a segmented-button bar suits the layout. Each option renders as a `Button` with the active one using the `default` variant and inactive ones using the `hover` variant, giving a toolbar appearance.
- Use `Radio` when the form context demands a standard form-control appearance with circular radio graphics, optional help text per option, or icon support per option. Radio is the right choice inside a `<form>` or settings panel; ToggleButtonGroup is the right choice in a toolbar or filter bar.
- Both enforce single-selection from a fixed set; the difference is purely visual and contextual.

**Selection state lives in the parent, not in the component.** `ToggleButtonGroup` is fully controlled — it derives `isSelected` for each `ToggleButton` from `value` (single: `item.id === value`; multi: `value.includes(item.id)`). There is no internal selection state. This is intentional: the component acts as a display/dispatch layer, keeping state management in the parent. In multi-select mode the component computes the next array (toggling the clicked `id`) and passes the whole array to `onChange` — it does not mutate the array in place.

**`item.onClick` is preserved.** When a button is clicked, ToggleButtonGroup first calls the item's own `onClick` (if any), then calls the group `onChange`. This lets individual items carry their own side-effect handlers without losing group-level notification.

**Loading shows the single field content skeleton, not per-button skeletons.** When `isLoading`, `Field` paints one block-shaped skeleton over the whole field content (it wraps the buttons in `NoSkeletons`, so the individual `ToggleButton`/`Button` skeletons are suppressed in favour of one field-level block). The group uses `Field`'s default skeleton — no special handling — and relies on `Field` passing `fill` to its skeleton so it actually fills the container. See [../Skeleton/AGENTS.md](../Skeleton/AGENTS.md) for why the `fill` prop is needed.

## Ambiguities and gotchas

- **No button is ever forced to be selected.** If `value` is `undefined`/`[]` or matches no item ID, all buttons render as inactive (`hover` variant). The component does not auto-select the first item. If you need a default, set it in the parent's initial state.
- **Mode is decided by `value`'s type, not a prop.** A string (or `undefined`) is single-select; an array (including `[]`) is multi-select. To begin multi-select with nothing chosen, initialise the parent state to `[]` — `undefined` falls back to single-select.
- **`isOptional` defaults to `false`.** An empty selection triggers validation and displays `requiredMessage` — for single that means no `value`, for multi an empty array. (`validateRequired` does not understand arrays, so the component maps an empty multi-select array to "nothing selected" before validating.) To allow no selection, pass `isOptional={true}`.
- **`items` is required, not optional.** Passing an empty array renders no buttons and the validation for a required field will immediately fire.
- **`item.isSelected` on the source item is respected but can be overridden by `value`.** The render logic is `item.isSelected ?? selectedIds.includes(item.id)`. If an item carries `isSelected: true` and `value` does not select its ID, the item's own `isSelected` wins — in single-select mode this can produce multiple visually-selected buttons, violating the single-select contract. Do not set `isSelected` on items when using the `value` prop.
- **`disableRipple` is passed to `Field`.** The ripple is handled at the `Button` level inside each `ToggleButton`, not at the Field level.

## Related

- [../Radio/AGENTS.md](../Radio/AGENTS.md) — semantically equivalent single-select control with a form-control appearance; see that file for guidance on when to prefer Radio over ToggleButtonGroup.
- [../../models/AGENTS.md](../../models/AGENTS.md) — `ReactListItem` is the item type for `items`; the `id`, `text`/`label`, `isSelected`, and `onClick` fields are relevant here.

---

[← Back to Components](../AGENTS.md)
