import { useMemo } from 'react';
import { anuxPureFC } from '../../../anuxComponents';
import { Theme } from '../../../providers/ThemeProvider';
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

export const CalendarMonthViewCell = anuxPureFC<Props>('CalendarMonthViewCell', ({
  className,
  cellDate,
  dayIndex,
  entries,
  dehighlightDate,
}) => {
  const { classes, join } = useTheme();

  const renderedEntries = useMemo(() => entries.map(({ renderedOnRow, entry }) => (
    <CalendarMonthViewCellEntry key={entry.id} entry={entry} cellDate={cellDate} renderedOnRow={renderedOnRow} dayIndex={dayIndex} cellSize={cellSize} />
  )), [entries, cellDate]);

  return (
    <Tag
      name="calendar-month-view-cell"
      className={join(
        classes.cell,
        dehighlightDate && classes.dehighlightCell,
        CalendarUtils.isOnSameDay(cellDate, new Date()) && classes.isToday,
        className,
      )}
    >
      <Tag name="calendar-month-view-cell-date" className={join(classes.cellDate, dehighlightDate && classes.dehighlightDate)}>
        {cellDate.getDate()}
      </Tag>
      {renderedEntries}
    </Tag>
  );
});

const useTheme = Theme.createThemeUsing(CalendarTheme, styles => ({
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
    backgroundColor: styles.monthViewTodayBackgroundColor,
  },
  dehighlightDate: {
    opacity: 0.3,
  },
  cellDate: {
    display: 'flex',
    fontSize: styles.monthViewCellDateFontSize,
    fontWeight: styles.monthViewCellDateFontWeight,
    cursor: 'default',
    justifyContent: 'flex-end',
  },
}));