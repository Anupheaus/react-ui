# Test Coverage — Group 1: Pure Utilities — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add unit tests for CalendarUtils, calendarDayUtils, and mergeThemes — three pure utility modules with no existing tests.

**Architecture:** Each test file lives co-located next to its source. No React needed; pure function calls with `expect`. The `@anupheaus/common` prototype augmentations (e.g. `Object.merge`) are applied automatically when the source file is imported.

**Tech Stack:** Vitest, TypeScript

---

## File Map

| Action | Path |
|---|---|
| CREATE | `src/components/Calendar/CalendarUtils.tests.ts` |
| CREATE | `src/components/Calendar/DayView/CalendarDayUtils.tests.ts` |
| CREATE | `src/theme/mergeThemes.tests.ts` |

---

### Task 1: CalendarUtils tests

**Files:**
- Create: `src/components/Calendar/CalendarUtils.tests.ts`

- [ ] **Step 1: Write the tests**

Create `src/components/Calendar/CalendarUtils.tests.ts`:

```typescript
import { CalendarUtils } from './CalendarUtils';
import type { CalendarEntryRecord } from './CalendarModels';

describe('CalendarUtils.startOfDay', () => {
  it('zeroes hours, minutes, seconds and milliseconds', () => {
    const d = new Date(2024, 5, 15, 13, 45, 30, 500);
    const result = CalendarUtils.startOfDay(d);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it('preserves year, month, and day', () => {
    const d = new Date(2024, 5, 15, 13, 0, 0);
    const result = CalendarUtils.startOfDay(d);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(15);
  });

  it('does not mutate the input', () => {
    const d = new Date(2024, 5, 15, 13, 45, 30, 500);
    const original = d.getTime();
    CalendarUtils.startOfDay(d);
    expect(d.getTime()).toBe(original);
  });
});

describe('CalendarUtils.isOnSameDay', () => {
  it('returns true for two dates on the same calendar day with different times', () => {
    const a = new Date(2024, 5, 15, 9, 0, 0);
    const b = new Date(2024, 5, 15, 23, 59, 59);
    expect(CalendarUtils.isOnSameDay(a, b)).toBe(true);
  });

  it('returns false when days differ', () => {
    const a = new Date(2024, 5, 15);
    const b = new Date(2024, 5, 16);
    expect(CalendarUtils.isOnSameDay(a, b)).toBe(false);
  });

  it('returns false when months differ', () => {
    const a = new Date(2024, 5, 15);
    const b = new Date(2024, 6, 15);
    expect(CalendarUtils.isOnSameDay(a, b)).toBe(false);
  });

  it('returns false when years differ', () => {
    const a = new Date(2024, 5, 15);
    const b = new Date(2025, 5, 15);
    expect(CalendarUtils.isOnSameDay(a, b)).toBe(false);
  });
});

describe('CalendarUtils.isBetween', () => {
  const start = new Date(2024, 5, 10);
  const end = new Date(2024, 5, 20);

  it('returns true when date is on the start day', () => {
    expect(CalendarUtils.isBetween(new Date(2024, 5, 10, 8, 0), start, end)).toBe(true);
  });

  it('returns true when date is on the end day', () => {
    expect(CalendarUtils.isBetween(new Date(2024, 5, 20, 23, 0), start, end)).toBe(true);
  });

  it('returns true when date is strictly between start and end', () => {
    expect(CalendarUtils.isBetween(new Date(2024, 5, 15), start, end)).toBe(true);
  });

  it('returns false when date is before start', () => {
    expect(CalendarUtils.isBetween(new Date(2024, 5, 9), start, end)).toBe(false);
  });

  it('returns false when date is after end', () => {
    expect(CalendarUtils.isBetween(new Date(2024, 5, 21), start, end)).toBe(false);
  });
});

describe('CalendarUtils.daysInBetween', () => {
  it('returns 0 for the same day', () => {
    const d = new Date(2024, 5, 15);
    expect(CalendarUtils.daysInBetween(d, d)).toBe(0);
  });

  it('returns 1 for consecutive days', () => {
    const a = new Date(2024, 5, 15);
    const b = new Date(2024, 5, 16);
    expect(CalendarUtils.daysInBetween(a, b)).toBe(1);
  });

  it('returns correct count for a multi-day range', () => {
    const a = new Date(2024, 5, 1);
    const b = new Date(2024, 5, 10);
    expect(CalendarUtils.daysInBetween(a, b)).toBe(9);
  });

  it('ignores time of day when computing days', () => {
    const a = new Date(2024, 5, 15, 23, 59, 59);
    const b = new Date(2024, 5, 16, 0, 0, 1);
    expect(CalendarUtils.daysInBetween(a, b)).toBe(1);
  });
});

describe('CalendarUtils.getEntriesForDate', () => {
  const makeEntry = (date: Date, id: string): CalendarEntryRecord => ({
    id,
    startDate: date,
    endDate: date,
    title: `Entry ${id}`,
  });

  it('returns empty array when entries list is empty', () => {
    expect(CalendarUtils.getEntriesForDate([], new Date(2024, 5, 15))).toEqual([]);
  });

  it('returns entries whose startDate is on the given day', () => {
    const target = new Date(2024, 5, 15);
    const entry = makeEntry(new Date(2024, 5, 15, 10, 30), 'a');
    expect(CalendarUtils.getEntriesForDate([entry], target)).toEqual([entry]);
  });

  it('excludes entries on different days', () => {
    const target = new Date(2024, 5, 15);
    const other = makeEntry(new Date(2024, 5, 16), 'b');
    expect(CalendarUtils.getEntriesForDate([other], target)).toEqual([]);
  });

  it('returns multiple entries when more than one fall on the same day', () => {
    const target = new Date(2024, 5, 15);
    const a = makeEntry(new Date(2024, 5, 15, 9, 0), 'a');
    const b = makeEntry(new Date(2024, 5, 15, 14, 0), 'b');
    const c = makeEntry(new Date(2024, 5, 16), 'c');
    expect(CalendarUtils.getEntriesForDate([a, b, c], target)).toEqual([a, b]);
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/components/Calendar/CalendarUtils.tests.ts
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git -C C:/code/personal/react-ui add src/components/Calendar/CalendarUtils.tests.ts
git -C C:/code/personal/react-ui commit -m "test(calendar): add CalendarUtils unit tests"
```

---

### Task 2: CalendarDayUtils tests

**Files:**
- Create: `src/components/Calendar/DayView/CalendarDayUtils.tests.ts`

- [ ] **Step 1: Write the tests**

Create `src/components/Calendar/DayView/CalendarDayUtils.tests.ts`:

```typescript
import { calendarDayUtils } from './CalendarDayUtils';

describe('calendarDayUtils.getOffset', () => {
  const hourHeight = 60; // pixels per hour

  it('returns 0 when date is exactly at startHour:00', () => {
    const date = new Date(2024, 5, 15, 8, 0, 0);
    expect(calendarDayUtils.getOffset(date, hourHeight, 8)).toBe(0);
  });

  it('increases by hourHeight for each hour past startHour', () => {
    const date = new Date(2024, 5, 15, 10, 0, 0);
    // 10:00 with startHour=8 → 2 hours * 60px = 120
    expect(calendarDayUtils.getOffset(date, hourHeight, 8)).toBe(120);
  });

  it('adds fractional offset for minutes (30 mins = half hourHeight)', () => {
    const date = new Date(2024, 5, 15, 8, 30, 0);
    // 0h 30m with hourHeight=60 → 30 * (60/60) = 30px
    expect(calendarDayUtils.getOffset(date, hourHeight, 8)).toBe(30);
  });

  it('subtracts startHour offset correctly', () => {
    const date = new Date(2024, 5, 15, 9, 0, 0);
    // startHour=10 → 9:00 is 1 hour before start → -60
    expect(calendarDayUtils.getOffset(date, hourHeight, 10)).toBe(-60);
  });

  it('works with hourHeight other than 60', () => {
    const date = new Date(2024, 5, 15, 9, 0, 0);
    // startHour=8, hourHeight=100 → 1 hour * 100 = 100
    expect(calendarDayUtils.getOffset(date, 100, 8)).toBe(100);
  });
});
```

- [ ] **Step 2: Run tests**

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/components/Calendar/DayView/CalendarDayUtils.tests.ts
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git -C C:/code/personal/react-ui add src/components/Calendar/DayView/CalendarDayUtils.tests.ts
git -C C:/code/personal/react-ui commit -m "test(calendar): add calendarDayUtils unit tests"
```

---

### Task 3: mergeThemes tests

**Files:**
- Create: `src/theme/mergeThemes.tests.ts`

- [ ] **Step 1: Write the tests**

Create `src/theme/mergeThemes.tests.ts`:

```typescript
import { mergeThemes } from './mergeThemes';
import { DefaultTheme } from './themes/DefaultTheme';

describe('mergeThemes', () => {
  it('returns a new object and does not mutate the primary theme', () => {
    const primary = DefaultTheme;
    const originalTextSize = primary.text.size;
    const result = mergeThemes(primary, { text: { size: 99 } });
    expect(result).not.toBe(primary);
    expect(primary.text.size).toBe(originalTextSize);
  });

  it('top-level scalar values from secondary override primary', () => {
    const result = mergeThemes(DefaultTheme, { text: { size: 20 } });
    expect(result.text.size).toBe(20);
  });

  it('deep nested values from secondary override primary', () => {
    const result = mergeThemes(DefaultTheme, {
      fields: { content: { normal: { borderRadius: 99 } } },
    });
    expect(result.fields.content.normal.borderRadius).toBe(99);
  });

  it('keys present only in primary are preserved', () => {
    const result = mergeThemes(DefaultTheme, { text: { size: 16 } });
    expect(result.text.family).toBe(DefaultTheme.text.family);
    expect(result.text.color).toBe(DefaultTheme.text.color);
  });

  it('secondary values do not bleed into unrelated sections', () => {
    const result = mergeThemes(DefaultTheme, { text: { size: 99 } });
    expect(result.fields.content.normal.borderRadius).toBe(DefaultTheme.fields.content.normal.borderRadius);
  });
});
```

- [ ] **Step 2: Run tests**

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/theme/mergeThemes.tests.ts
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git -C C:/code/personal/react-ui add src/theme/mergeThemes.tests.ts
git -C C:/code/personal/react-ui commit -m "test(theme): add mergeThemes unit tests"
```
