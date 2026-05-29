import { createStyles } from '../../../theme';
import { Tag } from '../../Tag';
import { Label } from '../../Label';
import type { CalendarEntryRecord } from '../CalendarModels';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { CalendarMonthViewCell } from './CalendarMonthViewCell';
import { CalendarMonthViewUtils } from './CalendarMonthViewUtils';
import { createComponent } from '../../Component';

interface Props {
  label?: ReactNode;
  viewingDate: Date;
  entries: readonly CalendarEntryRecord[];
}
const useStyles = createStyles(({ calendar }) => ({
  monthViewShell: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    width: '100%',
  },
  monthView: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gridGap: 1,
    minWidth: 400,
    overflow: 'hidden',
    border: 'solid 1px #eee',
    borderRadius: 8,
  },
  gridCellBorder: {
    outline: 'solid 1px #eee',
  },
  dayName: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0px 8px 2px',
    fontSize: calendar.monthViewDayNameFontSize,
    fontWeight: calendar.monthViewDayNameFontWeight,
  },
}));

export const CalendarMonthView = createComponent('CalendarMonthView', ({
  label,
  viewingDate,
  entries,
}: Props) => {
  const { css, join } = useStyles();
  const [firstDate, endDate] = CalendarMonthViewUtils.findFirstDateFor(viewingDate);
  const monthEntries = CalendarMonthViewUtils.createMonthEntries(entries, firstDate, endDate);

  const renderDayName = (dayName: string) => (
    <Tag name="calendar-month-view-day-name" className={join(css.gridCellBorder, css.dayName)}>{dayName}</Tag>
  );

  const renderedDayCells = useMemo(() => new Array(35).fill(0).map((_, index) => {
    const cellDate = DateTime.fromJSDate(firstDate).plus({ days: index }).toJSDate();
    const dayIndex = index % 7;
    const entriesForDay = CalendarMonthViewUtils.getEntriesForDate(monthEntries, cellDate, dayIndex);
    const dehighlightDate = cellDate.getMonth() !== viewingDate.getMonth();
    return (
      <CalendarMonthViewCell key={index} className={css.gridCellBorder} dayIndex={dayIndex} cellDate={cellDate} entries={entriesForDay} dehighlightDate={dehighlightDate} />
    );
  }), [firstDate]);

  const monthGrid = (
    <Tag name="calendar-month-view" className={css.monthView}>
      {renderDayName('MON')}
      {renderDayName('TUE')}
      {renderDayName('WED')}
      {renderDayName('THU')}
      {renderDayName('FRI')}
      {renderDayName('SAT')}
      {renderDayName('SUN')}
      {renderedDayCells}
    </Tag>
  );

  if (label == null) {
    return monthGrid;
  }

  return (
    <Tag name="calendar-month-view-root" className={css.monthViewShell}>
      <Label>{label}</Label>
      {monthGrid}
    </Tag>
  );
});
