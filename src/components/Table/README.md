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
| `onEdit` | `(record, index) => PromiseMaybe<void>` | Optional. If provided, each row gets an edit action in the actions column. |
| `onRemove` | `(record, index) => PromiseMaybe<void>` | Optional. If provided, each row gets a remove action (with confirmation dialog). |
| `delayRenderingRows` | `boolean` | Optional. Defers rendering rows (e.g. for virtualization). Default `false`. |
| `actions` | `UseActions<TableActions>` | Optional. Exposes table actions to the parent. |
| `className` | `string` | Optional. Root class. |

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
│   │   └── TableHeaderCell       (per column: label, resize/width report)
│   ├── TableRows                 (adapts records → ReactListItems, provides columns via context)
│   │   └── InternalList          (request-based list; no children)
│   │       └── InternalListItem  (per item; resolves item.data via useAsync, calls item.renderItem(item, index, resolvedData))
│   │           └── TableRow      (rendered by renderItem; receives record = resolvedData, index, columns)
│   │               └── TableCell (per column: renderValue or TableCellValue)
│   │                   └── TableCellValue  (format by type: date, currency, boolean, etc.)
│   └── TableFooter               (Add button, error, total count)
```

- **Column widths:** **TableColumnWidthProvider** stores widths by index. **TableHeaderCell** measures header cells (via `useOnResize`) and calls **useSetTableColumnWidth**. **TableCell** and **TableRowActionColumn** use **useGetTableColumnWidth** so body columns align with the header. The actions column is sticky on the right and reports its width from the first row.
- **Rows:** **TableRows** converts each `record` from **onRequest** into a **ReactListItem** with `data: record` (or `data: Promise<record>` for async) and **renderItem(item, index, resolvedData)** that returns **TableRow** with `record={resolvedData}`, `index`, and `columns`. **InternalListItem** resolves `item.data` (sync or Promise) via **useAsync** and passes the resolved value as **resolvedData** to **renderItem**. **TableRow** shows a loading state when `record` is undefined (e.g. while the Promise is resolving).
- **Row actions:** If `onEdit` or `onRemove` are passed to **Table**, **useColumns** appends a synthetic column with `id: 'table-actions'` and `renderValue` rendering **TableRowActionColumn**, which contains **TableRowEditAction** and/or **TableRowMenuAction** (ellipsis menu with remove + confirmation).

---

## File roles

| File | Role |
|------|------|
| **Table.tsx** | Root. Uses **useColumns**, wires **onRequest** (and loading/error/total state), **TableColumnWidthProvider**, **TableHeader**, **TableRows**, **TableFooter**. |
| **TableModels.ts** | Types: **TableColumn**, **TableColumnCommonProps**, **TableRenderValueProps**, **TableOnRequest**. |
| **TableHeader.tsx** | Renders header row; exposes **onScrollLeft** via actions so horizontal scroll can be synced. |
| **TableHeaderCell.tsx** | Single header cell: label, width from props or measured, reports width to context. |
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
