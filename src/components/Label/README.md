# Label

Renders a styled field label. Typically used inside `Field` and other form components rather than standalone. Supports an optional inline help icon and integrates with `Skeleton` for loading states.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | No | Label text or content. Renders nothing when `null`. |
| `help` | `ReactNode` | No | Content shown in a `HelpInfo` tooltip icon beside the label text. |
| `wide` | `boolean` | No | When `true`, the label grows to fill available horizontal space. Default: `false`. |
| `onClick` | `(event: MouseEvent) => void` | No | Click handler. The label shows a pointer cursor when supplied and the UI is not read-only. |
| `className` | `string` | No | CSS class applied to the root element. |

## Usage

```tsx
import { Label } from '@anupheaus/react-ui';

<Label help="This value is required">First Name</Label>
```

---

[← Back to Components](../README.md)
