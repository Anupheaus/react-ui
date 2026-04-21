# Typography

A flexible text component that applies font size, weight, family, colour, letter-spacing, text-shadow, and alignment via props or a named type preset. The type system can be extended at runtime with `Typography.augmentWith()`. Integrates with `Skeleton` for loading states.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Text or content to display. |
| `type` | `TypographyName` (or augmented key) | No | Named style preset (e.g. `'field-value'`). Preset values are merged with individual prop overrides. |
| `size` | `number \| string` | No | Font size (overrides `type`). |
| `weight` | `number \| string` | No | Font weight (overrides `type`). |
| `name` | `string` | No | Font family (overrides `type`). |
| `color` | `string` | No | Text colour (overrides `type`). |
| `spacing` | `number \| string` | No | Letter-spacing (overrides `type`). |
| `shadow` | `string \| number \| boolean` | No | Text shadow. `true` applies a default soft shadow; a number sets the blur radius in px; a string is used as-is. |
| `opacity` | `number` | No | Opacity (0–1). |
| `align` | `CSSProperties['textAlign']` | No | Horizontal text alignment. |
| `valign` | `CSSProperties['verticalAlign']` | No | Vertical alignment. |
| `fullWidth` | `boolean` | No | Stretches the element to 100% width. |
| `disableWrap` | `boolean` | No | Sets `white-space: nowrap`. Default: `false`. |
| `tagName` | `string` | No | Custom HTML tag name rendered via `Tag` (default: `'typography'`). |
| `style` | `CSSProperties` | No | Additional inline styles (merged last). |
| `className` | `string` | No | CSS class applied to the root element. |
| `onClick` | `() => void` | No | Click handler. |

## Usage

```tsx
import { Typography } from '@anupheaus/react-ui';

// Plain text
<Typography size={18} weight={700} color="#333">Hello World</Typography>

// Named preset
<Typography type="field-value">42</Typography>
```

## Extending typography presets

```tsx
import { Typography } from '@anupheaus/react-ui';

const AppTypography = Typography.augmentWith({
  'page-title': { size: 32, weight: 700, color: '#111' },
  'subtitle':   { size: 18, weight: 400, color: '#555' },
});

<AppTypography type="page-title">Dashboard</AppTypography>
```

---

[← Back to Components](../AGENTS.md)
