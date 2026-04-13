# HelpInfo

A small inline help icon that shows a tooltip when hovered. Intended for use alongside form fields and labels to surface contextual guidance without cluttering the UI. Renders nothing if `children` is not provided.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | No | Tooltip content. If omitted the component renders `null`. |
| `icon` | `ReactNode` | No | Icon element displayed as the hover target. Defaults to `<Icon name="help" size="small" />`. |
| `className` | `string` | No | Additional CSS class name applied to the outer wrapper. |

## Usage

```tsx
import { HelpInfo } from '@anupheaus/react-ui';

// Alongside a field label
<Flex align="left" gap={4}>
  <Label>Email address</Label>
  <HelpInfo>We will never share your email with third parties.</HelpInfo>
</Flex>

// Custom icon
<HelpInfo icon={<Icon name="info" size="small" />}>
  This setting affects all users in your organisation.
</HelpInfo>
```

---

[← Back to Components](../README.md)
