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

[← Back to Components](../README.md)
