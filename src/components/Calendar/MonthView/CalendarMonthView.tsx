import { pureFC } from '../../../anuxComponents';
import { Tag } from '../../Tag';
import { CalendarEntryRecord } from '../CalendarModels';
import { CalendarTheme } from '../CalendarTheme';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { CalendarMonthViewCell } from './CalendarMonthViewCell';
import { CalendarMonthViewUtils } from './CalendarMonthViewUtils';

interface Props {
  viewingDate: Date;
  entries: readonly CalendarEntryRecord[];
}

export const CalendarMonthView = pureFC<Props>()('CalendarMonthView', CalendarTheme, ({
  monthViewDayNameFontSize, monthViewDayNameFontWeight,
}) => ({
  monthView: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gridGap: 1,
    minWidth: 400,
    overflow: 'hidden',
    border: 'solid 1px #eee',
    borderRadius: 8,
  },
  cell: {
    outline: 'solid 1px #eee',
  },
  dayName: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0px 8px 2px',
    fontSize: monthViewDayNameFontSize,
    fontWeight: monthViewDayNameFontWeight,
  },
}), ({
  viewingDate,
  entries,
  theme: { css, join },
}) => {
  const [firstDate, endDate] = CalendarMonthViewUtils.findFirstDateFor(viewingDate);
  const monthEntries = CalendarMonthViewUtils.createMonthEntries(entries, firstDate, endDate);

  const renderDayName = (dayName: string) => (
    <Tag name="calendar-month-view-day-name" className={join(css.cell, css.dayName)}>{dayName}</Tag>
  );

  const renderedDayCells = useMemo(() => new Array(35).fill(0).map((_, index) => {
    const cellDate = DateTime.fromJSDate(firstDate).plus({ days: index }).toJSDate();
    const dayIndex = index % 7;
    const entriesForDay = CalendarMonthViewUtils.getEntriesForDate(monthEntries, cellDate, dayIndex);
    const dehighlightDate = cellDate.getMonth() !== viewingDate.getMonth();
    return (
      <CalendarMonthViewCell key={index} className={css.cell} dayIndex={dayIndex} cellDate={cellDate} entries={entriesForDay} dehighlightDate={dehighlightDate} />
    );
  }), [firstDate]);

  return (
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
});
