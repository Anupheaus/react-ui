# Selector

A two-level selection component that organises items into named sections. Each section (`SelectorItem`) contains sub-items (`SelectorSubItem`). Selection constraints — total selectable items, and maximum number of sections that can have selections — are controlled via `selectionConfiguration`.

Two public variants are exported:

| Component | Description |
|-----------|-------------|
| `Selector` | Inline selector rendered directly in the page inside a `Field` container |
| `SelectorButton` | A button that opens the selector in a MUI `Popover` |

---

## Data model

```ts
interface SelectorSubItem extends ReactListItem {
  // id, text, label, iconName, isSelected, help, ...
}

interface SelectorItem extends SelectorSubItem {
  maxSelectableItems?: number;   // per-section limit
  subItems: SelectorSubItem[];
}

interface SelectorSelectionConfiguration {
  totalSelectableItems?: number;          // global cap on selected sub-items
  maxSectionsWithSelectableItems?: number; // max sections that can have any selection
}
```

---

## Selector

An always-visible inline selector.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `SelectorItem[]` | Yes | Sections and their sub-items to display |
| `selectionConfiguration` | `SelectorSelectionConfiguration` | No | Constraints on how many items/sections can be selected simultaneously |
| `height` | `string \| number` | No | Fixed height for the selector container |
| `fullHeight` | `boolean` | No | Grow to fill available vertical space |
| `isOptional` | `boolean` | No | When `false` (default) at least one item must be selected |
| `requiredMessage` | `ReactNode` | No | Validation message when nothing is selected. Defaults to `'Please select at least one item'` |
| `label` | `ReactNode` | No | Field label |
| `help` | `ReactNode` | No | Help tooltip content |
| `error` | `ReactNode` | No | External error message |
| `assistiveHelp` | `ReactNode` | No | Secondary help text |
| `wide` | `boolean` | No | Grow to fill available width |
| `width` | `string \| number` | No | Explicit width |
| `onSelect` | `(selectedItems: SelectorSubItem[]) => void` | No | Called with the full list of currently selected sub-items after every selection change |

### Usage

```tsx
import { Selector, type SelectorItem } from '@anupheaus/react-ui';

const items: SelectorItem[] = [
  {
    id: 'furniture',
    text: 'Furniture',
    subItems: [
      { id: 'window', text: 'Window' },
      { id: 'door', text: 'Door' },
    ],
  },
];

function Example() {
  const [selected, setSelected] = useState([]);

  return (
    <Selector
      label="Select items"
      items={items}
      height={300}
      onSelect={setSelected}
    />
  );
}
```

---

## SelectorButton

A compact trigger button that opens the selector inside a popover. The button label reflects the current selection state:

- **Nothing selected** → `"Not Set"`
- **One item selected** → the item's label / text
- **Multiple items selected** → `"N selected"`

In single-select mode the popover closes automatically after a selection is made. In multi-select mode the popover stays open so the user can refine their choices.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `SelectorItem[]` | Yes | Sections and their sub-items |
| `selectionConfiguration` | `SelectorSelectionConfiguration` | No | Constraints on selection; also controls auto-close behaviour |
| `label` | `ReactNode` | No | Field label rendered above the button |
| `help` | `ReactNode` | No | Help tooltip content |
| `error` | `ReactNode` | No | External error message |
| `assistiveHelp` | `ReactNode` | No | Secondary help text |
| `wide` | `boolean` | No | Grow to fill available width |
| `width` | `string \| number` | No | Explicit width |
| `onSelect` | `(selectedItems: SelectorSubItem[]) => void` | No | Called after every selection change with the full list of selected sub-items |

### Auto-close behaviour

The popover closes automatically after a selection when either of the following is true:

- `selectionConfiguration.totalSelectableItems === 1`
- There is exactly one section and that section's `maxSelectableItems === 1`

Otherwise the popover remains open (multi-select mode).

### Usage

```tsx
import { SelectorButton, type SelectorItem } from '@anupheaus/react-ui';

const items: SelectorItem[] = [
  {
    id: 'cat',
    text: 'Category',
    subItems: [
      { id: 'a', text: 'Alpha' },
      { id: 'b', text: 'Beta' },
    ],
  },
];

// Single-select — popover closes on pick
function SingleSelectExample() {
  return (
    <SelectorButton
      label="Pick one"
      items={items}
      selectionConfiguration={{ totalSelectableItems: 1 }}
      onSelect={selected => console.log(selected)}
    />
  );
}

// Multi-select — popover stays open
function MultiSelectExample() {
  return (
    <SelectorButton
      label="Pick many"
      items={items}
      onSelect={selected => console.log(selected)}
    />
  );
}
```

---

## Architecture

- `InternalSelector` owns the selection state and renders a scrollable list of `SelectorSection` components.
- Each `SelectorSection` renders its sub-items as `SelectorSectionItem` components.
- `processSelectedItemsWithSections` enforces the `maxSectionsWithSelectableItems` constraint when a new selection would exceed the section limit.
- `SelectorButtonUtils` provides two pure helpers used by `SelectorButton`:
  - `getButtonLabel` — derives the display text from the current selection.
  - `isSingleSelect` — determines whether the popover should auto-close.

---

## Decision rationale

**Why two variants (`Selector` vs `SelectorButton`).** `Selector` is an always-visible inline control suitable for forms that have enough vertical space to expose the full selection surface at all times. `SelectorButton` is a compact trigger for toolbars, filter bars, or any context where the full selector panel would be too large to show inline — it defers the expanded view to a `Popover`. The choice is driven entirely by layout space, not by feature differences: both delegate to `InternalSelector` for all real behaviour.

**Why sections/grouping that `DropDown` does not have.** The `Selector` is designed for domain data that is naturally partitioned (e.g. room items grouped by room type). The two-level model (`SelectorItem` → `SelectorSubItem`) enforces that structure at the data layer rather than relying on ad-hoc rendering tricks. `DropDown` is a flat single-select widget — adding grouping there would require a different data model and is a different problem entirely.

**`Selector.Configuration.Single` shortcut.** Rather than requiring callers to remember the magic `{ totalSelectableItems: 1 }` object, `Selector.Configuration` exposes named presets. Currently only `Single` exists. This also documents intent — use `Selector.Configuration.Single` rather than reconstructing the object by hand.

**Selection state lives in `InternalSelector`, not in `Selector` or `SelectorButton`.** Both public components derive their initial selected IDs from `items[].subItems[].isSelected` on mount. `InternalSelector` then owns the live selection state as a local `ids` array. This keeps the parent components stateless with respect to selection — they only observe `onSelect` callbacks. A consequence: if `items` changes (e.g. a new fetch), `InternalSelector` re-derives its initial state from the new `items` via `useUpdatableState`.

**`processSelectedItemsWithSections` enforces the `maxSectionsWithSelectableItems` constraint.** Rather than blocking the user from making the selection, it retroactively trims older selections to stay within the section limit when a new selection would exceed it. The trimming removes selections in their existing order (oldest first, via array index), not by section priority.

## Ambiguities and gotchas

**`SelectorSection` is an internal rendering component, not a public API type.** The `SelectorItem` interface (from `selector-models.ts`) IS the "section" concept — each `SelectorItem` is a section header with `subItems`. `SelectorSection` is the React component that renders one `SelectorItem`. Do not confuse them.

**`SelectorSubItem` is a type alias for `ReactListItem`, not a distinct type.** `selector-models.ts` exports `type SelectorSubItem = ReactListItem`. This means any `ReactListItem` field (e.g. `iconName`, `label`, `className`) is valid on sub-items. There is no additional validation — fields that `SelectorSectionItem` does not render will be silently ignored.

**`isSelected` on items is read only at initialisation.** `InternalSelector` derives its initial `ids` array from `subItem.isSelected` but does not re-read it on subsequent renders. Changes to `isSelected` after mount have no effect unless `items` reference changes (which triggers `useUpdatableState` re-derivation). If you need to imperatively change selection from outside, you must replace the `items` array entirely.

**Auto-close in `SelectorButton` is derived, not a direct prop.** There is no `autoClose` prop. Instead `isSingleSelect(items, selectionConfiguration)` is evaluated on every `handleSelect` call. The two conditions that trigger auto-close are: `selectionConfiguration.totalSelectableItems === 1`, or there is exactly one section and that section's `maxSelectableItems === 1`. If neither applies, the popover stays open regardless of how many items were actually selected.

**`hideHeader` when there is only one section.** `InternalSelector` passes `hideHeader={items.length === 1}` to `SelectorSection`. If you pass a single-element `items` array, the section header is hidden and only the sub-items are visible. This is intentional but easy to miss when debugging layout.

**`totalSelectableItems` trims from the front, not from the end.** When a new selection would exceed the cap, `InternalSelector` slices `newIds` from `newIds.length - totalSelectableItems` onwards, which removes the oldest selections. This is a FIFO trim, not a "deselect the new one" approach.

**`SelectorButton` manages its own `selectedItems` state separately from `InternalSelector`.** `SelectorButton` holds `selectedItems` (for the button label) via `useUpdatableState`, while `InternalSelector` holds the `ids` array independently. They stay in sync only through the `onSelect` callback chain. If you bypass `onSelect` (e.g. in tests), the button label and internal selection will diverge.

## Related

- [../DropDown/AGENTS.md](../DropDown/AGENTS.md) — flat single-select sibling; use `DropDown` when you have a simple list without sections.
- [../Autocomplete/AGENTS.md](../Autocomplete/AGENTS.md) — search-enabled sibling for large item sets where the user needs to filter before selecting.
- [../../models/AGENTS.md](../../models/AGENTS.md) — `SelectorSubItem` is a direct alias for `ReactListItem`; `SelectorItem` extends it with `subItems` and `maxSelectableItems`.

---

[← Back to Components](../AGENTS.md)
