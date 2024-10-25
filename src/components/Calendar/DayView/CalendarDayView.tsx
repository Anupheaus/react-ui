import { createComponent } from '../../Component';
import { Flex } from '../../Flex';
import { Scroller } from '../../Scroller';
import type { CalendarEntryRecord } from '../CalendarModels';
import { CalendarDayViewHours } from './CalendarDayViewHours';
import { createStyles } from '../../../theme';
import { CalendarDayViewEntries } from './CalendarDayViewEntries';
import { calendarDayUtils } from './CalendarDayUtils';
import type { ReactNode } from 'react';
import { useMemo, useRef } from 'react';
import { Label } from '../../Label';

const useStyles = createStyles(({ surface: { asAContainer: { normal } } }) => ({
  dayView: {
    ...normal,
    flex: 'auto',
  },
}));

interface Props {
  className?: string;
  label?: ReactNode;
  entries: readonly CalendarEntryRecord[];
  viewingDate: Date;
  hourHeight?: number;
  startHour?: number;
  endHour?: number;
  onSelect(entry: CalendarEntryRecord): void;
}

export const CalendarDayView = createComponent('CalendarDayView', ({
  className,
  label,
  entries,
  viewingDate,
  hourHeight = 60,
  startHour: rawStartHour,
  endHour: rawEndHour,
  onSelect,
}: Props) => {
  const { css, join } = useStyles();
  const calendarDayViewElementRef = useRef<HTMLDivElement | null>(null);

  const { startHour, endHour } = useMemo(() => {
    const providedStartHour = rawStartHour == null ? 0 : Math.between(rawStartHour, 0, 23);
    const providedEndHour = rawEndHour == null ? 24 : Math.between(rawEndHour, 1, 24);

    if (entries.length === 0) return { startHour: providedStartHour, endHour: providedEndHour };
    const earliestAppointmentHour = entries.map(entry => entry.startDate.getHours()).min();
    let lastAppointmentHour = entries.map(entry => (entry.endDate?.getHours() ?? 0) + ((entry.endDate?.getMinutes() ?? 0) > 0 ? 1 : 0)).max();
    if (lastAppointmentHour > 24) lastAppointmentHour = 24;
    // if (earliestAppointmentHour > 0) earliestAppointmentHour -= 1;
    // if (lastAppointmentHour < 24) lastAppointmentHour += 1;
    return {
      startHour: (rawStartHour == null || earliestAppointmentHour < providedStartHour) ? earliestAppointmentHour : providedStartHour,
      endHour: (rawEndHour == null || lastAppointmentHour > providedEndHour) ? lastAppointmentHour : providedEndHour,
    };
  }, [rawStartHour, rawEndHour, entries]);

  const scrollTo = useMemo(() => {
    if (calendarDayViewElementRef.current == null) return 0;
    const height = calendarDayViewElementRef.current.getBoundingClientRect().height;
    return Math.max(0, Math.round(calendarDayUtils.getOffset(viewingDate, hourHeight, startHour) - (height / 2)));
  }, [viewingDate, hourHeight, calendarDayViewElementRef.current]);

  return (
    <Flex tagName="calendar-day-view" className={join(css.dayView, className)} gap={4} maxHeight isVertical>
      <Label>{label}</Label>
      <Flex tagName="calendar-day-view-scrolling-area" ref={calendarDayViewElementRef} maxHeight disableOverflow>
        <Scroller scrollTo={scrollTo}>
          <CalendarDayViewHours hourHeight={hourHeight} startHour={startHour} endHour={endHour} />
          <CalendarDayViewEntries entries={entries} date={viewingDate} hourHeight={hourHeight} startHour={startHour} endHour={endHour} onSelect={onSelect} />
        </Scroller>
      </Flex>
    </Flex>
  );
});
