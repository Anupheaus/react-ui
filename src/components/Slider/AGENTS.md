# Slider

A numeric input rendered as a draggable track. Supports a single value or a min/max range, with optional tick marks, value display, and vertical orientation. Wraps MUI Slider and integrates with the standard `Field` container.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'single' \| 'range'` | — | **Required.** Determines value shape |
| `value` | `number` (single) \| `{ min: number; max: number }` (range) | — | Current value |
| `onChange` | `(value: number) => void` (single) \| `(value: { min; max }) => void` (range) | — | Called on user interaction |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Increment between values |
| `showValue` | `'tooltip' \| 'inline' \| 'active' \| 'none'` | `'none'` | How to display the current value. `'tooltip'` = on hover or drag, `'inline'` = always, `'active'` = only while dragging, `'none'` = never |
| `showMarks` | `boolean` | `false` | Show tick marks at each step |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Track direction |
| `clampMin` | `number` | — | Minimum value the thumb is allowed to reach (must be ≥ `min`) |
| `clampMax` | `number` | — | Maximum value the thumb is allowed to reach (must be ≤ `max`) |
| `showScaleLabels` | `boolean` | `false` | Show min/max labels at the ends of the track |
| `minLabel` | `ReactNode` | — | Custom label for the minimum end; defaults to `min` when `showScaleLabels` is true |
| `maxLabel` | `ReactNode` | — | Custom label for the maximum end; defaults to `max` when `showScaleLabels` is true |
| `label` | `ReactNode` | — | Label above the slider |
| `isOptional` | `boolean` | — | Marks the field as optional |
| `help` | `ReactNode` | — | Help tooltip content |
| `assistiveHelp` | `ReactNode` | — | Secondary help text below slider |
| `error` | `ReactNode` | — | External error message |
| `wide` | `boolean` | — | Grow to fill available width |
| `width` | `string \| number` | — | Explicit width |

## Usage

```tsx
import { Slider } from '@anupheaus/react-ui';

// Single value
function VolumeControl() {
  const [volume, setVolume] = useState(50);
  return (
    <Slider
      type="single"
      label="Volume"
      value={volume}
      onChange={setVolume}
      showValue="tooltip"
    />
  );
}

// Range
function PriceFilter() {
  const [range, setRange] = useState({ min: 20, max: 80 });
  return (
    <Slider
      type="range"
      label="Price range"
      value={range}
      onChange={setRange}
      min={0}
      max={200}
      step={10}
      showMarks
    />
  );
}
```

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

### Scale labels

Use `showScaleLabels` to render the minimum and maximum values at the track ends. Override the
display with `minLabel` / `maxLabel` when the raw numbers are not meaningful (e.g. currency or units).

```tsx
<Slider
  type="single"
  label="Budget"
  value={budget}
  onChange={setBudget}
  min={0}
  max={500}
  showScaleLabels
  minLabel="$0"
  maxLabel="$500"
/>
```

## Theming

Add a `slider` block to your theme to override the default colours:

```ts
slider: {
  normal: {
    trackColor: '#bbdefb',
    trackBorderColor: '#1976d2',
    railColor: 'rgba(0 0 0 / 15%)',
    thumbColor: '#1976d2',
    thumbBorderColor: '#1565c0',
    thumbBorderWidth: 1,
    thumbBorderStyle: 'solid',
    haloColor: 'rgba(25 118 210 / 16%)',
    valueLabelBackgroundColor: '#1976d2',
    valueLabelTextColor: '#fff',
    forbiddenRailColor: 'rgba(0 0 0 / 12%)',
  },
  active: {},
  hover: { thumbColor: '#1e88e5', haloColor: 'rgba(25 118 210 / 24%)' },
  readOnly: { thumbColor: 'rgba(0 0 0 / 25%)' },
}
```

### Default colours

All colour tokens are optional. By default the rail, filled track and thumb are derived from
`fields.content.normal.borderColor` by flattening it onto `windows.window.active.backgroundColor`
at increasing strengths, producing a clear light→dark hierarchy so each part is distinguishable
(the source border colour is typically translucent, so the parts would otherwise be
indistinguishable):

- `railColor` (unfilled track) → lightest grey (e.g. `rgb(236)` for the default `rgba(0 0 0 / 15%)` border)
- `trackColor` (filled-track background) → medium grey (e.g. `rgb(198)`)
- `trackBorderColor` (filled-track border) → the resolved `trackColor`
- `thumbColor` → darkest grey (e.g. `rgb(152)`), so the thumb is the most prominent part
- `thumbBorderColor` → `fields.content.normal.borderColor` (same source as the checkbox / radio borders)
- `thumbBorderWidth` → `fields.content.normal.borderWidth`
- `thumbBorderStyle` → `'solid'`
- `haloColor` → the resolved `thumbColor` at low opacity (mirrors the built-in MUI halo, but themeable)

The strength multipliers track the border colour's own alpha, so a darker theme border yields a
correspondingly darker (but still stepped) set of greys.

The optional `hover` state overrides the thumb fill, border, and halo while the pointer is over the
thumb; `active.haloColor` (falling back to `hover.haloColor`) controls the larger ring shown while dragging.
By default `active` is empty, so the resting colours persist during interaction and the halo provides
the only hover/drag feedback.

---

[← Back to Components](../AGENTS.md)
