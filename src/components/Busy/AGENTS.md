# Busy

A loading indicator component that renders a horizontal linear progress bar, a circular spinner, or a pulsating dot. Wraps MUI `LinearProgress` and `CircularProgress` with a consistent sizing API; the dot is a lightweight CSS-only indicator for inline use (e.g. beside assistive text).

All three variants take their colour from the theme's `busy.color`, falling back to the MUI primary colour when it is not set (so existing usages are unchanged).

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `variant` | `'linear' \| 'circular' \| 'dot'` | No | Style of the indicator. Defaults to `'linear'`. |
| `size` | `'small' \| 'normal' \| 'large' \| number` | No | Size of the indicator. For `'circular'` the named sizes map to `12`, `24`, `36` px; for `'dot'` they map to `7`, `12`, `18` px (a custom number is scaled to ~0.6 for the dot). Does not apply to `'linear'`. Defaults to `'normal'`. |
| `children` | `ReactNode` | No | Content displayed alongside the spinner or dot (ignored in linear mode). |
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

// Pulsating dot with a label (e.g. inline "searching" hint)
<Busy variant="dot" size="small">Searching…</Busy>
```

---

[← Back to Components](../AGENTS.md)
