import { createStyles } from '../../../theme';
import { useMemo } from 'react';
import { createComponent } from '../../Component';
import { Tag } from '../../Tag';
import { CalendarUtils } from '../CalendarUtils';
import { CalendarMonthViewCellEntry } from './CalendarMonthViewCellEntry';
import type { CalendarMonthEntryRecord } from './CalendarMonthViewModels';
import type { CalendarDayAdornmentRenderer } from '../CalendarModels';

const cellSize = 100;

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
    height: cellSize,
    padding: '2px 4px',
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

  const renderedEntries = useMemo(() => entries.map(({ renderedOnRow, entry }) => (
    <CalendarMonthViewCellEntry
      key={entry.id}
      entry={entry}
      viewingDate={viewingDate}
      cellDate={cellDate}
      renderedOnRow={renderedOnRow}
      dayIndex={dayIndex}
    />
  )), [entries, cellDate, dayIndex, viewingDate]);

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
    </Tag>
  );
});
