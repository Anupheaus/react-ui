import { createComponent } from '../../Component';
import { Tag } from '../../Tag';
import { createStyles } from '../../../theme';
import { CalendarUtils } from '../CalendarUtils';
import type { CalendarWeekDay } from '../CalendarModels';
import { CalendarWeekViewUtils } from './CalendarWeekViewUtils';

interface Props {
  className?: string;
  day: CalendarWeekDay;
  date: Date;
}

const useStyles = createStyles(({ calendar }) => ({
  header: {
    display: 'flex',
    flex: '1 1 0',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 0,
    padding: '0px 8px 2px',
    boxSizing: 'border-box',
  },
  isToday: {
    backgroundColor: calendar.monthViewTodayBackgroundColor,
  },
  dayName: {
    fontSize: calendar.monthViewDayNameFontSize,
    fontWeight: calendar.monthViewDayNameFontWeight,
  },
  dayDate: {
    fontSize: calendar.monthViewCellDateFontSize,
    fontWeight: calendar.monthViewCellDateFontWeight,
  },
}));

export const CalendarWeekViewDayHeader = createComponent('CalendarWeekViewDayHeader', ({
  className,
  day,
  date,
}: Props) => {
  const { css, join } = useStyles();

  return (
    <Tag
      name="calendar-week-view-day-header"
      className={join(
        css.header,
        CalendarUtils.isOnSameDay(date, new Date()) && css.isToday,
        className,
      )}
    >
      <Tag name="calendar-week-view-day-name" className={css.dayName}>
        {CalendarWeekViewUtils.getDayLabel(day)}
      </Tag>
      <Tag name="calendar-week-view-day-date" className={css.dayDate}>
        {date.getDate()}
      </Tag>
    </Tag>
  );
});
