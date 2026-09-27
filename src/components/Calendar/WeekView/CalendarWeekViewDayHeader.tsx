import { createComponent } from '../../Component';
import { Tag } from '../../Tag';
import { createStyles } from '../../../theme';
import { CalendarUtils } from '../CalendarUtils';
import type { CalendarDayAdornmentRenderer, CalendarWeekDay } from '../CalendarModels';
import { useMemo } from 'react';
import { CalendarWeekViewUtils } from './CalendarWeekViewUtils';

interface Props {
  className?: string;
  day: CalendarWeekDay;
  date: Date;
  renderDayAdornment?: CalendarDayAdornmentRenderer;
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
  dayAdornment: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 2,
    minWidth: 0,
  },
}));

export const CalendarWeekViewDayHeader = createComponent('CalendarWeekViewDayHeader', ({
  className,
  day,
  date,
  renderDayAdornment,
}: Props) => {
  const { css, join } = useStyles();

  const dayAdornment = useMemo(() => renderDayAdornment?.(date), [renderDayAdornment, date]);

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
      {dayAdornment != null && <Tag name="calendar-week-view-day-adornment" className={css.dayAdornment}>{dayAdornment}</Tag>}
    </Tag>
  );
});
