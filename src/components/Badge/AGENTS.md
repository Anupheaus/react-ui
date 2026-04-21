# Badge

Overlays a small badge on top of any child element, using MUI `Badge` internally. Supports an optional tooltip on the badge content and integrates with `Skeleton` during loading.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | The element the badge is anchored to. |
| `content` | `ReactNode` | No | Content rendered inside the badge bubble (e.g. a count or icon). |
| `tooltip` | `ReactNode` | No | Tooltip shown when hovering over the badge. |
| `horizonalAlign` | `'left' \| 'right'` | No | Horizontal anchor position (default: `'right'`). Note the intentional typo in the prop name. |
| `verticalAlign` | `'top' \| 'bottom'` | No | Vertical anchor position (default: `'top'`). |
| `className` | `string` | No | CSS class applied to the badge bubble element. |
| `style` | `CSSProperties` | No | Inline styles applied to the badge bubble element. |

## Usage

```tsx
import { Badge, Avatar } from '@anupheaus/react-ui';

<Badge content={3} tooltip="3 unread messages">
  <Avatar displayName="Jane Doe" />
</Badge>
```

---

[← Back to Components](../AGENTS.md)
