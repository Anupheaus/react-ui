# Markdown

A markdown editor and viewer built on [`@uiw/react-md-editor`](https://github.com/uiwjs/react-md-editor), wrapped in the library's standard `Field` component. Supports live split-pane editing, read-only preview, themed scrollbars, and scroll shadow indicators.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | No | Markdown string value. |
| `onChange` | `(value: string) => void` | No | Called with the updated markdown string on every edit. |
| `label` | `ReactNode` | No | Field label displayed above the editor. |
| `error` | `ReactNode` | No | Error message shown in the field. |
| `isOptional` | `boolean` | No | Marks the field as optional (displays an optional label). |
| `hideOptionalLabel` | `boolean` | No | Hides the optional label even when `isOptional` is true. |
| `requiredMessage` | `ReactNode` | No | Custom message shown when the field is required but empty. |
| `help` | `ReactNode` | No | Help content shown inside the field. |
| `assistiveHelp` | `ReactNode` | No | Assistive text shown below the field. |
| `width` | `string \| number` | No | Sets an explicit width on the field. |
| `wide` | `boolean` | No | Stretches the field to full width. |
| `fullHeight` | `boolean` | No | Stretches the field to fill available vertical space. |
| `className` | `string` | No | Additional CSS class applied to the field wrapper. |
| `onScrolledToBottom` | `() => void` | No | Called the first time the user scrolls to the bottom of the content. Useful for confirming the user has read all content (e.g. terms and conditions). |
| `showScrollPrompt` | `boolean` | No | When `true`, shows an animated bouncing chevron at the bottom of the content to indicate that the user should scroll down. The chevron fades in and out on a loop until the user reaches the bottom, at which point it disappears permanently. |

All other [`FieldProps`](../Field/AGENTS.md) are also accepted.

## Behaviour

- **Editing** — when not in a read-only `UIState`, renders a live split-pane editor (markdown source on the left, rendered preview on the right). The toolbar and drag bar are always hidden. ⚠️ **The editable mode has not been fully tested and its design has not been finalised.**
- **Read-only** — when inside a `UIState` with `isReadOnly`, renders the markdown as a rendered preview only (no editor pane).
- **Scroll shadows** — top and bottom shadows appear via `IntersectionObserver` as the user scrolls, matching the `Scroller` component's behaviour.
- **Scroll prompt** — when `showScrollPrompt` is `true`, a bouncing chevron is rendered at the bottom of the content. It animates on a looping fade-in/bounce/fade-out cycle until the user scrolls to the bottom, at which point it is removed permanently. If the user has not yet reached the bottom when the parent form is validated, a validation error is shown.
- **Theme integration** — font family, text colour, and background are taken from the active theme. The editor adapts automatically to light or dark themes.

## Usage

```tsx
import { Markdown } from '@anupheaus/react-ui';

// Editable
<Markdown
  label="Description"
  value={markdown}
  onChange={setMarkdown}
/>

// Read-only (wrap in UIState or use within a read-only context)
<UIState isReadOnly>
  <Markdown value={markdown} />
</UIState>
```

---

[← Back to Components](../AGENTS.md)
