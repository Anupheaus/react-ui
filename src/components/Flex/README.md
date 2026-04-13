# Flex

A versatile flexbox container component that wraps an HTML element with flex layout and exposes common flexbox properties as props. Use it anywhere you need to control direction, alignment, sizing, gaps, or spacing without writing inline styles.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `tagName` | `string` | No | HTML element to render (default: `"div"`) |
| `className` | `string` | No | Additional CSS class names |
| `isVertical` | `boolean` | No | Use `flex-direction: column` instead of row |
| `disableGrow` | `boolean` | No | Set `flex-grow: 0` |
| `disableShrink` | `boolean` | No | Set `flex-shrink: 0` |
| `fixedSize` | `boolean` | No | Shorthand for both `disableGrow` and `disableShrink` |
| `enableWrap` | `boolean` | No | Enable `flex-wrap: wrap` |
| `inline` | `boolean` | No | Render as `inline-flex` |
| `disableOverflow` | `boolean` | No | Apply `overflow: hidden` |
| `width` | `number \| string` | No | Explicit width |
| `height` | `number \| string` | No | Explicit height |
| `size` | `number \| string` | No | Sets both `width` and `height` to the same value |
| `wide` | `boolean` | No | Sets `width: 100%` |
| `maxWidth` | `number \| string \| boolean` | No | Max width; `true` means `100%`, `false` clears it |
| `maxHeight` | `number \| string \| boolean` | No | Max height; `true` means `100%`, `false` clears it |
| `maxWidthAndHeight` | `boolean` | No | Sets both `maxWidth` and `maxHeight` to `100%` |
| `minWidth` | `number \| string` | No | Min width |
| `minHeight` | `number \| string` | No | Min height |
| `align` | `'left' \| 'center' \| 'right' \| 'space-around' \| 'space-between' \| 'space-evenly'` | No | Main-axis alignment (`justify-content`) |
| `valign` | `'top' \| 'center' \| 'bottom' \| 'space-around' \| 'space-between' \| 'space-evenly' \| 'stretch'` | No | Cross-axis alignment (`align-items`) |
| `alignCentrally` | `boolean` | No | Shorthand for `align="center"` and `valign="center"` |
| `gap` | `number \| 'fields'` | No | Gap between children; `'fields'` uses the theme field gap |
| `padding` | `number` | No | Uniform padding |
| `shadow` | `number` | No | Adds a box shadow scaled to the given value |
| `tooltip` | `ReactNode` | No | Wraps the element in a `Tooltip` |
| `testId` | `string` | No | Sets a `data-testid` attribute |
| `allowFocus` | `boolean` | No | `true` sets `tabIndex=0`, `false` sets `tabIndex=-1` |
| `ref` | `Ref<HTMLDivElement \| null>` | No | Forwarded ref to the underlying DOM element |

All standard `HTMLAttributes<HTMLDivElement>` and `DOMAttributes<HTMLDivElement>` props are also accepted.

## Usage

```tsx
import { Flex } from '@anupheaus/react-ui';

// Basic horizontal row
<Flex gap={8} align="center" valign="center">
  <span>Left</span>
  <span>Right</span>
</Flex>

// Vertical column, fixed size, centered content
<Flex isVertical size={200} alignCentrally gap="fields">
  <Button>Click me</Button>
</Flex>

// Full-width row with overflow hidden
<Flex wide disableOverflow>
  <LongContent />
</Flex>
```

---

[← Back to Components](../README.md)
