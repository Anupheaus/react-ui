# AnimatingBorder

An absolutely-positioned decorative border that rotates a conic gradient around its edges in a continuous loop, creating a "scanning" highlight effect. Place it as a child of a `position: relative` element.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isEnabled` | `boolean` | No | Show the animating border (default: `true`). When `false` the component renders nothing. |
| `className` | `string` | No | Additional CSS class names |

## Usage

```tsx
import { AnimatingBorder } from '@anupheaus/react-ui';

// The parent must be position: relative (Flex is by default)
<Flex style={{ position: 'relative', width: 200, height: 50 }}>
  <AnimatingBorder />
  <span>Content</span>
</Flex>

// Conditionally enabled
<Flex style={{ position: 'relative' }}>
  <AnimatingBorder isEnabled={isLoading} />
  <Content />
</Flex>
```

---

[← Back to Components](../AGENTS.md)
