# Busy

A loading indicator component that renders either a horizontal linear progress bar or a circular spinner. Wraps MUI `LinearProgress` and `CircularProgress` with a consistent sizing API.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `variant` | `'linear' \| 'circular'` | No | Style of the indicator. Defaults to `'linear'`. |
| `size` | `'small' \| 'normal' \| 'large' \| number` | No | Size of the indicator. Named sizes map to `12`, `24`, and `36` pixels respectively. Only applies to the `'circular'` variant. Defaults to `'normal'`. |
| `children` | `ReactNode` | No | Content displayed alongside the circular spinner (ignored in linear mode). |
| `className` | `string` | No | Additional CSS class name applied to the outer container. |

## Usage

```tsx
import { Busy } from '@anupheaus/react-ui';

// Full-width linear progress bar
<Busy />

// Circular spinner with a label
<Busy variant="circular" size="small">
  Loading data…
</Busy>

// Circular spinner at a custom pixel size
<Busy variant="circular" size={48} />
```

---

[← Back to Components](../AGENTS.md)
