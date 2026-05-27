# Table Component

A data table component that supports **request-based (lazy) loading**, configurable columns, built-in cell value formatting, optional row actions (edit/remove), and synchronized column widths between header and body.

---

## Overview

- **Package:** Part of this React UI library.
- **Record type:** Rows are typed as `Record` from `@anupheaus/common` (entities with at least an `id: string`).
- **Data flow:** The table does not hold all rows in state. It uses an **onRequest** callback so the parent (or a server) provides records and total count for the current window (pagination). The body is rendered via **InternalList**, which handles scrolling, virtualization, and the request/response contract.

---

## Public API

### `<Table<RecordType>>`

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `TableColumn<RecordType>[]` | Column definitions (id, field, label, type, width, alignment, renderValue, etc.). |
| `onRequest` | `TableOnRequest<RecordType>` | Called when the table needs data. You respond with `{ requestId, records, total }`. |
| `unitName` | `string` | Optional. Singular name for the row entity (e.g. `"record"`, `"person"`). Used in footer and remove confirmation. Default `"record"`. |
| `removeLabel` | `string` | Optional. Label for the remove action (e.g. `"Delete"`). |
| `onAdd` | `() => PromiseMaybe<void>` | Optional. If provided, footer shows an Add button. |
| `addLabel` | `string` | Optional. Label shown beside the Add icon in the footer. Icon-only when omitted. |
| `onEdit` | `(record, index) => PromiseMaybe<void>` | Optional. If provided, each row gets an edit action in the actions column. |
| `onRemove` | `(record, index) => PromiseMaybe<void>` | Optional. If provided, each row gets a remove action (with confirmation dialog). |
| `delayRenderingRows` | `boolean` | Optional. Defers rendering rows (e.g. for virtualization). Default `false`. |
| `actions` | `UseActions<TableActions>` | Optional. Exposes table actions to the parent. |
| `className` | `string` | Optional. Root class. |
| `persistenceKey` | `string` | Optional. When provided, table settings (e.g. column widths) are persisted to `localStorage` under this key. Omit to disable persistence. |

### Persistence

Persistence is **disabled by default**. Pass `persistenceKey` to enable:

```tsx
<Table persistenceKey="my-app-users-table" columns={columns} onRequest={onRequest} />
```

Settings are stored as a `TableSettings` object in `localStorage`. Only columns with `isResizable: true` are saved in `columnWidths` (keyed by column `id`). The actions column and fixed-width columns are measured at runtime and are not persisted. Sorting and filtering preferences will be added to `TableSettings` in a future update.

```ts
interface TableSettings {
  columnWidths?: Record<string, number>;
}
```

## Theme

Optional `table.normal` background tokens. When omitted, the component keeps its existing appearance.

| Token | Description | Default |
|-------|-------------|---------|
| `table.normal.headerBackgroundColor` | Header bar background | `toolbar.normal.backgroundColor` |
| `table.normal.rowBackgroundColor` | Row/content area background | `surface.asAContainer.normal.backgroundColor` |
| `table.normal.footerBackgroundColor` | Footer bar background | `toolbar.normal.backgroundColor` |

The row area also uses `fields.content.normal` border colour and radius so it matches a **List** field container. The body scroller shows edge shadows when content overflows vertically or horizontally (including after column resize).

The sticky row-actions column uses `rowBackgroundColor` so it stays aligned with the content area.

```tsx
mergeThemes(DefaultTheme, {
  table: {
    normal: {
      headerBackgroundColor: '#e2caa5',
      rowBackgroundColor: '#fff',
      footerBackgroundColor: '#e2caa5',
    },
  },
});
```

### `TableColumn<RecordType>`

Defined in **TableModels.ts**.

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique column id. |
| `field` | `string` | Key on the record to read value from (e.g. `"name"`, `"salary"`). |
| `label` | `ReactNode` | Header content. |
| `type` | `DataFilterValueTypes` | Optional. Drives default formatting in `TableCellValue`: `'string'`, `'number'`, `'boolean'`, `'date'`, `'currency'`, etc. |
| `alignment` | `'left' \| 'center' \| 'right'` | Optional. Cell and header alignment. |
| `width` | `string \| number` | Optional. Column width (e.g. `150`, `"10%"`). Header cells can also report measured width to sync with body. |
| `isResizable` | `boolean` | Optional. When `true`, the column can be resized by dragging the header edge. Default treated as not resizable. |
| `isVisible` | `boolean` | Optional. If `false`, column is omitted. Default treated as visible. |
| `className` | `string` | Optional. Applied to the cell. |
| `renderValue` | `(props: TableRenderValueProps<T>) => ReactNode` | Optional. Custom cell renderer. Receives `record`, `rowIndex`, `columnIndex`, `CellValue` (default value component), etc. |

### `TableOnRequest<RecordType>`

- **Request:** Same shape as **List** / **InternalList** `onRequest`: includes `requestId`, `pagination` (e.g. `offset`, `limit`), and any filters/sorts your API uses.
- **Response:** Call `response({ requestId, records, total })`. Use `records` (not `items`) for the table API.

## Architecture

```
Table
├── TableColumnWidthProvider     (context: column widths)
│   ├── TableHeader               (header row; padding-right matches body vertical scrollbar)
│   │   └── TableHeaderCell
│   ├── TableRows                 (reports vertical scrollbar width; adapts records → ReactListItems)
│   │   └── InternalList → Scroller → TableRow → TableCell
│   └── TableFooter
```

- **Column widths:** **TableColumnWidthProvider** stores widths by index. **TableHeaderCell** measures header cells (via `useOnResize`) and calls **useSetTableColumnWidth**. Resizable columns (`isResizable: true`) show a drag handle on the right edge of the header cell with twin vertical line indicators that fade in when the cursor is over the table; dragging updates width via **useDrag** and persists on drag end when `persistenceKey` is set. Manually resized widths are not overwritten by subsequent measurements. The actions column uses **TableActionsColumnWidthProvider**: each **TableRowActionColumn** measures its content (including custom `children`) and reports the width; the context keeps the maximum so every actions cell and the pinned header cell share the same width. The actions column is pinned on the right: the header cell sits outside the horizontally scrolled header strip; body rows stretch to the full table width (`width: 100%`, `min-width: max-content`) with a flex fill spacer (`table-row-fill` / `table-header-fill`) before the actions cell so actions align with the header even when data columns are narrower than the table, and body cells use `position: sticky` so they stay visible while data columns scroll horizontally.
- **Rows:** **TableRows** converts each `record` from **onRequest** into a **ReactListItem** and renders **TableRow** inside **InternalList**. **TableRow** is a horizontal **Flex** with `valign="stretch"`. Data **TableCell**s use `dataCell` / `dataCellContent` styles so every cell fills the row height and overflowing text ellipsizes on the inner wrapper. Row actions render inside **`table-row-actions-pin`** (`position: sticky; right: 0`) so pinning is not affected by flex stretch or `overflow: hidden` on data cells. **TableRows** applies **tableBodyScrollerLayout** so the body scroller uses `scrollbar-gutter: auto` instead of the shared Scroller default (`stable`) — see **Layout gotchas** below.
- **Loading:** While the first **onRequest** is in flight, **Table** sets `recordsLoading` and wraps **TableHeader** and **TableFooter** in **UIState** `isLoading`. **TableRows** wraps the body in **UIState** and passes `showSkeletons` with a `createSkeletonItem` factory that builds placeholder **records** from column definitions (`createPlaceholderRecord`).
- **Row actions:** If `onEdit` or `onRemove` are passed to **Table**, **useColumns** appends a synthetic column with `id: 'table-actions'` and `renderValue` rendering **TableRowActionColumn**, which contains **TableRowEditAction** and/or **TableRowMenuAction** (ellipsis menu with remove + confirmation).

**Custom row actions:** Add your own column with `id: 'table-actions'` and a `renderValue` that wraps custom buttons in **TableRowActionColumn** (pass `{...props}` from `renderValue`, then your buttons as `children`). **useColumns** applies the sticky cell class automatically; the header is pinned on the right by **TableHeader**. Do not pass `onEdit`/`onRemove` when supplying your own actions column.

---

## File roles

| File | Role |
|------|------|
| **Table.tsx** | Root. Uses **useColumns**, wires **onRequest**, **TableColumnWidthProvider**, **TableHeader**, **TableRows**, **TableFooter**. Syncs header `padding-right` to body vertical scrollbar width. |
| **TableModels.ts** | Types: **TableColumn**, **TableColumnCommonProps**, **TableRenderValueProps**, **TableOnRequest**. |
| **TableHeader.tsx** | Header row above the body scroller; `padding-right` offsets the actions column when the body shows a vertical scrollbar. Data columns sync with horizontal scroll via `translateX`; a `table-header-fill` spacer before the actions header cell mirrors **TableRow** layout when data columns are narrower than the table. |
| **TableHeaderCell.tsx** | Single header cell: label in **Skeleton** (shows placeholder while loading), optional resize handle when `isResizable`, width from props or measured, reports width to context. |
| **TableHeaderCellResizeHandle.tsx** | Drag handle with twin line indicators (fade in on table hover) rendered on resizable header cells. |
| **TableHoverContext.ts** | Context tracking whether the cursor is over the table; used to show/hide resize indicators. |
| **useTableSettings.ts** | Reads/writes **TableSettings** to `localStorage` via **useStorage** when `persistenceKey` is provided. |
| **TableRows.tsx** | Wraps **InternalList**, reports vertical scrollbar width via **onVerticalScrollbarWidthChange**, adapts **onRequest** to **ReactListItem**s; **onScrollHorizontal** → **onScrollLeft**. Applies **tableBodyScrollerLayout** gutter override on the body scroller. |
| **tableBodyScrollerLayout.ts** | Named constant and style override for table body `scrollbar-gutter: auto` (regression-tested). |
| **TableRow.tsx** | One row: receives **record** (resolved from ReactListItem’s `data`), **index**, **columns**. Shows loading state when **record** is undefined. Splits data and actions columns; row stretches to full table width with a flex fill spacer; actions render inside **`table-row-actions-pin`** for horizontal sticky pinning. Maps columns to **TableCell**. |
| **TableCell.tsx** | One cell: uses **useGetTableColumnWidth**, calls column **renderValue** or **TableCellValue** with `record[column.field]`. Data cells stretch to row height and wrap content in **`table-cell-content`** for ellipsis; the actions cell uses a separate shell without `overflow: hidden`. |
| **TableCellValue.tsx** | Default value formatter: by **type** renders date (locale), currency (locale), boolean (tick/cross icon), or raw value; shows a full-width **Skeleton** in each cell while loading. |
| **TableColumnWidths.tsx** | **TableColumnWidthProvider** (context), **useSetTableColumnWidth**, **useGetTableColumnWidth**. |
| **TableColumnsContext.ts** | React context holding the current **TableColumn[]**. |
| **useColumns.tsx** | **useColumns** hook: filters visible columns, appends actions column when **onEdit** / **onRemove** provided. |
| **TableFooter.tsx** | Add button (if **onAdd**), error message, total record count (locale-formatted, with skeleton). |
| **TableActionsColumnWidthContext.tsx** | Shared max-width context for the actions column; each **TableRowActionColumn** reports its measured width and all cells adopt the largest value. |
| **TableRowActionColumn.tsx** | Sticky actions cell: edit button, remove menu, custom children, shadow; measures and reports width to **TableActionsColumnWidthProvider**. |
| **TableRowEditAction.tsx** | Edit button; calls **onEdit(record, rowIndex)**. |
| **TableRowMenuAction.tsx** | Ellipsis menu with remove item; opens confirmation dialog then calls **onRemove(record, rowIndex)**. |

---

## Usage summary

1. Define **columns** (id, field, label, type, width, optional **renderValue**).
2. Implement **onRequest**: when called, fetch or compute records and total, then call **response({ requestId, records, total })**.
3. Optionally pass **onAdd**, **onEdit**, **onRemove**; **unitName** and **removeLabel** for copy.
4. **onRequest** should return **records** (or items with **data** as the record or **Promise\<record\>**); **InternalList** resolves **data** and passes it to **renderItem** as the third argument so **TableRow** receives the resolved record.

See **Table.stories.tsx** for examples: loading state, requested records with pagination, edit/remove, and minimum records.

---

## Layout gotchas

### Body scroller `scrollbar-gutter` override

Shared **Scroller** styles (`ScrollbarStyles.ts`) set `scrollbar-gutter: stable` on every scroll container. That reserves space for a vertical scrollbar even when content does not overflow vertically — a “phantom” gutter that keeps layout from jumping when a thumb later appears.

Tables pin the actions column with `position: sticky; right: 0` on **`table-row-actions-pin`** (a wrapper around the actions **TableCell**, not the cell itself). Row layout uses `width: 100%` and `min-width: max-content`, so as resizable columns widen:

1. With **no vertical overflow**, the phantom gutter shrinks the scrollport’s `clientWidth`.
2. The row grows into that gutter; sticky actions appear to **drift left** by roughly `gutterWidth − horizontalOverflow` until horizontal overflow is large enough to consume the gutter.
3. Once a horizontal scrollbar appears, the stable gutter behaviour changes and the drift stops — which makes resize feel broken even though column widths are correct.

**Fix:** **TableRows** applies `TABLE_BODY_SCROLLER_GUTTER_OVERRIDE` from **tableBodyScrollerLayout.ts**, setting `scrollbar-gutter: auto` on the body `scroller-container` only. Do not revert this to `stable` without re-testing resizable columns with pinned actions and no vertical scrollbar.

When the body **does** show a vertical scrollbar, **Table** still offsets the header with `padding-right` from **measureVerticalScrollbarWidth** — that path is unchanged.

### Header vs body alignment when columns underflow the table

When the sum of column widths is less than the table width, **TableHeader** inserts a `table-header-fill` flex spacer and **TableRow** inserts `table-row-fill` before the actions cell so the pinned actions column lines up on the right. Header data cells use `flexGrow: 0` so measured widths are not stretched away from body cells.

### Actions column width

**TableActionsColumnWidthProvider** keeps the maximum measured width across all row action cells (including custom `children`) so every row and the header share one width. Each **TableRowActionColumn** reports its measured width under a row key and clears it on unmount; a **ResizeObserver** remeasures when action content changes so the column can grow or shrink. Actions column width is never persisted to `localStorage`.

---

## Tests

Pure layout and data helpers are covered under `src/components/Table/*.tests.ts`:

| File | What it guards |
|------|----------------|
| **tableBodyScrollerLayout.tests.ts** | Body scroller must stay on `scrollbar-gutter: auto` (row-actions drift regression). |
| **Table.tests.tsx** | Renders **Table** / **TableRows**, loads data via `onRequest`, fill spacers with actions, and verifies the body scroller gutter override in injected styles. |
| **measureVerticalScrollbarWidth.tests.ts** | Header padding only when vertical overflow exists. |
| **splitTableColumns.tests.ts** | Actions column split for header/row layout. |
| **tableConstants.tests.ts** | Actions column id and width estimation. |
| **createPlaceholderRecord.tests.ts** | Skeleton row placeholders match column types and skip actions. |
| **TableActionsColumnWidthContext.tests.ts** | Actions column width maxes across rows and recalculates when rows change. |
| **useTableSettings.tests.ts** | Actions column widths are not written to `localStorage`. |

---

## Related

- [../InternalList/AGENTS.md](../InternalList/AGENTS.md) — the virtualisation and request engine `Table` delegates to for rendering rows
- [../List/AGENTS.md](../List/AGENTS.md) — peer component using the same `onRequest` protocol for single-column lists
- [../../models/AGENTS.md](../../models/AGENTS.md) — `ReactListItem`, `UseDataRequest`, `UseDataResponse` — the item and request types `TableRows` uses when adapting records

---

[← Back to Components](../AGENTS.md)
