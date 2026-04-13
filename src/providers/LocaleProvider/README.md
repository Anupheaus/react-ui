# LocaleProvider

Supplies locale-aware formatting utilities (dates, currency, numbers, percentages) to the component tree and configures Luxon's default locale.

## When to mount

Mount near the application root, before any component that calls `useLocale()`. A single `LocaleProvider` is typically sufficient for the whole app; nest a second one to override settings for a subtree.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `settings` | `LocaleSettings` | Yes | Active locale configuration (see below) |
| `children` | `ReactNode` | Yes | Subtree that can consume locale utilities |
| `onChange` | `(settings: LocaleSettings) => void` | No | Called when locale settings change |

### `LocaleSettings`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `locale` | `string` | Yes | BCP 47 locale tag (e.g. `'en-AU'`) |
| `currency` | `string` | Yes | ISO 4217 currency code (e.g. `'AUD'`) |
| `shortDateFormat` | `string` | No | Luxon format string for short dates (e.g. `'dd/MM/yyyy'`) |
| `longDateFormat` | `string` | No | Luxon format string for long dates |
| `timeFormat` | `string` | No | Luxon format string for times |

## Consuming

Use `useLocale()` in any descendant component.

```tsx
import { useLocale } from '@anupheaus/react-ui';

const { formatDate, formatCurrency, formatNumber, formatPercentage } = useLocale();

formatDate(new Date(), { type: 'short', mode: 'date' }); // e.g. '13/04/2026'
formatCurrency(1234.5);                                   // e.g. 'A$1,234.50'
formatNumber(9876, 2);                                    // e.g. '9,876.00'
formatPercentage(0.42, 1);                                // e.g. '42.0%'
```

---

[← Back to Providers](../README.md)
