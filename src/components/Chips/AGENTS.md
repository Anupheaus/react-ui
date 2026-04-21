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

## Decision rationale

**Why InternalDropDown instead of a bespoke input?** InternalDropDown provides the full field chrome (label, error, disabled, readOnly, placeholder, open/close panel) for free. Chips only needs to solve the multi-select problem on top of that — it does not need to re-implement focus management, panel positioning, or keyboard navigation.

**How the multi-value model works.** The `value` prop is an array of IDs (`T[]`). The dropdown's own `value` prop expects a single ID, so Chips synthesises a fake `ReactListItem` with `id: 'fake'` and injects the rendered chip tokens as its `label`. This synthetic item is passed as `value="fake"` to `InternalDropDown`, keeping the dropdown "satisfied" that something is selected while the real selection state lives entirely in the `value` array. When the user picks an item from the dropdown panel, `handleSelected` appends the new ID and deduplicates via `.distinct()`. When the user clicks the `x` on a chip, `handleDelete` filters that ID out.

## Ambiguities and gotchas

- **Chip removal does not clear the dropdown's panel selection.** The dropdown always shows `value="fake"`, so removing all chips does not cause the panel to visually deselect anything. The panel reflects the full `values` list, not the current selection state.
- **When all chips are removed, `onChange` is called with `[]`.** There is no special "empty" state — the component is always controlled; if the parent does not update `value` after receiving `[]` the chips will reappear on the next render.
- **Controlled only.** There is no internal state for the selection. If `onChange` is not provided, chip clicks and deletions do nothing visible because the `value` prop never changes.
- **Duplicate prevention is client-side.** `.distinct()` deduplicates IDs on add, so selecting the same item twice from the dropdown does not create a duplicate chip, but this is a convenience — the source of truth is whatever the parent passes back as `value`.
- **The `values` prop drives both the dropdown panel options and the chip text lookup.** If an ID in `value` has no matching entry in `values`, the corresponding `Chip` renders with `value={undefined}` — `ReactListItem.render` must tolerate `undefined` or the chip will be blank.

## Related

- [../InternalDropDown/AGENTS.md](../InternalDropDown/AGENTS.md) — Chips is built directly on top of InternalDropDown; understanding the dropdown's open/close, panel, and value contract is essential.
- [../Field/AGENTS.md](../Field/AGENTS.md) — InternalDropDown wraps Field, so all field-level props (label, error, disabled, readOnly) flow through that chain.
- [../../models/AGENTS.md](../../models/AGENTS.md) — `ReactListItem` is the item type for both `values` and the synthetic chip-list item; see there for the `id`/`text`/`label` shape and `ReactListItem.render`.

---

[← Back to Components](../AGENTS.md)
