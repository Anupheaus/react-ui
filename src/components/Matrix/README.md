# Matrix

A two-dimensional grid component for displaying and editing cell values at the intersection of X-axis and Y-axis categories. The grid is rendered using CSS Grid with optional axis labels and pluggable renderers for both category headers and data cells.

## Models

```ts
interface MatrixXYCategory<T = unknown> {
  id: string;   // Unique identifier
  value: T;     // Category value (displayed by the category renderer)
}

interface MatrixCell<T = unknown> {
  id: string;           // Unique identifier (usually derived as `${xId}-${yId}`)
  xCategoryId: string;  // ID of the matching X category
  yCategoryId: string;  // ID of the matching Y category
  value: T;             // Cell value (displayed by the cell renderer)
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `xCategories` | `MatrixXYCategory<T>[]` | Yes | Ordered list of column (X-axis) categories. |
| `yCategories` | `MatrixXYCategory<T>[]` | Yes | Ordered list of row (Y-axis) categories. Pass a single entry with `value: null` for a single-dimension (column-only) layout. |
| `cells` | `MatrixCell<T>[]` | Yes | The cell data. Missing cells are rendered as empty via the `CellRenderer`. |
| `xCategoriesLabel` | `ReactNode` | No | Optional label spanning all X-axis category columns. |
| `yCategoriesLabel` | `ReactNode` | No | Optional label spanning all Y-axis category rows (rendered rotated 90°). |
| `CategoryRenderer` | `ReactUIComponent<MatrixXYCategoryRendererProps<T>>` | No | Custom renderer for category headers. Defaults to `DefaultMatrixXYCategoryRenderer`. |
| `CellRenderer` | `ReactUIComponent<MatrixCellRendererProps<T>>` | No | Custom renderer for data cells. Defaults to `MatrixCellRenderer`. |
| `error` | `ReactNode \| Error` | No | Error message displayed below the grid via `AssistiveLabel`. |
| `className` | `string` | No | Class applied to the root container. |
| `onChange` | `(xCategories: MatrixXYCategory<T>[], yCategories: MatrixXYCategory<T>[], cells: MatrixCell<T>[]) => PromiseMaybe<void>` | No | Called when a cell value changes. Receives the full updated `xCategories`, `yCategories`, and `cells` arrays. |
| `onAddXCategoryAt` | `(index: number) => void` | No | Called when the user inserts a new X-axis category at a given index. |
| `onAddYCategoryAt` | `(index: number) => void` | No | Called when the user inserts a new Y-axis category at a given index. |

### `MatrixCellRendererProps<T>`

| Prop | Type | Description |
|------|------|-------------|
| `value` | `MatrixCell<T>` | The cell to render. |
| `onChange` | `(value: MatrixCell<T>) => void` | Call with the updated cell to propagate changes upward. |

### `MatrixXYCategoryRendererProps<T>`

| Prop | Type | Description |
|------|------|-------------|
| `location` | `'x' \| 'y'` | Whether this is a column or row header. |
| `value` | `MatrixXYCategory<T>` | The category to render. |
| `onChange` | `(category: MatrixXYCategory<T>) => void` | Call with an updated category. |

## Usage

```tsx
import { Matrix } from '@anupheaus/react-ui';
import type { MatrixXYCategory, MatrixCell } from '@anupheaus/react-ui';

const xCategories: MatrixXYCategory<string>[] = [
  { id: 'q1', value: 'Q1' },
  { id: 'q2', value: 'Q2' },
];

const yCategories: MatrixXYCategory<string>[] = [
  { id: 'product-a', value: 'Product A' },
  { id: 'product-b', value: 'Product B' },
];

const [cells, setCells] = useState<MatrixCell<number>[]>([
  { id: 'q1-product-a', xCategoryId: 'q1', yCategoryId: 'product-a', value: 120 },
  { id: 'q2-product-a', xCategoryId: 'q2', yCategoryId: 'product-a', value: 95 },
]);

<Matrix
  xCategoriesLabel="Quarter"
  xCategories={xCategories}
  yCategoriesLabel="Product"
  yCategories={yCategories}
  cells={cells}
  onChange={(_x, _y, updatedCells) => setCells(updatedCells)}
/>
```

### Single-dimension layout

When you want column headers only (no row headers), pass a single Y category with `value: null`:

```tsx
<Matrix
  xCategories={columns}
  yCategories={[{ id: 'single', value: null }]}
  cells={cells}
/>
```

### Custom renderers

Supply `CellRenderer` and/or `CategoryRenderer` to replace the default display-only renderers with editable controls:

```tsx
const EditableCellRenderer = createComponent('EditableCellRenderer', ({ value, onChange }) => (
  <NumberInput value={value.value} onChange={n => onChange({ ...value, value: n })} />
));

<Matrix
  xCategories={xCategories}
  yCategories={yCategories}
  cells={cells}
  CellRenderer={EditableCellRenderer}
  onChange={(_x, _y, updatedCells) => setCells(updatedCells)}
/>
```

---

[← Back to Components](../README.md)
