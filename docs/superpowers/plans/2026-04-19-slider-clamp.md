# Slider clampMin / clampMax Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `clampMin` and `clampMax` props to the existing `Slider` component that constrain thumb movement to a sub-range and render a dimmed forbidden-zone overlay on the rail for the out-of-bounds portion.

**Architecture:** Three-part change — (1) add `forbiddenRailColor` to the theme, (2) add `clampMin`/`clampMax` to `SliderOwnProps`, clamp outgoing values in `onChange`, and render absolutely-positioned overlay `div`s inside a `position: relative` wrapper, (3) update docs. No new files; all changes to existing Slider and theme files.

**Tech Stack:** React, TypeScript, `createStyles` + `useInlineStyle` (for runtime-computed overlay positions), Vitest + @testing-library/react.

---

## File Map

| File | Action |
|---|---|
| `src/theme/themes/ThemeModel.ts` | Add `forbiddenRailColor?: string` to `SliderTheme` |
| `src/theme/themes/DefaultTheme.ts` | Add `forbiddenRailColor` default to `slider.normal` |
| `src/components/Slider/Slider.tsx` | Add props, overlay rendering, onChange clamping |
| `src/components/Slider/Slider.tests.tsx` | Add tests for clamping and overlay rendering |
| `src/components/Slider/AGENTS.md` | Add `clampMin`, `clampMax`, `forbiddenRailColor` to docs |

---

## Task 1: Add `forbiddenRailColor` to theme

**Files:**
- Modify: `src/theme/themes/ThemeModel.ts`
- Modify: `src/theme/themes/DefaultTheme.ts`

- [ ] **Step 1: Add `forbiddenRailColor` to `SliderTheme` in `ThemeModel.ts`**

Open `src/theme/themes/ThemeModel.ts`. The `SliderTheme` interface is around line 195. Add one line:

```ts
interface SliderTheme {
  trackColor: string;
  railColor: string;
  thumbColor: string;
  thumbBorderColor?: string;
  markColor?: string;
  valueLabelBackgroundColor?: string;
  valueLabelTextColor?: string;
  forbiddenRailColor?: string;  // ← add this line
}
```

- [ ] **Step 2: Add default `forbiddenRailColor` to `DefaultTheme.ts`**

Open `src/theme/themes/DefaultTheme.ts`. Find the `slider.normal` block (around line 313). Add `forbiddenRailColor` after `valueLabelTextColor`:

```ts
  slider: {
    normal: {
      trackColor: 'rgba(0 0 0 / 55%)',
      railColor: 'rgba(0 0 0 / 15%)',
      thumbColor: 'rgba(0 0 0 / 55%)',
      thumbBorderColor: 'transparent',
      markColor: 'rgba(0 0 0 / 25%)',
      valueLabelBackgroundColor: 'rgba(0 0 0 / 75%)',
      valueLabelTextColor: '#fff',
      forbiddenRailColor: 'rgba(0 0 0 / 12%)',  // ← add this line
    },
    active: {
      trackColor: 'rgba(0 0 0 / 70%)',
      thumbColor: 'rgba(0 0 0 / 70%)',
    },
    readOnly: {
      trackColor: 'rgba(0 0 0 / 25%)',
      railColor: 'rgba(0 0 0 / 10%)',
      thumbColor: 'rgba(0 0 0 / 25%)',
    },
  },
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm -C C:/code/personal/react-ui tsc --noEmit
```

Expected: no new errors in `ThemeModel.ts` or `DefaultTheme.ts`.

- [ ] **Step 4: Commit**

```bash
git -C C:/code/personal/react-ui add src/theme/themes/ThemeModel.ts src/theme/themes/DefaultTheme.ts
git -C C:/code/personal/react-ui commit -m "feat(theme): add forbiddenRailColor to SliderTheme"
```

---

## Task 2: Write failing tests

**Files:**
- Modify: `src/components/Slider/Slider.tests.tsx`

- [ ] **Step 1: Add 4 new tests to `Slider.tests.tsx`**

Open `src/components/Slider/Slider.tests.tsx`. Append these four tests inside the existing `describe('Slider', () => { ... })` block, before the closing `});`:

```tsx
  it('clamps onChange value to clampMin for type single', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Slider type="single" value={60} min={0} max={100} clampMin={50} onChange={onChange} />
    );
    const input = container.querySelector('input[type="range"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '20' } });
    expect(onChange).toHaveBeenCalledWith(50);
  });

  it('clamps onChange value to clampMax for type single', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Slider type="single" value={60} min={0} max={100} clampMax={80} onChange={onChange} />
    );
    const input = container.querySelector('input[type="range"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '95' } });
    expect(onChange).toHaveBeenCalledWith(80);
  });

  it('renders a forbidden overlay when clampMin is set', () => {
    const { container } = render(
      <Slider type="single" value={60} min={0} max={100} clampMin={50} />
    );
    expect(container.querySelector('[data-testid="forbidden-overlay"]')).not.toBeNull();
  });

  it('does not render a forbidden overlay when neither clampMin nor clampMax is set', () => {
    const { container } = render(<Slider type="single" value={50} min={0} max={100} />);
    expect(container.querySelector('[data-testid="forbidden-overlay"]')).toBeNull();
  });
```

- [ ] **Step 2: Run the new tests — expect them to fail**

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/components/Slider/Slider.tests.tsx
```

Expected: the 4 new tests fail. The existing 7 tests still pass.

---

## Task 3: Implement `clampMin` / `clampMax` in `Slider.tsx`

**Files:**
- Modify: `src/components/Slider/Slider.tsx`

Replace the entire contents of `src/components/Slider/Slider.tsx` with:

```tsx
import { Slider as MuiSlider } from '@mui/material';
import { createComponent } from '../Component';
import { Field, type FieldProps } from '../Field';
import { useBound } from '../../hooks';
import { createStyles } from '../../theme';

type SingleProps = {
  type: 'single';
  value?: number;
  onChange?(value: number): void;
};

type RangeProps = {
  type: 'range';
  value?: { min: number; max: number };
  onChange?(value: { min: number; max: number }): void;
};

type SliderOwnProps = {
  min?: number;
  max?: number;
  step?: number;
  showValue?: 'tooltip' | 'inline' | 'none';
  showMarks?: boolean;
  orientation?: 'horizontal' | 'vertical';
  clampMin?: number;
  clampMax?: number;
};

type Props = FieldProps & (SingleProps | RangeProps) & SliderOwnProps;

const valueLabelDisplayMap = {
  tooltip: 'auto',
  inline: 'on',
  none: 'off',
} as const;

const useStyles = createStyles(({ slider: { normal, active, readOnly }, pseudoClasses }, { applyTransition }) => ({
  slider: {
    '& .MuiSlider-track': {
      backgroundColor: normal.trackColor,
      borderColor: normal.trackColor,
      ...applyTransition('background-color, border-color'),
    },
    '& .MuiSlider-rail': {
      backgroundColor: normal.railColor,
      ...applyTransition('background-color'),
    },
    '& .MuiSlider-thumb': {
      backgroundColor: normal.thumbColor,
      borderColor: normal.thumbBorderColor,
      ...applyTransition('background-color'),
    },
    '& .MuiSlider-mark': {
      backgroundColor: normal.markColor ?? normal.railColor,
    },
    '& .MuiSlider-valueLabel': {
      backgroundColor: normal.valueLabelBackgroundColor ?? 'rgba(0 0 0 / 75%)',
      color: normal.valueLabelTextColor ?? '#fff',
    },

    [pseudoClasses.active]: {
      '& .MuiSlider-track': {
        backgroundColor: active.trackColor ?? normal.trackColor,
        borderColor: active.trackColor ?? normal.trackColor,
      },
      '& .MuiSlider-thumb': {
        backgroundColor: active.thumbColor ?? normal.thumbColor,
      },
    },

    [pseudoClasses.readOnly]: {
      '& .MuiSlider-track': {
        backgroundColor: readOnly.trackColor ?? normal.trackColor,
        borderColor: readOnly.trackColor ?? normal.trackColor,
      },
      '& .MuiSlider-rail': {
        backgroundColor: readOnly.railColor ?? normal.railColor,
      },
      '& .MuiSlider-thumb': {
        backgroundColor: readOnly.thumbColor ?? normal.thumbColor,
      },
    },
  },
  sliderContainer: {
    position: 'relative',
    width: '100%',
  },
  forbiddenOverlay: {
    position: 'absolute',
    height: 4,
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: normal.forbiddenRailColor ?? 'rgba(0 0 0 / 12%)',
    pointerEvents: 'none',
    zIndex: 1,
    borderRadius: 2,
  },
  forbiddenOverlayVertical: {
    position: 'absolute',
    width: 4,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: normal.forbiddenRailColor ?? 'rgba(0 0 0 / 12%)',
    pointerEvents: 'none',
    zIndex: 1,
    borderRadius: 2,
  },
}));

export const Slider = createComponent('Slider', (props: Props) => {
  const { css, useInlineStyle } = useStyles();

  const {
    min = 0,
    max = 100,
    step = 1,
    showValue = 'none',
    showMarks = false,
    orientation = 'horizontal',
    clampMin,
    clampMax,
    ...fieldProps
  } = props;

  const trackRange = max - min;
  const effectiveClampMin = clampMin ?? min;
  const effectiveClampMax = clampMax ?? max;

  const leftOverlayStyle = useInlineStyle(() => ({
    left: 0,
    width: trackRange > 0 && clampMin != null ? `${((clampMin - min) / trackRange) * 100}%` : '0%',
  }), [clampMin, min, trackRange]);

  const rightOverlayStyle = useInlineStyle(() => ({
    left: trackRange > 0 && clampMax != null ? `${((clampMax - min) / trackRange) * 100}%` : '100%',
    right: 0,
  }), [clampMax, min, trackRange]);

  const bottomOverlayStyle = useInlineStyle(() => ({
    bottom: 0,
    height: trackRange > 0 && clampMin != null ? `${((clampMin - min) / trackRange) * 100}%` : '0%',
  }), [clampMin, min, trackRange]);

  const topOverlayStyle = useInlineStyle(() => ({
    top: 0,
    height: trackRange > 0 && clampMax != null ? `${((max - clampMax) / trackRange) * 100}%` : '0%',
  }), [clampMax, max, trackRange]);

  const muiValue = props.type === 'range'
    ? [props.value?.min ?? min, props.value?.max ?? max] as [number, number]
    : props.value ?? min;

  const handleChange = useBound((_event: Event, newValue: number | number[]) => {
    if (props.type === 'single') {
      const clamped = Math.max(effectiveClampMin, Math.min(effectiveClampMax, newValue as number));
      props.onChange?.(clamped);
    } else {
      const [newMin, newMax] = newValue as number[];
      props.onChange?.({
        min: Math.max(effectiveClampMin, newMin),
        max: Math.min(effectiveClampMax, newMax),
      });
    }
  });

  return (
    <Field
      tagName="slider"
      noContainer
      {...fieldProps}
    >
      <div className={css.sliderContainer}>
        {clampMin != null && orientation === 'horizontal' && (
          <div data-testid="forbidden-overlay" className={css.forbiddenOverlay} style={leftOverlayStyle} />
        )}
        {clampMax != null && orientation === 'horizontal' && (
          <div data-testid="forbidden-overlay" className={css.forbiddenOverlay} style={rightOverlayStyle} />
        )}
        {clampMin != null && orientation === 'vertical' && (
          <div data-testid="forbidden-overlay" className={css.forbiddenOverlayVertical} style={bottomOverlayStyle} />
        )}
        {clampMax != null && orientation === 'vertical' && (
          <div data-testid="forbidden-overlay" className={css.forbiddenOverlayVertical} style={topOverlayStyle} />
        )}
        <MuiSlider
          className={css.slider}
          value={muiValue}
          min={min}
          max={max}
          step={step}
          marks={showMarks}
          orientation={orientation}
          valueLabelDisplay={valueLabelDisplayMap[showValue]}
          onChange={handleChange}
        />
      </div>
    </Field>
  );
});
```

- [ ] **Step 2: Run all Slider tests — expect all 11 to pass**

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/components/Slider/Slider.tests.tsx
```

Expected: 11/11 tests pass (7 original + 4 new).

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm -C C:/code/personal/react-ui tsc --noEmit
```

Expected: no new errors in `Slider.tsx`.

- [ ] **Step 4: Commit**

```bash
git -C C:/code/personal/react-ui add src/components/Slider/Slider.tsx src/components/Slider/Slider.tests.tsx
git -C C:/code/personal/react-ui commit -m "feat(Slider): add clampMin/clampMax with forbidden zone overlay"
```

---

## Task 4: Update README

**Files:**
- Modify: `src/components/Slider/AGENTS.md`

- [ ] **Step 1: Add `clampMin` and `clampMax` to the props table**

Open `src/components/Slider/AGENTS.md`. In the Props table, add two rows after the `orientation` row:

```markdown
| `clampMin` | `number` | — | Minimum value the thumb is allowed to reach (must be ≥ `min`) |
| `clampMax` | `number` | — | Maximum value the thumb is allowed to reach (must be ≤ `max`) |
```

- [ ] **Step 2: Add `forbiddenRailColor` to the Theming section**

In the Theming section, add `forbiddenRailColor` to the `normal` block example:

```ts
slider: {
  normal: {
    trackColor: '#1976d2',
    railColor: 'rgba(0 0 0 / 15%)',
    thumbColor: '#1976d2',
    valueLabelBackgroundColor: '#1976d2',
    valueLabelTextColor: '#fff',
    forbiddenRailColor: 'rgba(0 0 0 / 12%)',  // ← add this line
  },
  active: { trackColor: '#1565c0', thumbColor: '#1565c0' },
  readOnly: { trackColor: 'rgba(0 0 0 / 25%)', thumbColor: 'rgba(0 0 0 / 25%)' },
}
```

- [ ] **Step 3: Add a usage example for clampMin/clampMax**

Add this section before the `## Theming` heading:

```markdown
### Clamped range

When the allowed range is a sub-set of the displayed scale, use `clampMin` / `clampMax`.
The track still renders the full `min`–`max` range but the thumb cannot enter the forbidden zone,
which is shown in a dimmed colour.

```tsx
<Slider
  type="single"
  label="Deposit %"
  value={deposit}
  onChange={setDeposit}
  min={0}
  max={100}
  clampMin={50}
  showValue="tooltip"
/>
```
```

- [ ] **Step 4: Commit**

```bash
git -C C:/code/personal/react-ui add src/components/Slider/AGENTS.md
git -C C:/code/personal/react-ui commit -m "docs(Slider): document clampMin/clampMax and forbiddenRailColor"
```

---

## Task 5: Run full test suite

- [ ] **Step 1: Run all tests**

```bash
pnpm -C C:/code/personal/react-ui test:ci
```

Expected: all tests pass, no regressions.

- [ ] **Step 2: Verify TypeScript**

```bash
pnpm -C C:/code/personal/react-ui tsc --noEmit
```

Expected: no new errors.
