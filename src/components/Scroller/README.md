# Scroller

A scrollable content container that hides the scrollbar until the user hovers and renders animated edge shadows to indicate that more content exists in a given direction. It also publishes scroll position through a `ScrollContext` so descendant components (e.g. `StickyHideHeader`) can react to scrolling without prop-drilling.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Scrollable content |
| `className` | `string` | No | Class applied to the inner `scroller-content` element |
| `containerClassName` | `string` | No | Class applied to the scrolling container element |
| `disableShadows` | `boolean` | No | Disable the edge-shadow overflow indicators (default: `false`) |
| `scrollTo` | `number \| 'bottom'` | No | Imperatively scroll to a pixel offset or `'bottom'` when the value changes |
| `headerContent` | `ReactNode` | No | Content rendered inside the scroll container above the scrollable area (e.g. a sticky header). Scrollbar runs alongside it. |
| `footerContent` | `ReactNode` | No | Content rendered after the scroll container (e.g. a custom footer) |
| `fullHeight` | `boolean` | No | Force the content area to a minimum of 100% height even when content is shorter (default: `false`) |
| `useParentContext` | `boolean` | No | Do not create a new `ScrollContext`; instead forward scroll events to the nearest parent `ScrollContext` (default: `false`) |
| `style` | `CSSProperties` | No | Inline styles for the `scroller-content` element |
| `actions` | `UseActions<ScrollerActions>` | No | Exposes an imperative `scrollTo(value)` method |
| `ref` | `Ref<HTMLDivElement \| null>` | No | Forwarded ref to the scrolling container element |
| `onScroll` | `(event: OnScrollEventData) => void` | No | Called on every scroll event with `{ left, top, element }` |
| `onShadowVisibilityChange` | `(event: OnShadowVisibleChangeEvent) => void` | No | Called when any edge shadow appears or disappears |

### `ScrollerActions`

| Method | Description |
|--------|-------------|
| `scrollTo(value: number \| 'bottom')` | Smoothly scroll to a pixel offset or the bottom of the content |

### `OnScrollEventData`

| Field | Type | Description |
|-------|------|-------------|
| `left` | `number` | Current horizontal scroll offset |
| `top` | `number` | Current vertical scroll offset |
| `element` | `HTMLDivElement` | The scrolling container DOM element |

### `OnShadowVisibleChangeEvent`

| Field | Type | Description |
|-------|------|-------------|
| `top` | `boolean` | Whether the top shadow is visible |
| `left` | `boolean` | Whether the left shadow is visible |
| `bottom` | `boolean` | Whether the bottom shadow is visible |
| `right` | `boolean` | Whether the right shadow is visible |

## Usage

```tsx
import { Scroller } from '@anupheaus/react-ui';

// Basic usage
<Flex width={500} height={500}>
  <Scroller>
    <LongContent />
  </Scroller>
</Flex>

// With a sticky header and imperative scroll control
const { actions, actionsRef } = useActions<ScrollerActions>();

<Flex isVertical height={600}>
  <Scroller
    actions={actionsRef}
    headerContent={<Toolbar />}
    onShadowVisibilityChange={({ top }) => console.log('top shadow', top)}
  >
    <LongList />
  </Scroller>
</Flex>

// Trigger scroll programmatically
actions?.scrollTo('bottom');
```

## Architecture

`Scroller` renders three layers inside a fixed-size outer `<scroller>` element:

1. **`scroller-container`** — the actual scrolling element (overflow auto). Fires scroll events and updates `ScrollContext`.
2. **`scroller-content`** — a flex wrapper for children that also contains four 1 px sentinel elements (top/left/bottom/right). An `IntersectionObserver` watches these sentinels against the outer element to detect which edges are scrolled past, triggering the shadow overlays.
3. **Shadow overlays** — four absolutely-positioned elements that fade in/out via CSS transitions when the corresponding sentinel goes out of view.

When `useParentContext` is `true`, the component skips creating a new `ScrollContext.Provider` and instead reports scroll data upward to the nearest parent context (useful for nested scrollers sharing a single context).

---

[← Back to Components](../README.md)
