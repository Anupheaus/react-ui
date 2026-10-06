import type { CalendarMonthEntryRecord } from './CalendarMonthViewModels';

/** Height of a day cell when the calendar has room for it, in px. A short calendar shares its height between the week rows, down to `MONTH_CELL_MIN_HEIGHT`. */
export const MONTH_CELL_HEIGHT = 100;

/** Space above a cell's header row, in px (the cell's top padding). */
export const MONTH_CELL_PADDING_TOP = 2;

/** Height of a cell's header row (the day's count and the date), in px. Entry chips start below it. */
export const MONTH_CELL_HEADER_HEIGHT = 24;

/** Height of one entry chip, in px. */
export const MONTH_ENTRY_HEIGHT = 19;

/** Vertical distance from one row of chips to the next, in px (a chip plus a 1px gap). */
export const MONTH_ROW_HEIGHT = 20;

/** The fewest rows of chips a cell makes room for: one chip, and "+N more" below it on a busy day. */
const MONTH_MIN_VISIBLE_ROWS = 2;

/** The smallest a day cell gets in a short calendar, in px: its header row plus one chip and "+N more". */
export const MONTH_CELL_MIN_HEIGHT = MONTH_CELL_PADDING_TOP + MONTH_CELL_HEADER_HEIGHT + (MONTH_MIN_VISIBLE_ROWS * MONTH_ROW_HEIGHT);

/**
 * How many rows of chips fit in a cell of `cellHeight` px below its header row — never fewer than one chip and
 * "+N more". Before the cell has been measured (undefined or 0), a full-size `MONTH_CELL_HEIGHT` cell is assumed.
 */
export function getMonthVisibleRows(cellHeight: number | undefined): number {
  const height = cellHeight == null || cellHeight <= 0 ? MONTH_CELL_HEIGHT : cellHeight;
  const rows = Math.floor((height - MONTH_CELL_PADDING_TOP - MONTH_CELL_HEADER_HEIGHT) / MONTH_ROW_HEIGHT);
  return Math.max(rows, MONTH_MIN_VISIBLE_ROWS);
}

/** How many rows of chips fit in a full-size (`MONTH_CELL_HEIGHT`) cell below its header row. */
export const MONTH_VISIBLE_ROWS = getMonthVisibleRows(MONTH_CELL_HEIGHT);

/** Where the chip on `row` (1-based, as `CalendarMonthEntryRecord.renderedOnRow`) sits from the top of its cell, in px. */
export function getMonthEntryTop(row: number): number {
  return MONTH_CELL_PADDING_TOP + MONTH_CELL_HEADER_HEIGHT + ((row - 1) * MONTH_ROW_HEIGHT);
}

/** What a day cell shows: the chips that fit, and how many more there are on a busy day. */
export interface MonthCellFit {
  visibleEntries: CalendarMonthEntryRecord[];
  /** Entries in the cell that are not shown; the cell says "+N more" in the last row instead. 0 when all fit. */
  hiddenCount: number;
}

/**
 * Fits a day's chips into its cell, which has room for `visibleRows` rows of chips (see `getMonthVisibleRows`). When
 * every chip's row fits, all show. Otherwise the last row that fits says "+N more" instead, so a busy day never runs
 * its chips over the cell below or clips them.
 */
export function fitMonthCellEntries(entries: CalendarMonthEntryRecord[], visibleRows: number = MONTH_VISIBLE_ROWS): MonthCellFit {
  const doAllFit = entries.every(({ renderedOnRow }) => renderedOnRow <= visibleRows);
  if (doAllFit) return { visibleEntries: entries, hiddenCount: 0 };
  const visibleEntries = entries.filter(({ renderedOnRow }) => renderedOnRow < visibleRows);
  return { visibleEntries, hiddenCount: entries.length - visibleEntries.length };
}
