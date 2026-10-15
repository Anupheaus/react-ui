import { createStyles } from '../../../theme';
import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import useResizeObserver from 'use-resize-observer/polyfilled.js';
import { createComponent } from '../../Component';
import { Tag } from '../../Tag';
import { CalendarUtils } from '../CalendarUtils';
import { CalendarMonthViewCellEntry } from './CalendarMonthViewCellEntry';
import type { CalendarMonthEntryRecord } from './CalendarMonthViewModels';
import { CalendarDayCountButton } from '../CalendarDayCountButton';
import {
  MONTH_CELL_HEADER_HEIGHT, MONTH_CELL_HEIGHT, MONTH_CELL_PADDING_TOP, MONTH_ENTRY_HEIGHT, fitMonthCellEntries, getMonthEntryTop, getMonthVisibleRows,
} from './CalendarMonthViewLayout';

interface Props {
  className?: string;
  viewingDate: Date;
  cellDate: Date;
  dayIndex: number;
  entries: CalendarMonthEntryRecord[];
  dehighlightDate: boolean;
}
const useStyles = createStyles(({ calendar }) => ({
  cell: {
    position: 'relative',
    width: '100%',
    // No height of its own: it fills its week row, which the grid sizes (see CalendarMonthView).
    minHeight: 0,
    // An invisible spacer below the date row giving the cell its preferred MONTH_CELL_HEIGHT. It only counts where the
    // calendar's height is unbounded (the rows then size to their content); a bounded calendar shares out its height.
    '&::after': {
      content: '""',
      display: 'block',
      height: MONTH_CELL_HEIGHT - MONTH_CELL_PADDING_TOP - MONTH_CELL_HEADER_HEIGHT,
      pointerEvents: 'none',
    },
    padding: `${MONTH_CELL_PADDING_TOP}px 4px`,
    boxSizing: 'border-box',
  },
  dehighlightCell: {
    backgroundColor: 'rgba(0 0 0 / 3%)',
  },
  isToday: {
    backgroundColor: calendar.monthViewTodayBackgroundColor,
  },
  dehighlightDate: {
    opacity: 0.3,
  },
  cellDate: {
    display: 'flex',
    // A fixed height, so the entry chips can start below it and never cover the date or the day's count.
    height: MONTH_CELL_HEADER_HEIGHT,
    boxSizing: 'border-box',
    alignItems: 'center',
    gap: 4,
    fontSize: calendar.monthViewCellDateFontSize,
    fontWeight: calendar.monthViewCellDateFontWeight,
    cursor: 'default',
    justifyContent: 'flex-end',
  },
  // The date stays hard right; the day's count button takes the far left rather than pushing it around.
  cellDateNumber: {
    marginLeft: 'auto',
  },
  // Takes the last row of chips that fits on a busy day (its top is set from the cell's height).
  moreEntries: {
    position: 'absolute',
    left: 6,
    right: 6,
    height: MONTH_ENTRY_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    fontSize: 11,
    fontWeight: 600,
    opacity: 0.75,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

export const CalendarMonthViewCell = createComponent('CalendarMonthViewCell', ({
  className,
  viewingDate,
  cellDate,
  dayIndex,
  entries,
  dehighlightDate,
}: Props) => {
  const { css, join } = useStyles();

  // The week rows share the calendar's height, so how many rows of chips fit follows the height this cell gets.
  const { ref: cellRef, height: cellHeight } = useResizeObserver<HTMLElement>();
  const visibleRows = getMonthVisibleRows(cellHeight);
  const { visibleEntries, hiddenCount } = useMemo(() => fitMonthCellEntries(entries, visibleRows), [entries, visibleRows]);
  const moreEntriesStyle = useMemo<CSSProperties>(() => ({ top: getMonthEntryTop(visibleRows) }), [visibleRows]);
  const renderedEntries = useMemo(() => visibleEntries.map(({ renderedOnRow, entry }) => (
    <CalendarMonthViewCellEntry
      key={entry.id}
      entry={entry}
      viewingDate={viewingDate}
      cellDate={cellDate}
      renderedOnRow={renderedOnRow}
      dayIndex={dayIndex}
    />
  )), [visibleEntries, cellDate, dayIndex, viewingDate]);

  return (
    <Tag
      name="calendar-month-view-cell"
      ref={cellRef}
      className={join(
        css.cell,
        dehighlightDate && css.dehighlightCell,
        CalendarUtils.isOnSameDay(cellDate, new Date()) && css.isToday,
        className,
      )}
    >
      <Tag name="calendar-month-view-cell-date" className={join(css.cellDate, dehighlightDate && css.dehighlightDate)}>
        <CalendarDayCountButton date={cellDate} />
        <Tag name="calendar-month-view-cell-date-number" className={css.cellDateNumber}>{cellDate.getDate()}</Tag>
      </Tag>
      {renderedEntries}
      {hiddenCount > 0 && <Tag name="calendar-month-view-cell-more" className={css.moreEntries} style={moreEntriesStyle}>+{hiddenCount} more</Tag>}
    </Tag>
  );
});
