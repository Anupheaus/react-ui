# StickyHideHeader

A header bar that slides up out of view as the user scrolls down and slides back in as they scroll up. It is "reveal on delta" — the header reappears whenever the user scrolls upward from any position, not only when near the top of the list. Must be rendered inside a `Scroller` (it reads scroll position from `ScrollContext`).

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | No | Header content (e.g. action buttons, search bar) |
| `className` | `string` | No | Class applied to the outermost wrapper element |
| `contentClassName` | `string` | No | Class applied to the visible content area |
| `gap` | `FlexProps['gap']` | No | Gap between children in the content row (default: `'fields'`) |
| `align` | `FlexProps['align']` | No | Horizontal alignment of children |
| `onHeightChange` | `(height: number) => void` | No | Called whenever the measured height of the header changes, useful for adjusting list padding |

## Usage

```tsx
import { Scroller, StickyHideHeader } from '@anupheaus/react-ui';

<Scroller
  headerContent={
    <StickyHideHeader onHeightChange={setHeaderHeight}>
      <Button>New</Button>
      <SearchField />
    </StickyHideHeader>
  }
>
  <LongList />
</Scroller>
```

> `StickyHideHeader` is typically passed as the `headerContent` prop of `Scroller` so that the scrollbar runs alongside the header rather than behind it.

## Architecture

The component uses `useScroller()` to read the current `scrollTop` from the nearest `ScrollContext`. On each render it computes an `effectiveOffset` — how many pixels to translate the header upward — using a "reveal amount" accumulator:

- While `scrollTop ≤ maxTranslate` the header slides 1:1 with the scroll position.
- Once the user has scrolled past the header height, subsequent downward scrolls reduce the reveal amount and upward scrolls increase it, clamped to `[0, maxTranslate]`.
- A `ResizeObserver` (via `useOnResize`) tracks the actual rendered height so the animation distance always matches reality.
- The outer element keeps a fixed height equal to `measuredHeight + shadowHeight` and uses a negative `marginBottom` to ensure the scroll container height does not change as the header translates, preventing scroll-jump flicker.

---

[← Back to Components](../README.md)
