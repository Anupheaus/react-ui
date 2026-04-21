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

## Decision rationale

**ToggleButtonGroup vs Radio — how to choose.**
- Use `ToggleButtonGroup` when the options represent modes or views (e.g. "List / Grid / Table", "Day / Week / Month") and a segmented-button bar suits the layout. Each option renders as a `Button` with the active one using the `default` variant and inactive ones using the `hover` variant, giving a toolbar appearance.
- Use `Radio` when the form context demands a standard form-control appearance with circular radio graphics, optional help text per option, or icon support per option. Radio is the right choice inside a `<form>` or settings panel; ToggleButtonGroup is the right choice in a toolbar or filter bar.
- Both enforce single-selection from a fixed set; the difference is purely visual and contextual.

**Selection state lives in the parent, not in the component.** `ToggleButtonGroup` is fully controlled — it derives `isSelected` for each `ToggleButton` by comparing `item.id === value`. There is no internal selection state. This is intentional: the component acts as a display/dispatch layer, keeping state management in the parent.

**`item.onClick` is preserved.** When a button is clicked, ToggleButtonGroup first calls the item's own `onClick` (if any), then calls the group `onChange`. This lets individual items carry their own side-effect handlers without losing group-level notification.

## Ambiguities and gotchas

- **No button is ever forced to be selected.** If `value` is `undefined` or does not match any item ID, all buttons render as inactive (`hover` variant). The component does not auto-select the first item. If you need a default, set it in the parent's initial state.
- **`isOptional` defaults to `false`.** An empty `value` will trigger validation and display `requiredMessage`. To allow no selection, pass `isOptional={true}`.
- **`items` is required, not optional.** Passing an empty array renders no buttons and the validation for a required field will immediately fire.
- **`item.isSelected` on the source item is respected but can be overridden by `value`.** The render logic is `item.isSelected ?? (item.id === value)`. If an item carries `isSelected: true` and `value` does not match its ID, the item's own `isSelected` wins — this can produce multiple visually-selected buttons, which violates the single-select contract. Do not set `isSelected` on items when using the `value` prop.
- **`disableRipple` is passed to `Field`.** The ripple is handled at the `Button` level inside each `ToggleButton`, not at the Field level.

## Related

- [../Radio/AGENTS.md](../Radio/AGENTS.md) — semantically equivalent single-select control with a form-control appearance; see that file for guidance on when to prefer Radio over ToggleButtonGroup.
- [../../models/AGENTS.md](../../models/AGENTS.md) — `ReactListItem` is the item type for `items`; the `id`, `text`/`label`, `isSelected`, and `onClick` fields are relevant here.

---

[← Back to Components](../AGENTS.md)
