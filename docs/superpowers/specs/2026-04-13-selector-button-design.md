# SelectorButton Design Spec

**Date:** 2026-04-13
**Status:** Approved

## Overview

`SelectorButton` is a compact trigger button that opens the full `Selector` UI in a popover. It solves the problem that the existing `Selector` component takes up a lot of UI space. The button shows the current selection state and expands on click to let the user pick from the selector items.

---

## Architecture

Three files change or are created in `src/components/Selector/`:

### `InternalSelector.tsx` (new, not exported)
Extracts the core rendering logic from the current `Selector.tsx` — the sections, scroller, and selection state management. Has no `Field` wrapper, no skeleton, no label, no validation. Accepts `items`, `selectionConfiguration`, and `onSelect` as props. Used by both `Selector` and `SelectorButton`.

### `Selector.tsx` (refactored)
Becomes a thin wrapper: `Field` + `InternalSelector`. Public API and external behaviour are unchanged. The skeleton, label, validation, and error display remain here.

### `SelectorButton.tsx` (new, exported)
A self-contained component that owns:
- Open/closed state of the popover
- Selected IDs (derived initially from `items[].subItems[].isSelected`)

Renders a `Field`-wrapped `Button` as the trigger and an MUI `Popover` containing `InternalSelector`. Exported from `index.ts`.

### Unchanged files
`selector-models.ts`, `SelectorSection.tsx`, `SelectorSectionItem.tsx`, `processSelectedItemsWithSections.ts` — no modifications.

---

## Component API

```ts
interface SelectorButtonProps extends FieldProps {
  items: SelectorItem[];
  selectionConfiguration?: SelectorSelectionConfiguration;
  onSelect?(selectedItems: SelectorSubItem[]): void;
}
```

- Inherits `FieldProps` — `label`, `isOptional`, `requiredMessage`, `error`, and skeleton behaviour all live on the button via the `Field` wrapper.
- No `height` / `fullHeight` props — the popup sizes to its own content.
- `selectionConfiguration` is passed through to `InternalSelector`.
- `onSelect` fires on every selection change.

---

## Button Display Logic

| State | Display |
|---|---|
| 0 items selected | `"Not Set"` (muted/greyed styling) |
| 1 item selected | The sub-item's `label ?? text` |
| 2+ items selected | `"n selected"` |

The button uses standard `Button` component styling (not a dropdown/input style).

---

## Single-Select Auto-Close Detection

The popup auto-closes immediately after a selection when the effective configuration is single-select. This is true when:
- `selectionConfiguration.totalSelectableItems === 1`, **or**
- There is exactly one section and that section's `maxSelectableItems === 1`

Otherwise (multi-select), the popup remains open until the user clicks/taps outside it.

---

## Popup Behaviour & Positioning

- **Anchor:** MUI `Popover` anchored to the button element.
- **Default position:** opens below the button, left-aligned (`anchorOrigin: { vertical: 'bottom', horizontal: 'left' }`, `transformOrigin: { vertical: 'top', horizontal: 'left' }`).
- **Smart repositioning:** MUI's built-in viewport-aware repositioning handles flipping above/shifting left-right when screen space is insufficient. No custom logic required.
- **Width:** sizes to `InternalSelector` content — not forced to match the button width.
- **Close — multi-select:** clicking/tapping outside the `Popover` closes it via MUI's `onClose`.
- **Close — single-select:** `SelectorButton`'s internal `onSelect` handler calls `setIsOpen(false)` immediately after selection.
- **Loading state:** while the UI is in a loading state (`useUIState().isLoading`) and `items` is empty, the button shows the skeleton via `Field`. The `Field` skeleton replaces the button with a non-interactive skeleton element, so the popover cannot be triggered while loading — no explicit guard needed in `SelectorButton`'s click handler.

---

## Storybook (`SelectorButton.stories.tsx`)

| Story | Description |
|---|---|
| `NotSet` | No pre-selected items — button shows "Not Set" |
| `SingleSelect` | `selectionConfiguration: { totalSelectableItems: 1 }` — popup auto-closes on pick |
| `MultiSelect` | Multi-section items — popup stays open, shows "n selected" after 2+ picks |
| `PreSelected` | Items with `isSelected: true` — button opens showing existing selection |
| `Loading` | Wrapped in `<UIState isLoading>` — button shows skeleton |

---

## Tests (`SelectorButton.test.tsx`)

| Test | Description |
|---|---|
| Renders "Not Set" | Button shows "Not Set" when nothing is selected |
| Renders selected text | Button shows sub-item text when exactly one item is selected |
| Renders "n selected" | Button shows "2 selected" (etc.) when multiple items selected |
| Opens popover on click | Clicking button opens the popover |
| Single-select auto-close | Selecting in single-select mode closes the popover and updates the label |
| Multi-select stays open | Selecting in multi-select mode keeps the popover open and updates the label |
| Click-outside closes | Clicking outside the popover closes it |
| Loading — not openable | Button cannot open the popover while in loading state |
