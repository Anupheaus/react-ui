# Carousel

An image carousel that automatically advances through a list of image URLs at a configurable interval. Images cross-fade during transitions.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `imageURLs` | `string[]` | No | Ordered list of image URLs to cycle through. |
| `intervalMS` | `number` | No | Time between automatic transitions in milliseconds (default: `5000`). |
| `transitionDurationMS` | `number` | No | Duration of the cross-fade animation in milliseconds (default: `500`). |
| `onTransition` | `(index: number) => void` | No | Called each time the visible image changes, with the new zero-based index. |
| `className` | `string` | No | CSS class applied to the root element. |
| `style` | `CSSProperties` | No | Inline styles applied to the root element. |

## Usage

```tsx
import { Carousel } from '@anupheaus/react-ui';

const images = [
  'https://example.com/slide1.jpg',
  'https://example.com/slide2.jpg',
  'https://example.com/slide3.jpg',
];

<Carousel
  imageURLs={images}
  intervalMS={4000}
  transitionDurationMS={800}
  onTransition={index => console.log('now showing', index)}
/>
```

## Architecture

`Carousel` is a thin shell that delegates to `SimpleImageCarousel` when `imageURLs` is provided. All images are rendered simultaneously as absolutely-positioned `<img>` elements; only the current image has `opacity: 1`. A `setInterval` advances the index, triggering a CSS opacity transition.

---

[← Back to Components](../README.md)
