# AssistiveLabel

A small text label rendered below form fields to display helper text or validation errors. When an `error` prop is provided it switches to the theme's error colour. Renders nothing when `children` is `false`.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | No | Helper text to display. Pass `false` to suppress rendering entirely. If omitted, a non-breaking space keeps the line height reserved. |
| `error` | `ReactNode \| Error` | No | Error message or `Error` object. When provided, overrides `children` and applies the error text colour. Native `Error` objects are unwrapped to their `.message`. |
| `className` | `string` | No | CSS class applied to the root element. |

## Usage

```tsx
import { AssistiveLabel } from '@anupheaus/react-ui';

// Helper text
<AssistiveLabel>Enter your full legal name</AssistiveLabel>

// Validation error
<AssistiveLabel error="This field is required" />

// Error from a caught exception
<AssistiveLabel error={caughtError} />
```

---

[← Back to Components](../README.md)
