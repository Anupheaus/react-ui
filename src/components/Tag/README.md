# Tag

A low-level utility component that renders a custom HTML element (e.g. `<avatar>`, `<label>`, `<chip>`) by calling `document.createElement(name)` at runtime. It is used extensively by other library components to produce semantically named DOM nodes without relying on generic `<div>` elements.

Most application code should not use `Tag` directly; it is primarily an internal building block.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | Yes | The tag name of the custom element to create (e.g. `'avatar'`, `'chip'`). |
| `className` | `string` | No | CSS class applied to the element. |
| `width` | `string \| number` | No | Shorthand for inline `width` style. |
| `height` | `string \| number` | No | Shorthand for inline `height` style. |
| `testId` | `string` | No | Sets `data-testid` attribute for testing. |
| `ref` | `Ref<HTMLDivElement \| null>` | No | Forwarded ref to the underlying DOM element. |
| *(HTML attributes)* | | | All standard HTML `div` attributes (`onClick`, `style`, `aria-*`, etc.) are forwarded. |

## Usage

```tsx
import { Tag } from '@anupheaus/react-ui';

// Creates <my-widget class="foo">Hello</my-widget> in the DOM
<Tag name="my-widget" className="foo">Hello</Tag>
```

---

[← Back to Components](../README.md)
