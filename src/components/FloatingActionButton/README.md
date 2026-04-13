# FloatingActionButton

A circular action button that is absolutely positioned in the bottom-right corner of its nearest positioned ancestor. Built on top of `Button` with `iconOnly` and `size="large"` defaults.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `iconName` | `IconName` | No | Name of the icon to display. Defaults to `'add'`. |
| `onClick` | `(event: MouseEvent) => PromiseMaybe<void>` | No | Click handler. Supports async — the button inherits the standard `Button` async loading behaviour. |
| `onMouseOver` | `(event: MouseEvent) => void` | No | Mouse-enter handler on the outer container element. |
| `onMouseLeave` | `(event: MouseEvent) => void` | No | Mouse-leave handler on the outer container element. |
| `className` | `string` | No | Additional CSS class name applied to the outer container. |

## Usage

```tsx
import { FloatingActionButton } from '@anupheaus/react-ui';

// Add button in the bottom-right of a relative-positioned panel
<div style={{ position: 'relative', flex: 1 }}>
  <DataList items={items} />
  <FloatingActionButton iconName="add" onClick={handleAdd} />
</div>
```

---

[← Back to Components](../README.md)
