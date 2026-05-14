# Tabs — Vertical Orientation

**Date:** 2026-05-14  
**Status:** Approved

---

## Overview

Add a `vertical` orientation mode to the existing `Tabs` component. When enabled, the tab button strip appears on the **left** side of the content area rather than above it. Tab switching animates **up/down** instead of left/right.

---

## API

### `TabsProps` change

One new optional prop on `TabsProps` (in `Tabs.tsx`):

```ts
orientation?: 'horizontal' | 'vertical';  // default: 'horizontal'
```

No changes to `Tab` props, `useTabs`, or `TabsContext`. The internal `TabButton` and `TabContent` component interfaces each gain an `orientation` prop, but these are not public API.

---

## Architecture

### `Tabs.tsx`

- Accept and default `orientation` to `'horizontal'`.
- Pass `orientation` as a prop to each `TabButton` and `TabContent` rendered in the two `useMemo` arrays.
- **Outer `<Flex>`**: when `'vertical'`, remove `isVertical` (making it a horizontal row — buttons on left, content on right).
- **`tabsButtons` styles**: when `'vertical'`, replace `borderBottomStyle/Width/Color` with `borderRightStyle/Width/Color`.
- **`tabsButtons` `<Flex>`**: when `'vertical'`, add `isVertical` so buttons stack top-to-bottom.
- `disableGrow` on the button bar is unchanged — the strip stays its natural width.
- `tabsContent` styles are unchanged — `gridTemplateColumns: '1fr'` works for both orientations.

### `TabButton.tsx`

When `orientation === 'vertical'`:

- `borderRadius`: change from `X X 0 0` (flat bottom) to `X 0 0 X` (flat right side, rounded left).
- `::after` pseudo-element: replace `borderBottomColor/Width/Style` with `borderRightColor/Width/Style`.
- `.is-focused::after`: target `borderRightColor` instead of `borderBottomColor`.
- Tablet media query padding adjustment is unchanged (size, not direction).

### `TabContent.tsx`

When `orientation === 'vertical'`:

- Add `slide-up` and `slide-down` CSS classes using `marginTop`/`marginBottom` offsets (`±50`) matching the existing `slide-left`/`slide-right` magnitudes.
- Direction logic: `newIndex > tabIndex` → `'up'`; `newIndex < tabIndex` → `'down'` (replacing `'left'`/`'right'`).
- `transitionProperty` gains `margin-top, margin-bottom` alongside the existing `margin-left, margin-right`.

---

## Testing (`useTabs.tests.tsx`)

New test cases to add alongside existing tests:

| # | Scenario | What to assert |
|---|----------|----------------|
| 1 | Render with `orientation="vertical"` | Outer flex is horizontal; button bar has right-border strip; buttons stack vertically |
| 2 | Active tab button in vertical mode | Button gets right-side strip indicator class (not bottom) |
| 3 | Tab switching in vertical mode | `slide-up` / `slide-down` applied to content (not `slide-left` / `slide-right`) |
| 4 | Explicit `orientation="horizontal"` | Identical behaviour to omitted `orientation` — no regression |

---

## Storybook (`Tabs.stories.tsx`)

New file at `src/components/Tabs/Tabs.stories.tsx`. Meta title: `'Navigation/Tabs'`. Each story wrapped in `createStory` with fixed `width`/`height`.

Since `useTabs` is a hook, each story's `render` function is a wrapper that calls `useTabs()` directly (matching the pattern used in `Dialog.stories.tsx`).

| Story | Description |
|-------|-------------|
| **Horizontal** | 3 tabs, default `orientation` — confirms existing behaviour |
| **Vertical** | 3 tabs, `orientation="vertical"` — shows left-side button strip |
| **Programmatic selection** | 3 tabs + external buttons that call `selectTab` — demonstrates the API |
| **Always show tabs** | Single tab with `alwaysShowTabs={true}` — confirms bar still renders |

---

## Files changed

| File | Change |
|------|--------|
| `src/components/Tabs/Tabs.tsx` | Add `orientation` prop; adjust outer flex direction and button-bar border |
| `src/components/Tabs/Tab/TabButton.tsx` | Accept `orientation`; flip border-radius and strip indicator axis |
| `src/components/Tabs/Tab/TabContent.tsx` | Accept `orientation`; add up/down slide classes and direction logic |
| `src/components/Tabs/AGENTS.md` | Add `orientation` prop to Tabs Props table |
| `src/components/Tabs/useTabs.tests.tsx` | Add vertical orientation test cases |
| `src/components/Tabs/Tabs.stories.tsx` | New file — four stories |
