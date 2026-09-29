import type { CalendarMonthEntryRecord } from './CalendarMonthViewModels';

/** Height of a day cell, in px. */
export const MONTH_CELL_HEIGHT = 100;

/** Space above a cell's header row, in px (the cell's top padding). */
export const MONTH_CELL_PADDING_TOP = 2;

/** Height of a cell's header row (the date and any day adornment), in px. Entry chips start below it. */
export const MONTH_CELL_HEADER_HEIGHT = 24;

/** Height of one entry chip, in px. */
export const MONTH_ENTRY_HEIGHT = 19;

/** Vertical distance from one row of chips to the next, in px (a chip plus a 1px gap). */
export const MONTH_ROW_HEIGHT = 20;

/** How many rows of chips fit in a cell below its header row. */
export const MONTH_VISIBLE_ROWS = Math.floor((MONTH_CELL_HEIGHT - MONTH_CELL_PADDING_TOP - MONTH_CELL_HEADER_HEIGHT) / MONTH_ROW_HEIGHT);

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
 * Fits a day's chips into its cell. When every chip's row fits, all show. Otherwise the last row that fits says
 * "+N more" instead, so a busy day never runs its chips over the cell below or clips them.
 */
export function fitMonthCellEntries(entries: CalendarMonthEntryRecord[]): MonthCellFit {
  const doAllFit = entries.every(({ renderedOnRow }) => renderedOnRow <= MONTH_VISIBLE_ROWS);
  if (doAllFit) return { visibleEntries: entries, hiddenCount: 0 };
  const visibleEntries = entries.filter(({ renderedOnRow }) => renderedOnRow < MONTH_VISIBLE_ROWS);
  return { visibleEntries, hiddenCount: entries.length - visibleEntries.length };
}
