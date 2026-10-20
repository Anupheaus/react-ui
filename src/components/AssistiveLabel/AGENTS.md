# AssistiveLabel

A small text label rendered below form fields to display helper text or validation errors. When an `error` prop is provided it switches to the theme's error colour. Renders nothing when `children` is `false`.

The label is as wide as its message and never wider than its field, so a short message stays on one line and holds a shrink-to-fit field open (as it always has), and a long one wraps inside the field, long unbroken words included (`overflow-wrap: anywhere`). The text sits in an inner `assistive-label-text` element measured at most `100cqi - 64px` (the screen's width less its side gutters), because a shrink-to-fit box ignores the label's `max-width: 100%` while it measures: so a long message never pushes a form wider than a phone screen. Limit: two fields side by side in a row with long messages on a phone each still ask for that width.

Tests: the `WrapsLongMessageOnPhone` story checks long messages at 320, 360 and 375px in a real browser; the preview's `afterEach` (`src/Storybook/expectShortMessagesOnOneLine.ts`) checks that, in every "UI States" story, a message that fits its field stays on one line.

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

[← Back to Components](../AGENTS.md)
