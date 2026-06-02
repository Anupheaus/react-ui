# CalendarWeekView

The timed-schedule week view for the `Calendar` component. Renders one column per configured weekday for the calendar week that contains `viewingDate`.

## Overview

`CalendarWeekView` is selected when `Calendar` is rendered with `view="week"`. It shows a header row of weekday labels and dates, with a scrollable hour grid below. Each visible day column reuses `CalendarDayViewEntries` for timed entry chips.

## Contents

### Components
- `CalendarWeekView.tsx` — root component. Resolves the visible weekdays, computes the effective hour range from entries in that week, and composes day headers plus hour/day columns inside a bordered grid shell. Grid lines and the week shell use `getCalendarGridLineColor`, matching day view.
- `CalendarWeekViewDayHeader.tsx` — column header showing the weekday label and date number. Reuses month-view typography tokens and today highlight; column dividers use the shared schedule grid line colour from the parent.
- `CalendarWeekViewDayColumn.tsx` — one day column wrapper that positions `CalendarWeekViewHourGridLines` behind `CalendarDayViewEntries` for a single date. Entry chips reuse day-view styling, including optional icons.
- `CalendarWeekViewHourGridLines.tsx` — horizontal hour-row grid lines rendered behind entries in each day column.

### Utilities
- `CalendarWeekViewUtils.ts` — week layout helpers:
  - `getWeekDayDates(viewingDate, weekDays?)` — resolves `{ day, date }` pairs for the Monday-start week containing `viewingDate`
  - `getDayLabel(day)` — returns the short weekday label (`MON`, `TUE`, …)
  - `resolveWeekDays(weekDays?)` — applies the default Mon–Sun list when `weekDays` is omitted or empty
- `useCalendarWeekViewColumnLayout.ts` — measures the scroll body’s day-column area and vertical scrollbar width so header columns stay aligned with the grid when the viewport resizes.

## Ambiguities and gotchas

- **Weeks start on Monday** — the week containing `viewingDate` is anchored to ISO Monday, matching the month view day-name order.
- **`weekDays` defaults to Mon–Sun** — pass a subset such as `['mon', 'wed', 'fri']` to show fewer columns.
- **Hour range uses entries in the visible week only** — `startHour`/`endHour` props behave like the day view: they are hints that expand to fit timed entries on any visible day.
- **Header columns track the scroll body** — a `ResizeObserver` copies the measured day-column width onto the header row (with a scrollbar-width fallback before the first measurement).
- **No top grid line on the first hour row** — the header row’s bottom border separates the header from the schedule; hour rows below start their horizontal lines from the second hour down.
- **Grid line colour** — hour rows, day-column dividers, and the week grid shell all use `getCalendarGridLineColor` (`fields.content.normal.borderColor`), same as day view.

- [../AGENTS.md](../AGENTS.md) — parent Calendar component: props, `CalendarWeekDay` type, entry selection context
- [../DayView/AGENTS.md](../DayView/AGENTS.md) — shared hour grid and entry positioning utilities

---

[← Back to Calendar](../AGENTS.md)
