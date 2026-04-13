# Grid

A responsive CSS grid layout component that automatically switches column count based on the container's measured width. Use `GridSpec` to declare breakpoints and `GridCell` to wrap each item.

## Components

| Component | Description |
|-----------|-------------|
| `Grid` | The grid container. Measures its own width and picks the appropriate column count. |
| `GridCell` | A single cell inside a `Grid`. Must be a direct or nested child of `Grid`. |
| `GridSpec` | A declarative breakpoint rule: at container widths ≥ `width` use `columns` columns. |

## Grid Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `columns` | `number` | Yes | Default column count (used when no `GridSpec` breakpoint matches) |
| `gap` | `'fields' \| number` | No | Gap between cells; `'fields'` uses the theme field gap |
| `tagName` | `string` | No | HTML element to render (default: `"grid"`) |
| `className` | `string` | No | Additional CSS class names |
| `children` | `ReactNode` | No | `GridCell` and `GridSpec` children |

## GridSpec Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `width` | `number` | Yes | Minimum container width (px) at which this spec applies |
| `columns` | `number` | Yes | Number of columns to use when the container is at least `width` pixels wide |

## GridCell Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | No | Cell content |

## Usage

```tsx
import { Grid, GridCell, GridSpec } from '@anupheaus/react-ui';

<Grid columns={1} gap="fields">
  {/* Switch to 2 columns at 600 px, 3 columns at 900 px */}
  <GridSpec width={600} columns={2} />
  <GridSpec width={900} columns={3} />

  <GridCell><FieldA /></GridCell>
  <GridCell><FieldB /></GridCell>
  <GridCell><FieldC /></GridCell>
</Grid>
```

## Architecture

`Grid` uses a `ResizeObserver` (via `useOnResize`) to track its own container width. `GridSpec` components register their `{ width, columns }` rules into a shared context. On each resize, the Grid picks the spec whose `width` threshold is the largest one still ≤ the container width, falling back to the `columns` prop when none matches. `GridCell` validates that it is rendered inside a `Grid` via context.

---

[← Back to Components](../README.md)
