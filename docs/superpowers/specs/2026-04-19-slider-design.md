# Slider Component — Design Spec

**Date:** 2026-04-19  
**Status:** Approved

---

## Overview

A `Slider` component for selecting a numeric value (or a min/max range) by dragging a thumb along a track. It integrates with the existing `Field` wrapper (label, error, assistive text, read-only support) and is styled via the library's `createStyles` theming system.

---

## Approach

Wrap MUI's `@mui/material/Slider` internally — the same pattern used by the `Switch` component which wraps `MuiSwitch`. MUI handles drag, touch, keyboard navigation, and ARIA. We expose a clean discriminated-union API on top and style the MUI internals with `createStyles` CSS class overrides.

---

## Props

```ts
type SliderProps = FieldProps & (
  | {
      type: 'single';
      value?: number;
      onChange?(value: number): void;
    }
  | {
      type: 'range';
      value?: { min: number; max: number };
      onChange?(value: { min: number; max: number }): void;
    }
) & {
  min?: number;            // default: 0
  max?: number;            // default: 100
  step?: number;           // default: 1
  showValue?: 'tooltip' | 'inline' | 'none';  // default: 'none'
  showMarks?: boolean;     // show tick marks at each step interval; default: false
  orientation?: 'horizontal' | 'vertical';    // default: 'horizontal'
}
```

The `type` discriminant narrows both `value` and `onChange` — TypeScript will error if e.g. a `{ min, max }` value is passed with `type="single"`.

---

## Internal MUI Mapping

| Our prop | MUI `Slider` prop |
|---|---|
| `type="single"`, `value: number` | `value: number` |
| `type="range"`, `value: { min, max }` | `value: [min, max]` |
| `showValue="tooltip"` | `valueLabelDisplay="auto"` |
| `showValue="inline"` | `valueLabelDisplay="on"` |
| `showValue="none"` | `valueLabelDisplay="off"` |
| `showMarks` | `marks` |
| `orientation` | `orientation` |
| `min`, `max`, `step` | `min`, `max`, `step` |
| `useUIState().isReadOnly` | `disabled` |

On `onChange`, MUI returns `number | number[]`. The component converts this back to the discriminated shape before calling the consumer's `onChange`.

---

## Field Integration

The component renders via `<Field tagName="slider" noContainer {...fieldProps}>`. This gives it label, assistive text, error display, and read-only state for free — identical to how `Switch` is integrated.

When `isReadOnly` is true (from `useUIState`), the MUI Slider receives `disabled={true}`.

---

## Theme

A `slider` entry is added to `ThemeModel` and `DefaultTheme`:

```ts
// ThemeModel.ts
interface SliderTheme {
  trackColor: string;
  railColor: string;
  thumbColor: string;
  thumbBorderColor?: string;
  markColor?: string;
  valueLabelBackgroundColor?: string;
  valueLabelTextColor?: string;
}

// Theme interface — add:
slider: {
  normal: SliderTheme;
  active: Partial<SliderTheme>;
  readOnly: Partial<SliderTheme>;
};
```

Styles target `.MuiSlider-track`, `.MuiSlider-rail`, `.MuiSlider-thumb`, `.MuiSlider-mark`, `.MuiSlider-valueLabel` via `createStyles`.

---

## Files

| File | Action |
|---|---|
| `src/components/Slider/Slider.tsx` | Create — component implementation |
| `src/components/Slider/index.ts` | Create — re-exports |
| `src/components/Slider/AGENTS.md` | Create — component docs |
| `src/components/Slider/Slider.stories.tsx` | Create — Storybook stories |
| `src/theme/themes/ThemeModel.ts` | Update — add `SliderTheme` interface and `slider` field |
| `src/theme/themes/DefaultTheme.ts` | Update — add default slider colours |
| `src/components/AGENTS.md` | Update — add Slider row to Forms & Inputs table |

---

## Storybook Stories

- `Single` — basic single-value slider
- `Range` — range slider with `{ min, max }`
- `ShowValueTooltip` — `showValue="tooltip"`
- `ShowValueInline` — `showValue="inline"`
- `WithMarks` — `showMarks` with a coarse step
- `Vertical` — `orientation="vertical"`
- `ReadOnly` — slider in read-only state

---

## Out of Scope

- Custom `valueLabelFormat` prop (MUI supports it; can be added later if needed)
- Multiple thumbs beyond two (MUI supports arbitrary arrays; not exposed here)
- Color/variant theming per-instance (theme handles global appearance)
