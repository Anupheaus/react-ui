import { createStyles } from '../../../theme';
import { useMemo } from 'react';
import { createComponent } from '../../Component';
import { Tag } from '../../Tag';
import { CalendarUtils } from '../CalendarUtils';
import { CalendarMonthViewCellEntry } from './CalendarMonthViewCellEntry';
import type { CalendarMonthEntryRecord } from './CalendarMonthViewModels';
import type { CalendarDayAdornmentRenderer } from '../CalendarModels';
import {
  MONTH_CELL_HEADER_HEIGHT, MONTH_CELL_HEIGHT, MONTH_CELL_PADDING_TOP, MONTH_ENTRY_HEIGHT, MONTH_VISIBLE_ROWS, fitMonthCellEntries, getMonthEntryTop,
} from './CalendarMonthViewLayout';

interface Props {
  className?: string;
  viewingDate: Date;
  cellDate: Date;
  dayIndex: number;
  entries: CalendarMonthEntryRecord[];
  dehighlightDate: boolean;
  renderDayAdornment?: CalendarDayAdornmentRenderer;
}
const useStyles = createStyles(({ calendar }) => ({
  cell: {
    position: 'relative',
    width: '100%',
    height: MONTH_CELL_HEIGHT,
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
    // A fixed height, so the entry chips can start below it and never cover the date or its adornment.
    height: MONTH_CELL_HEADER_HEIGHT,
    boxSizing: 'border-box',
    alignItems: 'center',
    gap: 4,
    fontSize: calendar.monthViewCellDateFontSize,
    fontWeight: calendar.monthViewCellDateFontWeight,
    cursor: 'default',
    justifyContent: 'flex-end',
  },
  // The date stays hard right; an adornment takes the space to its left rather than pushing it around.
  cellDateWithAdornment: {
    justifyContent: 'space-between',
  },
  dayAdornment: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
    maxHeight: MONTH_CELL_HEADER_HEIGHT,
  },
  // Takes the last row of chips on a busy day.
  moreEntries: {
    position: 'absolute',
    left: 6,
    right: 6,
    top: getMonthEntryTop(MONTH_VISIBLE_ROWS),
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
  renderDayAdornment,
}: Props) => {
  const { css, join } = useStyles();

  const dayAdornment = useMemo(() => renderDayAdornment?.(cellDate), [renderDayAdornment, cellDate]);

  const { visibleEntries, hiddenCount } = useMemo(() => fitMonthCellEntries(entries), [entries]);
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
      className={join(
        css.cell,
        dehighlightDate && css.dehighlightCell,
        CalendarUtils.isOnSameDay(cellDate, new Date()) && css.isToday,
        className,
      )}
    >
      <Tag name="calendar-month-view-cell-date" className={join(css.cellDate, dayAdornment != null && css.cellDateWithAdornment, dehighlightDate && css.dehighlightDate)}>
        {dayAdornment != null && <Tag name="calendar-month-view-day-adornment" className={css.dayAdornment}>{dayAdornment}</Tag>}
        {cellDate.getDate()}
      </Tag>
      {renderedEntries}
      {hiddenCount > 0 && <Tag name="calendar-month-view-cell-more" className={css.moreEntries}>+{hiddenCount} more</Tag>}
    </Tag>
  );
});
