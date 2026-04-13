# Image

A simple image display component that renders an image as a CSS `background-image` inside a flex container. Useful when you need a `div`-based image that fills its container.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `src` | `string` | No | URL of the image to display. |
| `className` | `string` | No | CSS class applied to the root element. |

## Usage

```tsx
import { Image } from '@anupheaus/react-ui';

<Image src="https://example.com/photo.jpg" className="my-image" />
```

> **Note:** The image is applied as a CSS `background-image`. To control sizing and positioning, style the component using `background-size`, `background-position`, etc. via `className`.

---

[← Back to Components](../README.md)
