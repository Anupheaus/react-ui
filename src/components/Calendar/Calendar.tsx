import { createComponent } from '../Component';
import { Tag } from '../Tag';
import type { CalendarEntryRecord, CalendarWeekDay } from './CalendarModels';
import { CalendarMonthView } from './MonthView';
import { CalendarEntrySelectionProvider } from './CalendarEntrySelectionProvider';
import { CalendarEntryHighlightProvider } from './CalenderEntryHighlightProvider';
import { createStyles } from '../../theme';
import { CalendarDayView } from './DayView';
import { CalendarWeekView } from './WeekView';
import type { ReactNode } from 'react';

const useStyles = createStyles({
  calendar: {
    display: 'flex',
    flex: 'auto',
    maxHeight: '100%',
    maxWidth: '100%',
  },
});

interface Props {
  label?: ReactNode;
  className?: string;
  view?: 'month' | 'week' | 'day';
  viewingDate?: Date;
  entries?: readonly CalendarEntryRecord[];
  onSelect?(entry: CalendarEntryRecord): void;
  weekDays?: readonly CalendarWeekDay[];
  startHour?: number;
  endHour?: number;
  hourHeight?: number;
}

export const Calendar = createComponent('Calendar', ({
  className,
  view = 'month',
  viewingDate = new Date(),
  entries = Array.empty<CalendarEntryRecord>(),
  onSelect = Function.empty(),
  weekDays,
  startHour,
  endHour,
  hourHeight,
  label,
}: Props) => {
  const { css, join } = useStyles();

  const renderedView = (() => {
    switch (view) {
      case 'month': return <CalendarMonthView label={label} entries={entries} viewingDate={viewingDate} />;
      case 'day': return (
        <CalendarDayView
          label={label}
          entries={entries}
          viewingDate={viewingDate}
          onSelect={onSelect}
          startHour={startHour}
          endHour={endHour}
          hourHeight={hourHeight}
        />
      );
      case 'week': return (
        <CalendarWeekView
          label={label}
          entries={entries}
          viewingDate={viewingDate}
          onSelect={onSelect}
          weekDays={weekDays}
          startHour={startHour}
          endHour={endHour}
          hourHeight={hourHeight}
        />
      );
    }
  })();

  return (
    <CalendarEntryHighlightProvider>
      <CalendarEntrySelectionProvider>
        <Tag name="calendar" className={join(css.calendar, className)}>
          {renderedView}
        </Tag>
      </CalendarEntrySelectionProvider>
    </CalendarEntryHighlightProvider>
  );
});
