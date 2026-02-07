# Configurator – Agent guide

This file helps AI agents and developers work with the Configurator component: what it is, how it’s structured, and how to change it safely.

---

## What the Configurator is

The **Configurator** is a data-grid-style component for **tabular, hierarchical data** with:

- A **first column** (row header) – e.g. location names, categories.
- One or more **slices** (data columns) – e.g. quotes, variants, dates.
- **Rows** that can have **sub-rows** (expand/collapse).
- Optional **header row**, **footer row**, and **“add item” / “add slice”** actions.

Use it for things like: quote configurators (locations × quotes), feature matrices (features × plans), or any grid where rows can expand to show sub-rows and columns are defined by slices.

---

## Data model (configurator-models.ts)

All types live in **`configurator-models.ts`**. Import from there.

### Core types

| Type | Purpose |
|------|--------|
| **`ConfiguratorFirstCell`** | Config for the top-left cell: `label`, `minWidth`, `maxWidth`, `isResizable`. |
| **`ConfiguratorSlice<DataType>`** | One “column” of data: `id`, `text`, `label`, `data`, plus `isPinned`, `isResizable`, `minWidth`, `maxWidth`, `aggregation`, `doNotApplySliceStyles`, etc. Extends `ReactListItem` (no `subItems`). |
| **`ConfiguratorSubItem<DataType, SliceDataType>`** | One cell’s data in a sub-row: `id`, `text`, `data`, `renderCell(subItem, slice)`. No `subItems`. |
| **`ConfiguratorItem<DataType, SubDataType, SliceDataType>`** | One row (and optionally its sub-rows): `id`, `text`, `data`, `renderCell(item, slice)`, and optionally `subItems: ConfiguratorSubItem[]`. Can have `isExpanded`. |

- **DataType** = shape of the row’s `data`.
- **SubDataType** = shape of each sub-item’s `data` (use `never` if no sub-rows).
- **SliceDataType** = shape of each slice’s `data` (often the same across slices).

### Important conventions

- **`renderCell(itemOrSubItem, slice): ReactNode`** – Renders the cell content. For the first column, `slice` is absent (header uses `item.label` / `item.text`). For slice columns, both arguments are provided; the implementation often uses `slice.data` and `item.data` / `subItem.data`.
- **`ReactListItem`** – Base from `../../models`: `id`, `text`, `label`, `onClick`, etc. Configurator types extend or intersect with it but override `data` and `subItems` where needed.
- Items that support expansion have **`subItems`** (array, possibly empty). Components assume `item.subItems` exists when they render sub-rows or “add sub-item”; for items without sub-rows, pass `subItems: []`.

---

## Component tree and files

```
Configurator (Configurator.tsx)           ← Root: Field + Scroller + column-widths provider
└── ConfiguratorColumnWidthsProvider      ← column-widths/ConfiguratorColumnWidthsProvider.tsx
    ├── ConfiguratorItemRow (header)     ← ConfiguratorItemRow.tsx
    ├── ConfiguratorItemRow (×N items)    ← same
    ├── ConfiguratorAddItem               ← ConfiguratorAddItem.tsx
    └── ConfiguratorItemRow (footer?)     ← same

ConfiguratorItemRow
├── ConfiguratorCell (column 0: first column)
├── ConfiguratorCell (×slices)            ← ConfiguratorCell.tsx
├── ConfiguratorAddSlice? (if header)     ← ConfiguratorAddSlice.tsx
└── Flex (sub-rows, if any)
    ├── ConfiguratorSubItemRow (×N)       ← ConfiguratorSubItemRow.tsx
    └── ConfiguratorAddItem? (add sub-item)
```

### File roles

| File | Role |
|------|------|
| **Configurator.tsx** | Root. Owns `items` state (via `useUpdatableState`), builds header/footer/add rows, wires `Scroller` and shadow visibility, provides `ConfiguratorColumnWidthsProvider`. |
| **ConfiguratorItemRow.tsx** | One row: first cell + one `ConfiguratorCell` per slice, optional `ConfiguratorAddSlice` (header only), and collapsible block of `ConfiguratorSubItemRow` + optional “add sub-item”. |
| **ConfiguratorCell.tsx** | Single cell. Uses `useConfiguratorColumnWidths` for width, renders expand icon (first column + expandable), calls `item.renderCell` or shows label/text. Handles header/footer/sub-item styling and sticky/pinned. |
| **ConfiguratorSubItemRow.tsx** | One sub-row: first cell + one cell per slice; no expand, no add-slice. |
| **ConfiguratorAddItem.tsx** | “Add item” or “add sub-item” row: builds a fake `ConfiguratorItem` and renders one `ConfiguratorCell`; `onSelect` triggers the add callback. |
| **ConfiguratorAddSlice.tsx** | “Add slice” cell in the header row: fake item, single `ConfiguratorCell`, `onSelect` = add slice. |
| **configurator-column-utils.ts** | `convertFirstCellIntoConfiguratorItem(firstCell, renderFirstCell)` – turns `ConfiguratorFirstCell` into a `ConfiguratorItem` for the header row. `isFirstItem(item)` for internal use. |
| **column-widths/** | Context + provider + hook for column widths: header cells report width; non-header cells receive min/max/width via `useConfiguratorColumnWidths` and apply to DOM. |

---

## Key behaviours

### State and callbacks

- **Items** – `Configurator` holds `items` with `useUpdatableState(providedItems, [providedItems])`. Expanding a row updates that state via `onExpandItem` → `expandItem` (replaces the item by `id` with `{ ...item, isExpanded }`).
- **Add actions** – `onAddItem`, `onAddSubItem(item)`, `onAddSlice` are optional. When provided, the corresponding “Add” row/cell is shown and calls them on click.

### Column widths

- **ConfiguratorColumnWidthsProvider** receives `itemMinWidth`, `itemMaxWidth` (from `firstCell`), and `slices` (each can have `minWidth`/`maxWidth`).
- **ConfiguratorCell** with `columnIndex` and `isHeader` uses **useConfiguratorColumnWidths**: header cells are measured (e.g. via `useOnResize`) and report width; non-header cells subscribe and set `style` (min/max/width) so columns line up.

### Scroller and shadows

- **Scroller** wraps the grid and reports `onShadowVisibilityChange` (top/left/bottom/right). Configurator keeps that in `visibleShadows` and passes it to rows and add-row for right/bottom edge shadows.
- Custom bottom/right shadow elements are rendered via `containerContent` on the Scroller.

### Styling

- **ConfiguratorCell** uses theme `configurator.header`, `configurator.item`, `configurator.subItem`, `configurator.slice` and a `mixColours` helper for alternating row/column backgrounds (odd/even item, odd/even slice).
- Modifier classes: `is-header`, `is-footer`, `is-sub-item`, `is-item`, `is-odd-item`, `is-even-item`, `is-odd-slice`, `is-even-slice`, `is-first-column`, `is-pinned`, `is-clickable`, `is-expanded`. Use these when changing styles or adding behaviour.

### Expand/collapse

- Rows with `subItems.length > 0` or `onAddSubItem` get an expand icon in the first cell. Clicking it calls `onExpandItem` with `{ ...item, isExpanded: !item.isExpanded }`.
- The sub-rows container height is driven by CSS `--max-height` (set from `scrollHeight` in ConfiguratorItemRow via `useOnDOMChange` and a ref callback). Class `is-expanded` switches height from `0` to `var(--max-height)`.

---

## How to change things safely

1. **Data shape** – Change only **configurator-models.ts**. Keep `renderCell` signatures and the fact that items with sub-rows have `subItems` (and optionally `isExpanded`).
2. **New slice options** – Add optional fields to `ConfiguratorSlice` and read them in **ConfiguratorCell** (and column-widths if they affect layout).
3. **New row types** – Either extend `ConfiguratorItem` / `ConfiguratorSubItem` or add a discriminator and branch in **ConfiguratorItemRow** / **ConfiguratorCell**.
4. **Column width behaviour** – Logic lives in **column-widths/** (context, provider, **useConfiguratorColumnWidths**). Header vs non-header behaviour is intentional; don’t change width reporting without updating both.
5. **Styling** – Prefer theme (`configurator.*`) and the existing modifier classes in **ConfiguratorCell** and **ConfiguratorItemRow**; avoid hardcoding colours or layout that should be theme-driven.
6. **Stories** – **Configurator.stories.tsx** defines sample `firstCell`, `items`, `slices`, `footer` and passes them to `Configurator`. Use it to validate layout, expansion, and add actions.

---

## Public API (what consumers use)

- **Component**: `<Configurator firstCell={...} items={...} slices={...} footer={...} addItemLabel addSubItemLabel addSliceLabel onAddItem onAddSubItem onAddSlice />`
- **Types**: Export from **index.ts**: `Configurator`, plus from **configurator-models**: `ConfiguratorFirstCell`, `ConfiguratorItem`, `ConfiguratorSubItem`, `ConfiguratorSlice`.

Consumers are responsible for building `items` and `slices` with the correct `data` and `renderCell` implementations; the component does not fetch or mutate domain data beyond expand state.
