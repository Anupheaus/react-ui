# Skeleton

A loading-state placeholder used throughout the library. When the UI is in a loading state (via `UIState`), `Skeleton` shows an animated pulsing shape in place of its children. When not loading, it renders the children directly. `NoSkeletons` suppresses all skeleton rendering within its subtree.

## Exported components

| Export | Description |
|--------|-------------|
| `Skeleton` | The placeholder component. |
| `NoSkeletons` | Context provider that disables skeleton rendering for all descendant `Skeleton` instances. |

## Props — Skeleton

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `'full' \| 'text' \| 'circle' \| 'outline'` | No | Shape variant of the placeholder. Defaults to `'full'`. See variants below. |
| `children` | `ReactNode` | No | Content to show when not loading. If omitted the skeleton is absolutely positioned to fill its parent. |
| `isVisible` | `boolean` | No | Overrides the global `isLoading` UI state to force the skeleton visible. |
| `useRandomWidth` | `boolean` | No | Gives the skeleton a random width between 20 % and 100 % (useful for text-line placeholders). Only applies when `children` is not provided. |
| `wide` | `boolean` | No | Makes the skeleton grow to fill available horizontal space (`flex-grow: 1`). Ignored when `style` is set. |
| `useAnimatedBorder` | `boolean` | No | Replaces the pulsing fill with an animated border (used by `Button` during async operations). |
| `style` | `CSSProperties` | No | Inline styles for the skeleton element. |
| `className` | `string` | No | Additional CSS class name for the skeleton element. |
| `contentClassName` | `string` | No | Additional CSS class name for the inner content wrapper. |
| `onClick` | `(event: MouseEvent<HTMLDivElement>) => void` | No | Click handler attached to the inner content wrapper. |

### Type variants

| Type | Visual |
|------|--------|
| `'full'` | Solid filled rectangle (default). |
| `'text'` | Rounded rectangle with small vertical margin — mimics a line of text. |
| `'circle'` | Circular shape (`border-radius: 50%`). |
| `'outline'` | Transparent rectangle with a coloured border instead of a fill. |

## Usage

```tsx
import { Skeleton, NoSkeletons } from '@anupheaus/react-ui';
import { UIState } from '@anupheaus/react-ui';

// Absolutely-positioned overlay that fills the parent while loading
<div style={{ position: 'relative', width: 200, height: 40 }}>
  <Skeleton />
</div>

// Text placeholder — shows skeleton while loading, real content otherwise
<Skeleton type="text" useRandomWidth>
  <span>{label}</span>
</Skeleton>

// Circle avatar placeholder
<Skeleton type="circle" style={{ width: 40, height: 40 }}>
  <Avatar src={user.avatar} />
</Skeleton>

// Suppress skeletons inside a button's label area
<NoSkeletons>
  <span>Always visible label</span>
</NoSkeletons>
```

## Architecture

`Skeleton` reads the `isLoading` flag from `UIStateProvider` (overridable via the `isVisible` prop) and the `noSkeletons` context set by `NoSkeletons`. When both conditions allow it, the skeleton element is made visible and the children are hidden. When loading is complete and children are present they are rendered directly, bypassing the skeleton wrapper entirely.

---

[← Back to Components](../AGENTS.md)
