# Test Coverage — Group 1: Pure Utilities

**Date:** 2026-04-18  
**Status:** Approved

## Goal

Add Vitest unit tests for the three pure utility modules that have no React dependency and no existing tests. Tests run in `jsdom` (project default — no override needed since none of these use browser APIs).

---

## Files

| New file | Tests |
|---|---|
| `src/components/Calendar/CalendarUtils.tests.ts` | `CalendarUtils` functions |
| `src/components/Calendar/DayView/CalendarDayUtils.tests.ts` | `calendarDayUtils.getOffset` |
| `src/theme/mergeThemes.tests.ts` | `mergeThemes` |

---

## CalendarUtils.tests.ts

Functions under test (from `CalendarUtils.ts`): `startOfDay`, `isOnSameDay`, `isBetween`, `daysInBetween`, `getEntriesForDate`.

### startOfDay
- Returns a new Date with hours/minutes/seconds/ms zeroed
- Does not mutate the input date
- Preserves year/month/day

### isOnSameDay
- Returns true for two Date objects on the same calendar day regardless of time
- Returns false when dates are on different days
- Returns false when months differ
- Returns false when years differ

### isBetween
- Returns true when date falls on the start day
- Returns true when date falls on the end day
- Returns true when date is strictly between start and end
- Returns false when date is before start
- Returns false when date is after end

### daysInBetween
- Returns 0 for the same day
- Returns 1 for consecutive days
- Returns correct count for a range spanning multiple days
- Ignores time-of-day (uses start-of-day normalisation)

### getEntriesForDate
- Returns empty array when no entries exist
- Returns only entries whose `startDate` is on the given day
- Excludes entries on different days
- Returns multiple entries when more than one fall on the same day

---

## CalendarDayUtils.tests.ts

Function under test: `calendarDayUtils.getOffset(date, hourHeight, startHour)`.

- Returns 0 when date is exactly at `startHour:00` and hourHeight matches
- Increases linearly with hours past startHour
- Adds fractional offset for minutes (e.g. 30 mins = 0.5 * hourHeight)
- Subtracts startHour offset correctly (e.g. startHour=8 shifts everything up)
- Returns negative when date hour is before startHour

---

## mergeThemes.tests.ts

Function under test: `mergeThemes(primaryTheme, secondaryTheme)`.

`mergeThemes` calls `Object.merge({}, primary, secondary)` — a deep-merge utility from `@anupheaus/common` that is augmented onto `Object` as a side effect of importing any source file that imports `@anupheaus/common`.

- Returns a new object (does not mutate primary or secondary)
- Top-level scalar values from secondary override primary
- Deep-nested scalar values from secondary override primary
- Keys present only in primary are preserved
- Keys present only in secondary are added to the result
- Uses the real `DefaultTheme` as primary and a partial override as secondary to validate against actual theme shape

> Note: `mergeThemes` is a one-liner wrapper. Tests verify the contract (deep merge, no mutation, correct precedence) rather than re-testing `Object.merge` exhaustively.
