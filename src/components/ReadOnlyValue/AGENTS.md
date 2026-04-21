# ReadOnlyValue

A display-only component that formats and renders a numeric value as either a plain number or a locale-aware currency string. Supports async (promise-based) values and shows a loading state while the value resolves.

## Props

The component accepts one of two mutually exclusive prop shapes, discriminated by `type`.

### Number variant

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `'number'` | Yes | Render as a formatted number. |
| `value` | `number \| Promise<number \| undefined>` | No | The numeric value to display. May be a promise. |
| `defaultValue` | `number` | No | Fallback value used when `value` is `undefined` or resolves to `undefined`. Defaults to `0`. |
| `decimalPlaces` | `number` | No | Number of decimal places to round to. Defaults to `0`. |

### Currency variant

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `'currency'` | Yes | Render as a locale-formatted currency string. |
| `value` | `number \| Promise<number \| undefined>` | No | The numeric value to display. May be a promise. |
| `defaultValue` | `number` | No | Fallback value when `value` is `undefined`. Defaults to `0`. |

## Usage

```tsx
import { ReadOnlyValue } from '@anupheaus/react-ui';

// Plain number with 2 decimal places
<ReadOnlyValue type="number" value={3.14159} decimalPlaces={2} />

// Currency (uses locale from the nearest LocaleProvider)
<ReadOnlyValue type="currency" value={1999.99} />

// Async value — shows loading indicator until the promise resolves
<ReadOnlyValue type="currency" value={fetchTotal()} defaultValue={0} />
```

---

[← Back to Components](../AGENTS.md)
