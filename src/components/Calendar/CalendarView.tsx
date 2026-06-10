import type { ReactNode } from 'react';
import { createComponent } from '../Component';
import type { CalendarEntryRecord, CalendarWeekDay } from './CalendarModels';
import { CalendarMonthView } from './MonthView';
import { CalendarWeekView } from './WeekView';
import { CalendarDayView } from './DayView';

interface Props {
  view: 'month' | 'week' | 'day';
  viewingDate: Date;
  entries: readonly CalendarEntryRecord[];
  onSelect(entry: CalendarEntryRecord): void;
  weekDays?: readonly CalendarWeekDay[];
  startHour?: number;
  endHour?: number;
  hourHeight?: number;
  label?: ReactNode;
}

/** Renders the month/week/day view for a single date — the unit a carousel panel shows. */
export const CalendarView = createComponent('CalendarView', ({
  view, viewingDate, entries, onSelect, weekDays, startHour, endHour, hourHeight, label,
}: Props) => {
  switch (view) {
    case 'month':
      return <CalendarMonthView label={label} entries={entries} viewingDate={viewingDate} />;
    case 'week':
      return (
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
    case 'day':
      return (
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
    default:
      return null;
  }
});
