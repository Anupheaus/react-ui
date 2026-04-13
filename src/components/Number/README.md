# Number

A numeric input that supports plain numbers, currency, percentages, and counters. It formats the displayed value on blur (e.g. locale currency string) and switches to a raw `<input type="number">` on focus for editing. `count` and `percent` modes include increment/decrement buttons.

## Props

Extends `InternalTextProps<number | undefined>` (all `Field` and `Text` props apply).

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `number \| undefined` | No | Controlled numeric value |
| `onChange` | `(value: number \| undefined) => void` | No | Called with the parsed number (or `undefined`) on change |
| `type` | `'number' \| 'currency' \| 'percent' \| 'count'` | No | Display mode (default: `'number'`) |
| `min` | `number` | No | Minimum allowed value; shows an error when exceeded |
| `max` | `number` | No | Maximum allowed value; shows an error when exceeded |
| `step` | `number` | No | Increment/decrement step for `count`/`percent` buttons (default: `1`) |
| `allowDecimals` | `boolean \| number` | No | Allow decimal input. A number sets the decimal places. Defaults to `true` for `currency`, `false` otherwise |
| `allowNegatives` | `boolean` | No | Allow negative values. Always `true` for `currency` and `percent` |
| `endAdornments` | `ReactNode` | No | Additional end-toolbar content appended after built-in buttons |
| `label` | `ReactNode` | No | Label rendered above the field |
| `error` | `ReactNode` | No | Error message; augmented with min/max validation if not set |
| `isOptional` | `boolean` | No | When `true`, `undefined` is a valid value |
| `wide` | `boolean` | No | Sets width to `100%` |
| `width` | `string \| number` | No | Fixed width |

## Usage

```tsx
import { Number } from '@anupheaus/react-ui';
import { useState } from 'react';

// Plain number
function PriceInput() {
  const [price, setPrice] = useState<number | undefined>(0);
  return <Number label="Price" value={price} onChange={setPrice} width={120} />;
}

// Currency
<Number label="Amount" type="currency" value={amount} onChange={setAmount} width={140} />

// Percentage with 2 decimal places
<Number label="Rate" type="percent" allowDecimals={2} value={rate} onChange={setRate} width={100} />

// Counter with min/max
<Number label="Quantity" type="count" min={0} max={99} value={qty} onChange={setQty} width={90} />
```

---

[← Back to Components](../README.md)
