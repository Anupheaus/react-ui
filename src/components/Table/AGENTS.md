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

Settings are stored as a `TableSettings` object in `localStorage`. Column widths are keyed by column `id` so they survive column reordering. Sorting and filtering preferences will be added to `TableSettings` in a future update.

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

The row area also uses `fields.content.normal` border colour and radius so it matches a **List** field container. **Scroller** edge shadows are enabled on the body (same opacity transitions as **List**).

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
│   ├── TableHeader               (header row, syncs scroll left)
│   │   └── TableHeaderCell       (per column: label, optional resize handle, width report)
│   ├── TableRows                 (adapts records → ReactListItems, provides columns via context)
│   │   └── InternalList          (request-based list; no children)
│   │       └── InternalListItem  (per item; resolves item.data via useAsync, calls item.renderItem(item, index, resolvedData))
│   │           └── TableRow      (rendered by renderItem; receives record = resolvedData, index, columns)
│   │               └── TableCell (per column: renderValue or TableCellValue)
│   │                   └── TableCellValue  (format by type: date, currency, boolean, etc.)
│   └── TableFooter               (Add button, error, total count)
```

- **Column widths:** **TableColumnWidthProvider** stores widths by index. **TableHeaderCell** measures header cells (via `useOnResize`) and calls **useSetTableColumnWidth**. Resizable columns (`isResizable: true`) show a drag handle on the right edge of the header cell; dragging updates width via **useDrag** and persists on drag end when `persistenceKey` is set. Manually resized widths are not overwritten by subsequent measurements. **TableCell** and **TableRowActionColumn** use **useGetTableColumnWidth** so body columns align with the header. The actions column is sticky on the right and reports its width from the first row.
- **Rows:** **TableRows** converts each `record` from **onRequest** into a **ReactListItem** with `data: record` (or `data: Promise<record>` for async) and **renderItem(item, index, resolvedData)** that returns **TableRow** with `record={resolvedData}`, `index`, and `columns`. **InternalListItem** resolves `item.data` (sync or Promise) via **useAsync** and passes the resolved value as **resolvedData** to **renderItem**. **TableRow** shows a loading state when `record` is undefined (e.g. while the Promise is resolving).
- **Row actions:** If `onEdit` or `onRemove` are passed to **Table**, **useColumns** appends a synthetic column with `id: 'table-actions'` and `renderValue` rendering **TableRowActionColumn**, which contains **TableRowEditAction** and/or **TableRowMenuAction** (ellipsis menu with remove + confirmation).

---

## File roles

| File | Role |
|------|------|
| **Table.tsx** | Root. Uses **useColumns**, wires **onRequest** (and loading/error/total state), **TableColumnWidthProvider**, **TableHeader**, **TableRows**, **TableFooter**. |
| **TableModels.ts** | Types: **TableColumn**, **TableColumnCommonProps**, **TableRenderValueProps**, **TableOnRequest**. |
| **TableHeader.tsx** | Renders header row; exposes **onScrollLeft** via actions so horizontal scroll can be synced. |
| **TableHeaderCell.tsx** | Single header cell: label, optional resize handle when `isResizable`, width from props or measured, reports width to context. |
| **TableHeaderCellResizeHandle.tsx** | Drag handle rendered on resizable header cells. |
| **useTableSettings.ts** | Reads/writes **TableSettings** to `localStorage` via **useStorage** when `persistenceKey` is provided. |
| **TableRows.tsx** | Adapts **onRequest** so the table’s `records` are converted to **ReactListItem**s with `data: record` and **renderItem(item, index, resolvedData)** that renders **TableRow** with `record={resolvedData}`. Provides **TableColumnsContext**. Wraps **InternalList** (no children); **onScroll** → **onScrollLeft**. |
| **TableRow.tsx** | One row: receives **record** (resolved from ReactListItem’s `data`), **index**, **columns**. Shows loading state when **record** is undefined. Maps columns to **TableCell**. |
| **TableCell.tsx** | One cell: uses **useGetTableColumnWidth**, calls column **renderValue** or **TableCellValue** with `record[column.field]`. |
| **TableCellValue.tsx** | Default value formatter: by **type** renders date (locale), currency (locale), boolean (tick/cross icon), or raw value; shows skeleton when loading. |
| **TableColumnWidths.tsx** | **TableColumnWidthProvider** (context), **useSetTableColumnWidth**, **useGetTableColumnWidth**. |
| **TableColumnsContext.ts** | React context holding the current **TableColumn[]**. |
| **useColumns.tsx** | **useColumns** hook: filters visible columns, appends actions column when **onEdit** / **onRemove** provided. |
| **TableFooter.tsx** | Add button (if **onAdd**), error message, total record count (locale-formatted, with skeleton). |
| **TableRowActionColumn.tsx** | Sticky actions cell: edit button, remove menu, shadow; reports width from first row. |
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

## Related

- [../InternalList/AGENTS.md](../InternalList/AGENTS.md) — the virtualisation and request engine `Table` delegates to for rendering rows
- [../List/AGENTS.md](../List/AGENTS.md) — peer component using the same `onRequest` protocol for single-column lists
- [../../models/AGENTS.md](../../models/AGENTS.md) — `ReactListItem`, `UseDataRequest`, `UseDataResponse` — the item and request types `TableRows` uses when adapting records

---

[← Back to Components](../AGENTS.md)
