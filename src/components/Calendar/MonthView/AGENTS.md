# CalendarMonthView

The traditional month-grid view for the `Calendar` component. Renders a 7-column CSS grid of day cells for the 5 weeks surrounding the current month.

## Overview

`CalendarMonthView` is selected when `Calendar` is rendered with `view="month"` (the default). It always renders exactly 35 cells (5 rows × 7 days, Mon–Sun), aligning with the ISO week grid. Days outside the current month are rendered but visually de-emphasised.

## Contents

### Components
- `CalendarMonthView.tsx` — root component. Computes the grid's `firstDate` (the Monday on or before the 1st of the viewed month), renders an optional `label`, day-name headers (MON–SUN), then renders 35 `CalendarMonthViewCell` instances. The month grid shell and cell outlines use `getCalendarGridLineColor`, matching day/week schedule grids.
- `CalendarMonthViewCell.tsx` — a single day cell. Shows the day number and a list of `CalendarMonthViewCellEntry` chips for entries on that day. Receives `dehighlightDate` when the cell belongs to the previous or next month.
- `CalendarMonthViewCellEntry.tsx` — a single entry chip inside a day cell. Uses the same chip styling as the day/week views (solid background colour, light shadow, 8px rounded corners, 11px title) plus an optional `icon`. The icon and title appear on the entry start day and on Monday continuations when the event began in a previous month relative to `viewingDate`; other week-row continuations show the coloured bar only. Multi-day segments round only the visible start/end edges. Entry titles use `Typography` so empty-title loading skeletons still render.

**Chips.** A day cell's header row (the date and any day adornment) is a fixed `MONTH_CELL_HEADER_HEIGHT`, and chips stack below it, one per `renderedOnRow`, so none covers the date. A chip shows the entry's `monthTitle` when it has one — on one line, ellipsised, with the full `title` in the hover overlay — and `title` otherwise. When a day has more rows of chips than fit its cell (3 in a full-size cell, fewer in a short calendar — see Row heights), its last row says "+N more" instead.

### Models and utilities
- `CalendarMonthViewLayout.ts` — the cell's geometry (`MONTH_CELL_HEIGHT`, `MONTH_CELL_MIN_HEIGHT`, `MONTH_CELL_HEADER_HEIGHT`, `MONTH_ROW_HEIGHT`, `MONTH_VISIBLE_ROWS`), `getMonthEntryTop(row)`, `getMonthVisibleRows(cellHeight)` and `fitMonthCellEntries(entries, visibleRows)` (the chips that fit, and how many are hidden).

**Row heights.** The five week rows share the height the calendar has (`minmax(MONTH_CELL_MIN_HEIGHT, 1fr)`), so a short calendar window shows every week rather than clipping the last. The smallest cell (66px) still fits one chip and "+N more". Where the calendar's height is unbounded (e.g. inside scrolling content), an invisible spacer in each cell gives the rows their preferred `MONTH_CELL_HEIGHT` (100px). Each cell measures the height it gets and fits its chips to it, so "+N more" always sits on the last row that fits.
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

## Day count

The Calendar's `getDayCount` is shown here as the day's count button (`CalendarDayCountButton`), far **left** of the day cell's date row, with the date number staying far right. See the Calendar `AGENTS.md`.
