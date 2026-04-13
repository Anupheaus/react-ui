# DatePicker

A date-input field that wraps MUI X `DatePicker` with the library's `Field` chrome (label, error, adornments). Dates are handled via [Luxon](https://moment.github.io/luxon/) `DateTime` objects. A calendar popup opens when the user clicks the calendar icon button.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string \| Date \| DateTime` | No | Current date value. ISO strings, JS `Date` objects, and Luxon `DateTime` objects are all accepted. |
| `mode` | `'date' \| 'time' \| 'datetime'` | No | Controls what is being picked (default: `'date'`). |
| `format` | `string` | No | Luxon format string used to display the selected date in the input. |
| `minDate` | `DateTime` | No | Earliest selectable date. |
| `maxDate` | `DateTime` | No | Latest selectable date. |
| `minWidth` | `string \| number` | No | Minimum width of the field (default: `110`). |
| `allowClear` | `boolean` | No | When `true`, `onChange` may be called with `undefined`. |
| `onChange` | `(value: DateTime \| undefined) => void` | No | Called with a Luxon `DateTime` when the user picks a date. If `allowClear` is `true`, the value may be `undefined`. |
| `endAdornment` | `ReactNode` | No | Extra content appended after the calendar icon button. |
| `labelEndAdornment` | `ReactNode` | No | Extra content appended to the label. |
| `onDialogClosed` | `() => void` | No | Called when the calendar popup closes. |
| *(FieldProps)* | | | All props from `Field` (e.g. `label`, `error`, `disabled`, `readOnly`) are also accepted. |

## Usage

```tsx
import { DatePicker } from '@anupheaus/react-ui';
import { DateTime } from 'luxon';

function MyForm() {
  const [date, setDate] = useState<DateTime>(DateTime.now());

  return (
    <DatePicker
      label="Date of Birth"
      value={date}
      onChange={setDate}
      minDate={DateTime.fromISO('1900-01-01')}
      maxDate={DateTime.now()}
    />
  );
}
```

## Architecture

`DatePicker` composes the library's `Field` wrapper around MUI X's `DatePicker`. The MUI picker's built-in open-button is hidden; instead the library renders its own `Button`/`Icon` adornment that controls the `open` prop. Locale is hard-coded to `en-gb` via `AdapterLuxon`.

---

[← Back to Components](../README.md)
