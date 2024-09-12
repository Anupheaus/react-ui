import { createComponent } from '../../Component';
import { Flex } from '../../Flex';
import { Scroller } from '../../Scroller';
import { CalendarEntryRecord } from '../CalendarModels';
import { CalendarDayViewHours } from './CalendarDayViewHours';
import { createStyles } from '../../../theme';
import { CalendarDayViewEntries } from './CalendarDayViewEntries';
import { calendarDayUtils } from './CalendarDayUtils';
import { useMemo, useRef } from 'react';

const useStyles = createStyles(({ surface: { asAContainer: { normal } } }) => ({
  dayView: {
    ...normal,
    flex: 'auto',
  },
}));

interface Props {
  className?: string;
  entries: readonly CalendarEntryRecord[];
  viewingDate: Date;
  hourHeight?: number;
  startHour?: number;
  endHour?: number;
  onSelect(entry: CalendarEntryRecord): void;
}

export const CalendarDayView = createComponent('CalendarDayView', ({
  className,
  entries,
  viewingDate,
  hourHeight = 60,
  startHour: rawStartHour = 0,
  endHour: rawEndHour = 24,
  onSelect,
}: Props) => {
  const { css, join } = useStyles();
  const calendarDayViewElementRef = useRef<HTMLDivElement | null>(null);

  const { startHour, endHour } = useMemo(() => {
    if (entries.length === 0) return { startHour: rawStartHour, endHour: rawEndHour };
    let earliestAppointmentHour = entries.map(entry => entry.startDate.getHours()).min();
    let lastAppointmentHour = entries.map(entry => (entry.endDate?.getHours() ?? 0) + ((entry.endDate?.getMinutes() ?? 0) > 0 ? 1 : 0)).max();
    if (lastAppointmentHour > 24) lastAppointmentHour = 24;
    if (earliestAppointmentHour > 0) earliestAppointmentHour -= 1;
    if (lastAppointmentHour < 24) lastAppointmentHour += 1;
    return {
      startHour: earliestAppointmentHour < rawStartHour ? earliestAppointmentHour : rawStartHour,
      endHour: lastAppointmentHour > rawEndHour ? lastAppointmentHour : rawEndHour,
    };
  }, [rawStartHour, rawEndHour, entries]);

  const scrollTo = useMemo(() => {
    if (calendarDayViewElementRef.current == null) return 0;
    const height = calendarDayViewElementRef.current.getBoundingClientRect().height;
    return Math.max(0, Math.round(calendarDayUtils.getOffset(viewingDate, hourHeight, startHour) - (height / 2)));
  }, [viewingDate, hourHeight, calendarDayViewElementRef.current]);

  return (
    <Flex tagName="calendar-day-view" ref={calendarDayViewElementRef} className={join(css.dayView, className)} maxHeight>
      <Scroller scrollTo={scrollTo}>
        <CalendarDayViewHours hourHeight={hourHeight} startHour={startHour} endHour={endHour} />
        <CalendarDayViewEntries entries={entries} date={viewingDate} hourHeight={hourHeight} startHour={startHour} endHour={endHour} onSelect={onSelect} />
      </Scroller>
    </Flex>
  );
});
