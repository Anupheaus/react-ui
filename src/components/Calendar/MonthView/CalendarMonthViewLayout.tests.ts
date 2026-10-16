import type { CalendarEntryRecord } from '../CalendarModels';
import type { CalendarMonthEntryRecord } from './CalendarMonthViewModels';
import {
  MONTH_CELL_HEADER_HEIGHT, MONTH_CELL_HEIGHT, MONTH_CELL_MIN_HEIGHT, MONTH_CELL_PADDING_TOP, MONTH_VISIBLE_ROWS, fitMonthCellEntries, getMonthEntryTop, getMonthVisibleRows,
} from './CalendarMonthViewLayout';

function onRow(renderedOnRow: number): CalendarMonthEntryRecord {
  const entry: CalendarEntryRecord = { id: `entry-${renderedOnRow}`, startDate: new Date(2026, 8, 15) };
  return { renderedOnRow, entry };
}

describe('getMonthEntryTop', () => {
  it('starts the first row of chips below the cell header, so no chip covers the date or the count', () => {
    expect(getMonthEntryTop(1)).toBe(MONTH_CELL_PADDING_TOP + MONTH_CELL_HEADER_HEIGHT);
  });

  it('stacks each further row 20px lower', () => {
    expect(getMonthEntryTop(3) - getMonthEntryTop(2)).toBe(20);
  });
});

describe('fitMonthCellEntries', () => {
  it('fits three rows of chips in a cell', () => {
    expect(MONTH_VISIBLE_ROWS).toBe(3);
  });

  it('shows every chip when they all fit', () => {
    const entries = [onRow(1), onRow(2), onRow(3)];

    expect(fitMonthCellEntries(entries)).toEqual({ visibleEntries: entries, hiddenCount: 0 });
  });

  it('gives the last row to "+N more" on a busy day, counting every chip not shown', () => {
    const { visibleEntries, hiddenCount } = fitMonthCellEntries([onRow(1), onRow(2), onRow(3), onRow(4), onRow(5)]);

    expect(visibleEntries.map(({ renderedOnRow }) => renderedOnRow)).toEqual([1, 2]);
    expect(hiddenCount).toBe(3);
  });

  it('shows nothing and hides nothing for an empty day', () => {
    expect(fitMonthCellEntries([])).toEqual({ visibleEntries: [], hiddenCount: 0 });
  });
});

// A short calendar window shares its height between the five week rows rather than giving each a fixed 100px and
// clipping the last week (sc-715), so how many rows of chips a day shows follows the height its cell actually gets.

describe('getMonthVisibleRows', () => {
  const cellHeights = [
    { cellHeight: MONTH_CELL_HEIGHT, rows: 3 },
    { cellHeight: 86, rows: 3 },
    { cellHeight: 85, rows: 2 },
    { cellHeight: MONTH_CELL_MIN_HEIGHT, rows: 2 },
    { cellHeight: 140, rows: 5 },
  ];

  it.each(cellHeights)('fits $rows rows of chips in a $cellHeight px cell', ({ cellHeight, rows }) => {
    expect(getMonthVisibleRows(cellHeight)).toBe(rows);
  });

  it('gives the smallest cell room for exactly one chip and "+N more"', () => {
    expect(getMonthVisibleRows(MONTH_CELL_MIN_HEIGHT)).toBe(2);
  });

  it.each([undefined, 0])('uses the full-size cell before the cell has been measured (%p)', cellHeight => {
    expect(getMonthVisibleRows(cellHeight)).toBe(MONTH_VISIBLE_ROWS);
  });

  it('never gives fewer rows than one chip and "+N more", even in a cell squeezed below its minimum', () => {
    expect(getMonthVisibleRows(30)).toBe(2);
  });
});

describe('fitMonthCellEntries in a shorter cell', () => {
  it('shows one chip and "+N more" when only two rows fit', () => {
    const { visibleEntries, hiddenCount } = fitMonthCellEntries([onRow(1), onRow(2), onRow(3)], 2);

    expect(visibleEntries.map(({ renderedOnRow }) => renderedOnRow)).toEqual([1]);
    expect(hiddenCount).toBe(2);
  });

  it('shows both chips when two rows fit and the day has two', () => {
    const entries = [onRow(1), onRow(2)];

    expect(fitMonthCellEntries(entries, 2)).toEqual({ visibleEntries: entries, hiddenCount: 0 });
  });
});
