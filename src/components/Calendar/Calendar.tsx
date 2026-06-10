import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import type { CalendarEntryRecord, CalendarWeekDay } from './CalendarModels';
import { CalendarEntrySelectionProvider } from './CalendarEntrySelectionProvider';
import { CalendarEntryHighlightProvider } from './CalenderEntryHighlightProvider';
import { createStyles } from '../../theme';
import { CalendarView } from './CalendarView';
import { CalendarSwipeViewport } from './CalendarSwipeViewport';
import { useCalendarEntries, type CalendarEntriesProvider } from './useCalendarEntries';
import { getVisibleRange, isTouchEnvironment } from './calendarNavigation';

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
  /** Called when a touch swipe navigates to a new period (day/week/month per `view`). Only in `onEntries` mode. */
  onViewingDateChange?(date: Date): void;
  /**
   * Static entries to display. Provide EITHER `entries` (static, no swipe) OR `onEntries`
   * (live + swipe carousel) — not both.
   */
  entries?: readonly CalendarEntryRecord[];
  /**
   * The calendar requests entries for the date range it needs; the provider pushes them back via
   * `setEntries` (initially and on every live change). Enables the swipe carousel on touch devices.
   */
  onEntries?: CalendarEntriesProvider;
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
  onViewingDateChange,
  entries,
  onEntries,
  onSelect = Function.empty(),
  weekDays,
  startHour,
  endHour,
  hourHeight,
  label,
}: Props) => {
  const { css, join } = useStyles();

  // Swipe carousel only when the consumer drives data via onEntries AND we're on a touch device.
  const isCarousel = onEntries != null && isTouchEnvironment;

  const range = useMemo(
    () => (onEntries != null ? getVisibleRange(view, viewingDate, isCarousel) : null),
    [onEntries, view, viewingDate.getTime(), isCarousel], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const resolvedEntries = useCalendarEntries(range, onEntries, entries);

  const renderPanel = useCallback((date: Date): ReactNode => (
    <CalendarView
      view={view}
      viewingDate={date}
      entries={resolvedEntries}
      onSelect={onSelect}
      weekDays={weekDays}
      startHour={startHour}
      endHour={endHour}
      hourHeight={hourHeight}
      label={date.getTime() === viewingDate.getTime() ? label : undefined}
    />
  ), [view, resolvedEntries, onSelect, weekDays, startHour, endHour, hourHeight, label, viewingDate.getTime()]); // eslint-disable-line react-hooks/exhaustive-deps

  const content = isCarousel
    ? (
      <CalendarSwipeViewport
        view={view}
        viewingDate={viewingDate}
        onViewingDateChange={onViewingDateChange}
        renderPanel={renderPanel}
      />
    )
    : (
      <CalendarView
        view={view}
        viewingDate={viewingDate}
        entries={resolvedEntries}
        onSelect={onSelect}
        weekDays={weekDays}
        startHour={startHour}
        endHour={endHour}
        hourHeight={hourHeight}
        label={label}
      />
    );

  return (
    <CalendarEntryHighlightProvider>
      <CalendarEntrySelectionProvider>
        <Tag name="calendar" className={join(css.calendar, className)}>
          {content}
        </Tag>
      </CalendarEntrySelectionProvider>
    </CalendarEntryHighlightProvider>
  );
});
