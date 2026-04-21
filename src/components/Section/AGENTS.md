# Section

A labelled content section with a decorative border that frames its children. When a `label` is provided the border is clipped at the top so the label text sits in the gap, matching the classic HTML `<fieldset>` visual pattern.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `ReactNode` | No | Label displayed in the top-left of the border. Omitting it renders an unclipped border. |
| `className` | `string` | No | Additional CSS class names applied to the inner content `Flex` |
| `children` | `ReactNode` | No | Content rendered inside the section |
| `gap` | `number \| 'fields'` | No | Gap between children (forwarded to the inner `Flex`) |
| `isVertical` | `boolean` | No | Lay children out vertically (forwarded to the inner `Flex`) |
| `disableGrow` | `boolean` | No | Prevent the section from growing (forwarded to the inner `Flex`) |
| `wide` | `boolean` | No | Set `width: 100%` on the inner `Flex` |
| `maxHeight` | `number \| string \| boolean` | No | Max height; when `true` also enables `overflow: hidden` |

## Usage

```tsx
import { Section } from '@anupheaus/react-ui';

// Plain border, no label
<Section isVertical gap="fields">
  <TextField label="First name" />
  <TextField label="Last name" />
</Section>

// Labelled section
<Section label="Personal details" isVertical gap="fields">
  <TextField label="First name" />
  <TextField label="Last name" />
</Section>
```

---

[← Back to Components](../AGENTS.md)
