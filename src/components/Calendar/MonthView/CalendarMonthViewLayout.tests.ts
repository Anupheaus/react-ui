import type { CalendarEntryRecord } from '../CalendarModels';
import type { CalendarMonthEntryRecord } from './CalendarMonthViewModels';
import { MONTH_CELL_HEADER_HEIGHT, MONTH_CELL_PADDING_TOP, MONTH_VISIBLE_ROWS, fitMonthCellEntries, getMonthEntryTop } from './CalendarMonthViewLayout';

function onRow(renderedOnRow: number): CalendarMonthEntryRecord {
  const entry: CalendarEntryRecord = { id: `entry-${renderedOnRow}`, startDate: new Date(2026, 8, 15) };
  return { renderedOnRow, entry };
}

describe('getMonthEntryTop', () => {
  it('starts the first row of chips below the cell header, so no chip covers the date or its adornment', () => {
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
