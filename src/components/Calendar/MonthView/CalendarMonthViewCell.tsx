import { useMemo } from 'react';
import { pureFC } from '../../../anuxComponents';
import { Tag } from '../../Tag';
import { CalendarTheme } from '../CalendarTheme';
import { CalendarUtils } from '../CalendarUtils';
import { CalendarMonthViewCellEntry } from './CalendarMonthViewCellEntry';
import { CalendarMonthEntryRecord } from './CalendarMonthViewModels';

const cellSize = 100;

interface Props {
  className?: string;
  cellDate: Date;
  dayIndex: number;
  entries: CalendarMonthEntryRecord[];
  dehighlightDate: boolean;
}

export const CalendarMonthViewCell = pureFC<Props>()('CalendarMonthViewCell', CalendarTheme, ({
  monthViewCellDateFontSize, monthViewCellDateFontWeight, monthViewTodayBackgroundColor,
}) => ({
  cell: {
    position: 'relative',
    width: cellSize,
    height: cellSize,
    padding: '2px 4px',
    boxSizing: 'border-box',
  },
  dehighlightCell: {
    backgroundColor: 'rgba(0 0 0 / 3%)',
  },
  isToday: {
    backgroundColor: monthViewTodayBackgroundColor,
  },
  dehighlightDate: {
    opacity: 0.3,
  },
  cellDate: {
    display: 'flex',
    fontSize: monthViewCellDateFontSize,
    fontWeight: monthViewCellDateFontWeight,
    cursor: 'default',
    justifyContent: 'flex-end',
  },
}), ({
  className,
  cellDate,
  dayIndex,
  entries,
  dehighlightDate,
  theme: { css, join },
}) => {

  const renderedEntries = useMemo(() => entries.map(({ renderedOnRow, entry }) => (
    <CalendarMonthViewCellEntry key={entry.id} entry={entry} cellDate={cellDate} renderedOnRow={renderedOnRow} dayIndex={dayIndex} cellSize={cellSize} />
  )), [entries, cellDate]);

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
      <Tag name="calendar-month-view-cell-date" className={join(css.cellDate, dehighlightDate && css.dehighlightDate)}>
        {cellDate.getDate()}
      </Tag>
      {renderedEntries}
    </Tag>
  );
});
