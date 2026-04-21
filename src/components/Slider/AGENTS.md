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
| `showValue` | `'tooltip' \| 'inline' \| 'none'` | `'none'` | Where to display the current value |
| `showMarks` | `boolean` | `false` | Show tick marks at each step |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Track direction |
| `clampMin` | `number` | — | Minimum value the thumb is allowed to reach (must be ≥ `min`) |
| `clampMax` | `number` | — | Maximum value the thumb is allowed to reach (must be ≤ `max`) |
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

## Theming

Add a `slider` block to your theme to override the default colours:

```ts
slider: {
  normal: {
    trackColor: '#1976d2',
    railColor: 'rgba(0 0 0 / 15%)',
    thumbColor: '#1976d2',
    valueLabelBackgroundColor: '#1976d2',
    valueLabelTextColor: '#fff',
    forbiddenRailColor: 'rgba(0 0 0 / 12%)',
  },
  active: { trackColor: '#1565c0', thumbColor: '#1565c0' },
  readOnly: { trackColor: 'rgba(0 0 0 / 25%)', thumbColor: 'rgba(0 0 0 / 25%)' },
}
```

---

[← Back to Components](../AGENTS.md)
