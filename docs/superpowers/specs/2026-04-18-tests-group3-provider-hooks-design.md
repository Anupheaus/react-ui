# Test Coverage — Group 3: Provider Hooks

**Date:** 2026-04-18  
**Status:** Approved

## Goal

Add Vitest unit tests for the three provider hooks that contain non-trivial logic worth unit-testing. Each test uses `renderHook({ wrapper })` where the wrapper renders the relevant provider with minimal props. Test files are co-located with the hook source.

---

## Skipped provider hooks

- `useApi` — thin context accessor, no logic
- `useRecordsProvider` — thin context accessor
- `useSubscription` / `useSubscriptionProvider` — thin pub/sub wiring, covered by integration
- `useUIState` — thin context accessor
- `useEmail` — already tested (`EmailProvider.tests.tsx`)

---

## Files and test cases

### `src/providers/LocaleProvider/useLocale.tests.ts`

Wrapper: `<LocaleProvider settings={...}>`. Import `LocaleProvider` and `useLocale` from their source files.

**`isValidISODate`**
- Returns `true` for a valid ISO string (`2024-01-15T10:30:00Z`)
- Returns `true` for a `Date` object
- Returns `true` for a `DateTime` object
- Returns `false` for `undefined`
- Returns `false` for a non-ISO string (`"hello"`)
- Returns `false` for `null`

**`toDate`**
- Returns `undefined` for `undefined` input
- Converts an ISO string to a `DateTime`
- Converts a `Date` object to a `DateTime`
- Returns the same `DateTime` if input is already a `DateTime`
- Returns `undefined` for a non-ISO string

**`formatDate` — with explicit `format` prop**
- Formats using the provided Luxon format string (e.g. `'yyyy/MM/dd'`)

**`formatDate` — with `shortDateFormat` in settings**
- Uses `settings.shortDateFormat` when `type: 'short'` and no explicit format

**`formatDate` — with `longDateFormat` in settings**
- Uses `settings.longDateFormat` when `type: 'long'` (default)

**`formatDate` — no settings overrides**
- Returns `undefined` for `undefined` date input
- Falls back to `toLocaleString` options for `type: 'readable'`

**`formatCurrency`**
- Returns `undefined` for `undefined` input
- Formats a number as currency using `settings.currency` and `settings.locale`
- Result contains the currency symbol

**`formatNumber`**
- Returns `undefined` for `undefined` input
- Formats integer with 0 decimal places (no decimal point)
- Formats with `decimalPlaces: 2` showing two decimal places

**`formatPercentage`**
- Returns `undefined` for `undefined` input
- Formats 0.5 as approximately `"50%"` with locale formatting

---

### `src/providers/LoggerProvider/useLogger.tests.ts`

`useLogger` is a thin context accessor. It returns the `Logger` from `LoggerContext`, optionally creating a sub-logger. The `Logger` class comes from `@anupheaus/common`.

Wrapper: `<LoggerProvider loggerName="test">` (creates a new `Logger("test")` internally).

- Throws `InternalError` when called outside `LoggerProvider`
- Returns a `Logger` instance when called inside `LoggerProvider`
- When `subLogName` is provided, returns a sub-logger (a different Logger instance than the parent)
- When `subLogName` is omitted, returns the same logger provided by the context
- Returns a stable (memoized) logger reference when props do not change

---

### `src/providers/ValidationProvider/useValidation.tests.tsx`

`useValidation` is called inside a component and uses hooks internally — it must be tested by rendering a real component that calls it, not via `renderHook` alone (because `validate()` itself calls hooks like `useId`, `useState`).

Wrapper pattern: render a small test component that calls `useValidation()` and exposes results via state or callback refs.

**`validate` — `validateRequired`**
- Returns no error when value is non-empty string and `isRequired: true`
- Returns the default message `'This field is required'` when value is `undefined` and `isRequired: true`
- Returns the default message when value is empty string and `isRequired: true`
- Returns no error when `isRequired: false` regardless of value
- Returns a custom message when provided

**`isValid`**
- Returns `true` when no errors are registered
- Returns `false` when at least one validation error exists
- Calling `isValid()` enables error highlighting

**`highlightValidationErrors`**
- Does not double-highlight if called twice

**`getErrors`**
- Returns an empty array when there are no errors
- Returns the registered errors after a validation failure
