# Flex

A versatile flexbox container component that wraps an HTML element with flex layout and exposes common flexbox properties as props. Use it anywhere you need to control direction, alignment, sizing, gaps, or spacing without writing inline styles.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `tagName` | `string` | No | HTML element to render (default: `"div"`) |
| `className` | `string` | No | Additional CSS class names |
| `isVertical` | `boolean` | No | Use `flex-direction: column` instead of row |
| `disableGrow` | `boolean` | No | Set `flex-grow: 0` |
| `disableShrink` | `boolean` | No | Set `flex-shrink: 0` |
| `fixedSize` | `boolean` | No | Shorthand for both `disableGrow` and `disableShrink` |
| `enableWrap` | `boolean` | No | Enable `flex-wrap: wrap` |
| `inline` | `boolean` | No | Render as `inline-flex` |
| `disableOverflow` | `boolean` | No | Apply `overflow: hidden` |
| `width` | `number \| string` | No | Explicit width |
| `height` | `number \| string` | No | Explicit height |
| `size` | `number \| string` | No | Sets both `width` and `height` to the same value |
| `wide` | `boolean` | No | Sets `width: 100%` |
| `maxWidth` | `number \| string \| boolean` | No | Max width; `true` means `100%`, `false` clears it |
| `maxHeight` | `number \| string \| boolean` | No | Max height; `true` means `100%`, `false` clears it |
| `maxWidthAndHeight` | `boolean` | No | Sets both `maxWidth` and `maxHeight` to `100%` |
| `minWidth` | `number \| string` | No | Min width |
| `minHeight` | `number \| string` | No | Min height |
| `align` | `'left' \| 'center' \| 'right' \| 'space-around' \| 'space-between' \| 'space-evenly'` | No | Main-axis alignment (`justify-content`) |
| `valign` | `'top' \| 'center' \| 'bottom' \| 'space-around' \| 'space-between' \| 'space-evenly' \| 'stretch'` | No | Cross-axis alignment (`align-items`) |
| `alignCentrally` | `boolean` | No | Shorthand for `align="center"` and `valign="center"` |
| `gap` | `number \| 'fields'` | No | Gap between children; `'fields'` uses the theme field gap |
| `padding` | `number` | No | Uniform padding |
| `shadow` | `number` | No | Adds a box shadow scaled to the given value |
| `tooltip` | `ReactNode` | No | Wraps the element in a `Tooltip` |
| `testId` | `string` | No | Sets a `data-testid` attribute |
| `allowFocus` | `boolean` | No | `true` sets `tabIndex=0`, `false` sets `tabIndex=-1` |
| `ref` | `Ref<HTMLDivElement \| null>` | No | Forwarded ref to the underlying DOM element |

All standard `HTMLAttributes<HTMLDivElement>` and `DOMAttributes<HTMLDivElement>` props are also accepted.

## Usage

```tsx
import { Flex } from '@anupheaus/react-ui';

// Basic horizontal row
<Flex gap={8} align="center" valign="center">
  <span>Left</span>
  <span>Right</span>
</Flex>

// Vertical column, fixed size, centered content
<Flex isVertical size={200} alignCentrally gap="fields">
  <Button>Click me</Button>
</Flex>

// Full-width row with overflow hidden
<Flex wide disableOverflow>
  <LongContent />
</Flex>
```

---

## Decision rationale

**Why Flex exists when you could use a `div`**

A plain `div` requires inline styles or a separate stylesheet for every flexbox layout. Inline styles bypass the theme system entirely; a separate stylesheet creates naming overhead and scattering of layout logic. Flex translates a concise prop API into CSS that is wired through `createStyles` and `useInlineStyle`, which means:

1. **`gap="fields"` is a theme token** — the `fields` gap value comes from the theme's `gaps.fields` key. If the theme changes the field gap globally, every `<Flex gap="fields">` updates automatically. A raw inline `gap: 8` would not.
2. **Behaviour props are CSS class toggles, not inline styles** — boolean props (`isVertical`, `disableGrow`, `disableShrink`, `disableOverflow`, `inline`, `enableWrap`) are applied as CSS class names that are defined in the `createStyles` block. This keeps specificity predictable and allows the component's own styles to be overridden cleanly by a `className` prop rather than fighting inline-style precedence.
3. **Single-source defaults** — the base `flex` class always sets `flexGrow: 1; flexShrink: 1; flexBasis: auto`. This default makes Flex behave as a "fill available space" primitive out of the box, which is the correct default for layout containers in this library. Changing it requires explicit `disableGrow`/`disableShrink`/`fixedSize` props, making the intent visible at the call site.

**Why Flex is the base layout primitive for the whole library**

Most other components that need to lay out children — Section, Scroller, Window, Form, etc. — render a `Flex` rather than a raw `div`. This means every layout container in the library gets theme-aware gap, consistent overflow handling, and `disableOverflow`/sizing utilities without each component reimplementing those behaviours.

**`align` and `valign` are direction-aware**

`align` maps to `justify-content` in row mode and to `align-items` in column mode (`isVertical`). `valign` does the reverse. This means you always think in "main axis / cross axis" terms using intuitive `align`/`valign` names regardless of whether the flex direction is horizontal or vertical. The mapping is done in the component — do not try to pass raw CSS `justifyContent` values via `align`; they will not be remapped.

## Ambiguities and gotchas

**`gap="fields"` is a theme token; numeric `gap` is raw pixels**

When `gap` is the string `"fields"`, Flex applies the `gap-fields` CSS class (which reads `gaps.fields` from the theme). When `gap` is a number, it is written directly as a `px` value via `useInlineStyle`. Mixing both approaches on sibling Flex components that should match is a common mistake — always use `"fields"` when you want the gap to follow the theme.

**Using `style={{}}` directly on a Flex bypasses the theme system**

`Flex` accepts and merges a `style` prop via `...providedStyle`. Any value set there overrides the computed inline style from `useInlineStyle` and is completely outside the theme. This is intentional for one-off edge cases, but it is easy to accidentally set `style={{ gap: 8 }}` thinking it will behave like `gap={8}` — it will, but it will not pick up theme changes. Use the prop API instead. See also: the project-wide rule against inline `style={{}}` props in memory feedback.

**Flex always renders with `flexGrow: 1` by default**

Unless `disableGrow`, `fixedSize`, or an explicit `width`/`height` is set, Flex will expand to fill available space. Wrapping a Flex in a context that does not itself participate in flex layout (e.g. inside an absolutely positioned container) can cause unexpected stretching. Use `fixedSize` or an explicit dimension when you need a self-contained box.

**`size` sets both width and height; it does not override an explicit `width` or `height`**

If you pass `size={200}` alongside `width={100}`, the explicit `width` takes precedence — `size` is a convenience that fills in whichever dimension has not already been set.

## Related

- [../Grid/AGENTS.md](../Grid/AGENTS.md) — sibling layout primitive for CSS grid; use Grid when you need two-dimensional layout, Flex when you need one-dimensional (row or column)
- [../Component/AGENTS.md](../Component/AGENTS.md) — Flex uses `createComponent` from the Component module; understanding `createComponent` explains how display names and prop forwarding work

---

[← Back to Components](../AGENTS.md)
