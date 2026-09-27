import type { ReactNode } from 'react';
import { createComponent } from '../Component';
import type { CalendarDayAdornmentRenderer, CalendarEntryRecord, CalendarWeekDay } from './CalendarModels';
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
  renderDayAdornment?: CalendarDayAdornmentRenderer;
}

/** Renders the month/week/day view for a single date — the unit a carousel panel shows. */
export const CalendarView = createComponent('CalendarView', ({
  view, viewingDate, entries, onSelect, weekDays, startHour, endHour, hourHeight, label, renderDayAdornment,
}: Props) => {
  switch (view) {
    case 'month':
      return <CalendarMonthView label={label} entries={entries} viewingDate={viewingDate} renderDayAdornment={renderDayAdornment} />;
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
          renderDayAdornment={renderDayAdornment}
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
          renderDayAdornment={renderDayAdornment}
        />
      );
    default:
      return null;
  }
});
