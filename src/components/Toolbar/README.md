# Toolbar

A horizontal strip of icon buttons that can optionally float as a popover anchored to a reference element. Buttons inside the toolbar are automatically styled to a compact 28 × 28 px size and rendered with the `default` button variant override.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | No | Button or action elements to render in the toolbar |
| `className` | `string` | No | Additional CSS class |
| `isFloating` | `boolean \| 'left' \| 'right'` | No | When set, renders the toolbar as a MUI `Popover` anchored to the toolbar's DOM element. `'left'` / `'right'` control which side of the anchor the popover appears on. (default: `false`) |
| `isVisible` | `boolean` | No | Controls visibility; when `isFloating` is set this controls the popover open state (default: `true`) |
| `onFocus` | `(event: FocusEvent<HTMLDivElement>) => void` | No | Focus handler — fires on the inline toolbar when not floating, on the popover when floating |
| `onBlur` | `(event: FocusEvent<HTMLDivElement>) => void` | No | Blur handler — same routing as `onFocus` |

## Usage

```tsx
import { Toolbar } from '@anupheaus/react-ui';

// Inline toolbar
<Toolbar>
  <Button><Icon name="edit" /></Button>
  <Button><Icon name="delete" /></Button>
</Toolbar>

// Floating toolbar that appears to the right of a hovered row
<Toolbar isFloating="right" isVisible={isHovered}>
  <Button><Icon name="edit" /></Button>
</Toolbar>
```

---

[← Back to Components](../README.md)
