# Tooltip

Wraps any single child element with a hover tooltip powered by MUI. `Tooltip` sets tooltip content via React context; `TooltipRenderer` (used internally by the library's field components) reads that context and applies the MUI tooltip to its first child.

## Exported components

| Export | Description |
|--------|-------------|
| `Tooltip` | Context provider that configures tooltip content and options for a subtree. |
| `TooltipTheme` | Theme definition for customising tooltip colours and typography. |

## Props — Tooltip

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `content` | `ReactNode` | No | Tooltip body. A plain string is split on newline characters — each line becomes a `<div>`; empty lines become `<br>`. |
| `showArrow` | `boolean` | No | Shows a small arrow pointing at the target element. Defaults to `false`. |
| `persist` | `boolean` | No | Keeps the MUI tooltip mounted even when `content` is empty (useful for debugging layouts). Defaults to `false`. |
| `debug` | `boolean` | No | Extends the tooltip hide delay to 10 minutes so it stays visible while inspecting. Defaults to `false`. |
| `className` | `string` | No | CSS class applied to the MUI popper element. |
| `children` | `ReactNode` | No | Content rendered inside the tooltip provider. Must ultimately contain a `TooltipRenderer` (or a component that uses one) with a single non-Fragment child. |

## Usage

```tsx
import { Tooltip } from '@anupheaus/react-ui';

// Simple text tooltip
<Tooltip content="This field is required" showArrow>
  <SomeFieldComponent />
</Tooltip>

// Multi-line tooltip
<Tooltip content={"Line one\nLine two\n\nAfter blank line"}>
  <Icon name="help" />
</Tooltip>
```

## Architecture

`Tooltip` is a pure context provider — it does not render any DOM of its own. `TooltipRenderer` (internal) consumes the context and wraps its first child with MUI's `<Tooltip>`. If `content` is empty and `persist` is false, `TooltipRenderer` renders its children without any tooltip wrapper. This two-component design lets field components slot a `TooltipRenderer` at any depth without needing to accept tooltip props themselves.

---

[← Back to Components](../README.md)
