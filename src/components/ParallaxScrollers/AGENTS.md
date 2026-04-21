# ParallaxScrollers

A set of components for building vertically-stacked, section-based scrolling layouts. `ParallaxSectionScroller` is the outer container; `ParallaxSection` is an individual section inside it.

## Components

### `ParallaxSectionScroller`

The root container. Renders a vertical flex column that holds one or more `ParallaxSection` children.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | No | One or more `ParallaxSection` components. |
| `className` | `string` | No | CSS class applied to the root element. |

### `ParallaxSection`

An individual section inside the scroller. Shows an optional sticky title bar above its content.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `ReactNode` | No | Content rendered in the sticky title bar at the top of the section. |
| `children` | `ReactNode` | No | Section body content. |
| `className` | `string` | No | CSS class applied to the section element. |
| `titleClassName` | `string` | No | CSS class applied to the title bar element. |

## Usage

```tsx
import { ParallaxSectionScroller, ParallaxSection } from '@anupheaus/react-ui';

<ParallaxSectionScroller>
  <ParallaxSection title="Section One">
    <p>Content for section one...</p>
  </ParallaxSection>
  <ParallaxSection title="Section Two">
    <p>Content for section two...</p>
  </ParallaxSection>
</ParallaxSectionScroller>
```

---

[← Back to Components](../AGENTS.md)
