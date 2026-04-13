# Countdown

Displays a live countdown to a target `DateTime`. Updates every second (when `showSeconds` is true) or every minute. Supports a compact `hh:mm` format or a human-readable prose format.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `to` | `DateTime` | Yes | Target date/time to count down to (Luxon `DateTime`). |
| `showSeconds` | `boolean` | No | Include seconds in the output and update every second. Defaults to `false` (updates every minute). |
| `showDays` | `boolean` | No | Include a days component in the output. Defaults to `false` (days are folded into the hours value). |
| `asReadable` | `boolean` | No | Render as human-readable prose (e.g. `"2 hours, 15 minutes"`). Defaults to `false` (renders `hh:mm` or `d: hh:mm:ss`). |
| `className` | `string` | No | Additional CSS class name applied to the outer `<countdown>` element. |

## Usage

```tsx
import { Countdown } from '@anupheaus/react-ui';
import { DateTime } from 'luxon';

const deadline = DateTime.now().plus({ hours: 2, minutes: 30 });

// Compact format: "02:30"
<Countdown to={deadline} />

// With seconds: "02:29:58"
<Countdown to={deadline} showSeconds />

// Prose format: "2 hours, 29 minutes"
<Countdown to={deadline} asReadable />

// Days + prose: "1 day, 2 hours, 29 minutes"
<Countdown to={deadline} asReadable showDays />
```

---

[← Back to Components](../README.md)
