# Slider clampMin / clampMax — Design Spec

**Date:** 2026-04-19  
**Status:** Approved

---

## Overview

Add `clampMin` and `clampMax` props to the existing `Slider` component. These constrain the thumb(s) to a sub-range within the full `min`/`max` track. The forbidden zone(s) outside the allowed range are rendered with a distinct dimmed colour so the user can see the full scale but understands the restricted area.

---

## Props

Add to `SliderOwnProps` (no changes to the discriminated union):

```ts
clampMin?: number;  // thumb cannot go below this; defaults to min (no restriction)
clampMax?: number;  // thumb cannot go above this; defaults to max (no restriction)
```

Both are optional. If neither is provided the component behaves identically to today.

---

## Theme

Add `forbiddenRailColor` to `SliderTheme` in `ThemeModel.ts`:

```ts
interface SliderTheme {
  trackColor: string;
  railColor: string;
  thumbColor: string;
  thumbBorderColor?: string;
  markColor?: string;
  valueLabelBackgroundColor?: string;
  valueLabelTextColor?: string;
  forbiddenRailColor?: string;  // NEW — colour of the forbidden zone overlay
}
```

Add default in `DefaultTheme.ts` inside the existing `slider.normal` block:

```ts
forbiddenRailColor: 'rgba(0 0 0 / 12%)',
```

---

## Rendering

The MUI Slider is wrapped in a `position: relative` container `div`. When `clampMin` or `clampMax` is set, one or two overlay `div`s are rendered inside the container to cover the forbidden portion(s) of the rail:

```
┌─────────────────────────────────────────────┐  ← container (position: relative)
│░░░░░░░░░│━━━━━━━━━━━━━━━━━━●━━━━━━━│░░░░░░░│  ← rail
│         ↑                           ↑       │
│      clampMin                    clampMax   │
│ ←overlay→                        ←overlay→ │
└─────────────────────────────────────────────┘
```

### Overlay positioning (horizontal)

| Zone | `left` | `width` / `right` |
|---|---|---|
| Left forbidden (clampMin) | `0` | `((clampMin - min) / (max - min)) * 100%` |
| Right forbidden (clampMax) | `((clampMax - min) / (max - min)) * 100%` | `right: 0` |

Each overlay:
- `position: absolute`
- `height: 4px` (matches MUI default rail height)
- `top: 50%; transform: translateY(-50%)` — vertically centred over the rail
- `backgroundColor: normal.forbiddenRailColor`
- `zIndex` between rail and thumb so it is visible but non-interactive
- `pointerEvents: none` — clicks pass through to the MUI slider beneath

### Overlay positioning (vertical)

MUI vertical sliders place `min` at the bottom and `max` at the top. The percentage calculation inverts:

| Zone | `bottom` | `height` |
|---|---|---|
| Bottom forbidden (clampMin) | `bottom: 0` | `((clampMin - min) / (max - min)) * 100%` |
| Top forbidden (clampMax) | `top: 0` | `((max - clampMax) / (max - min)) * 100%` |

Overlays use `width: 4px; left: 50%; transform: translateX(-50%)` for vertical.

---

## Value Clamping (onChange)

Before calling the consumer's `onChange`, clamp the outgoing value:

**Single mode:**
```ts
const clamped = Math.max(effectiveClampMin, Math.min(effectiveClampMax, newValue as number));
```

**Range mode:** Clamp each thumb independently:
```ts
const [newMin, newMax] = newValue as number[];
onChange({ min: Math.max(effectiveClampMin, newMin), max: Math.min(effectiveClampMax, newMax) });
```

Where `effectiveClampMin = clampMin ?? min` and `effectiveClampMax = clampMax ?? max`.

---

## Files

| File | Action |
|---|---|
| `src/theme/themes/ThemeModel.ts` | Add `forbiddenRailColor?: string` to `SliderTheme` |
| `src/theme/themes/DefaultTheme.ts` | Add `forbiddenRailColor: 'rgba(0 0 0 / 12%)'` to `slider.normal` |
| `src/components/Slider/Slider.tsx` | Add `clampMin`/`clampMax` props, overlay rendering, onChange clamping |
| `src/components/Slider/Slider.tests.tsx` | Add tests for clamping and forbidden zone rendering |
| `src/components/Slider/AGENTS.md` | Document new props and theming key |

---

## Out of Scope

- Showing a tooltip or label on the clamp boundary
- Animating the forbidden zone boundary
- Per-thumb clamping in range mode (both thumbs share the same clampMin/clampMax)
