# CalendarDayView

The timed-schedule day view for the `Calendar` component. Renders entries as positioned chips on a scrollable hour grid for a single day.

## Overview

`CalendarDayView` is selected when `Calendar` is rendered with `view="day"`. It shows a vertical scrollable area with hour labels on the left and entry chips positioned absolutely over the hours. The visible hour range auto-expands to include all entries even if they fall outside the `startHour`/`endHour` props.

## Contents

### Components
- `CalendarDayView.tsx` — root component. Computes the effective `startHour`/`endHour` range (expanding to fit entries), calculates the initial `scrollTo` offset to centre the `viewingDate`'s current time, and composes `CalendarDayViewHours` and `CalendarDayViewEntries` inside a `Scroller`.
- `CalendarDayViewHours.tsx` — the left-hand hour label column. Renders one row per hour between `startHour` and `endHour`, each `hourHeight` pixels tall. Hour row borders use `getCalendarGridLineColor`.
- `CalendarDayViewEntries.tsx` — the entries overlay. Positions each `CalendarEntryRecord` absolutely based on its `startDate` time relative to `startHour` and `hourHeight`. Handles overlapping entries by splitting available width. Renders an optional entry `icon` beside the title. Entry titles are rendered with `Typography` (`disableGrow`) so empty titles show random-width skeleton bars at text height while loading.
- `CalendarNowLine.tsx` — the current-time line: a horizontal line (colour `theme.calendar.currentTimeLineColor`) with a left-edge dot, absolutely positioned at the current time. Re-renders once a minute. Renders nothing unless `date` is today **and** the current time falls within the visible hour range. Used by both the day view and each week-view day column, so it must sit inside the same positioned container as the entries overlay.

### Utilities
- `CalendarDayUtils.ts` — pure time-to-pixel conversion helpers:
  - `getOffset(date, hourHeight, startHour)` — returns the pixel Y offset from the top of the hour grid for a given time
  - `getEffectiveHourRange(entries, rawStartHour?, rawEndHour?)` — resolves the visible hour range, expanding to fit entries when needed
  - `getNowLineOffset(now, date, hourHeight, startHour, endHour)` — the `CalendarNowLine` offset, or `null` when the line should not show (not today, or outside the visible range). Unit-tested in `CalendarDayUtils.tests.ts`.
- `CalendarDayViewLayout.ts` — overlap layout helpers:
  - `clipEntryToDay(entry, startOfDay, endOfDay)` — trims an entry to the portion that falls on the displayed day (handles overnight and multi-day entries)
  - `layoutDayViewEntries(entries)` — assigns each entry a column and renders one block per entry for its full duration. Width is shared among all entries that overlap it at any point (`100 / columnCount`), so long events are not split into multiple chips when shorter events start and end beside them.

## Ambiguities and gotchas

- **`startHour`/`endHour` are treated as hints, not hard limits** — if any entry's start or end time falls outside the provided range, the range is silently expanded to include it. The provided values are only used when no entries fall outside them.
- **`scrollTo` is computed from `calendarDayViewElementRef.current`** — this is a `useMemo` that reads a DOM element. The initial value is `0` because the ref is not yet populated on the first render; the scroll only applies after the element mounts. This is intentional (avoids a `useEffect` flash).
- **`hourHeight` defaults to 60** — one pixel per minute. Changing `hourHeight` scales everything (hours, entry heights, scroll offsets) proportionally because all calculations multiply by `hourHeight`.
- **Overnight and multi-day entries are clipped per column** — each day/week column only renders the portion of an entry between that day's start and end. Without clipping, the chip position uses the original start time (often on a previous day), so only a tail near midnight may appear visible.

## Related

- [../AGENTS.md](../AGENTS.md) — parent Calendar component: props, `CalendarEntryRecord` type, entry selection context
- [../MonthView/AGENTS.md](../MonthView/AGENTS.md) — sibling view rendered when `view="month"`

---

[← Back to Calendar](../AGENTS.md)
