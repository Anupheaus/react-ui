# CalendarMonthView

The traditional month-grid view for the `Calendar` component. Renders a 7-column CSS grid of day cells for the 5 weeks surrounding the current month.

## Overview

`CalendarMonthView` is selected when `Calendar` is rendered with `view="month"` (the default). It always renders exactly 35 cells (5 rows × 7 days, Mon–Sun), aligning with the ISO week grid. Days outside the current month are rendered but visually de-emphasised.

## Contents

### Components
- `CalendarMonthView.tsx` — root component. Computes the grid's `firstDate` (the Monday on or before the 1st of the viewed month), renders an optional `label`, day-name headers (MON–SUN), then renders 35 `CalendarMonthViewCell` instances. The month grid shell and cell outlines use `getCalendarGridLineColor`, matching day/week schedule grids.
- `CalendarMonthViewCell.tsx` — a single day cell. Shows the day number and a list of `CalendarMonthViewCellEntry` chips for entries on that day. Receives `dehighlightDate` when the cell belongs to the previous or next month.
- `CalendarMonthViewCellEntry.tsx` — a single entry chip inside a day cell. Uses the same chip styling as the day/week views (solid background colour, light shadow, 8px rounded corners, 11px title) plus an optional `icon`. The icon and title appear on the entry start day and on Monday continuations when the event began in a previous month relative to `viewingDate`; other week-row continuations show the coloured bar only. Multi-day segments round only the visible start/end edges. Entry titles use `Typography` so empty-title loading skeletons still render.

### Models and utilities
- `CalendarMonthViewModels.ts` — internal types for the month view (grouped entry records per cell).
- `CalendarMonthViewUtils.ts` — calendar math helpers:
  - `findFirstDateFor(viewingDate)` — returns `[firstDate, endDate]` where `firstDate` is the Monday of the week containing the 1st of the month
  - `createMonthEntries(entries, firstDate, endDate)` — groups entries by day index within the grid
  - `getEntriesForDate(monthEntries, cellDate, dayIndex)` — retrieves entries for a specific cell
  - `shouldShowEntryLabel(entry, cellDate, dayIndex, viewingDate)` — whether to show the icon and title on a chip anchor (the start day, or a Monday continuation when the event began in a previous month)

## Ambiguities and gotchas

- **Always 35 cells, not the actual number of days in the month** — the grid is 5 rows × 7 columns. Months that span 6 calendar weeks will have the last row truncated. This is a known limitation.
- **Week starts on Monday** — `findFirstDateFor` finds the ISO Monday on or before the 1st of the month. The day columns are always MON–SUN. There is no prop to change the first day of the week.
- **`dehighlightDate`** is passed to cells whose `cellDate.getMonth() !== viewingDate.getMonth()` — these are days from the previous or next month that fill the grid edges. They are displayed but styled differently. There is no prop to hide them.
- **`renderedDayCells` is memoised on `firstDate` only** — entries changes do not trigger a re-render of the cell array. If entries update without `viewingDate` changing, the view may be stale. This is a known limitation; force a re-render by updating `viewingDate`.

## Related

- [../AGENTS.md](../AGENTS.md) — parent Calendar component: props, `CalendarEntryRecord` type, entry selection context
- [../DayView/AGENTS.md](../DayView/AGENTS.md) — sibling view rendered when `view="day"`

---

[← Back to Calendar](../AGENTS.md)
