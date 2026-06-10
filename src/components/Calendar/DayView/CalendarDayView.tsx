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

  // Default the header to the viewing date when no explicit label is supplied.
  const resolvedLabel = useMemo(
    () => label ?? viewingDate.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }),
    [label, viewingDate],
  );

  const { startHour, endHour } = useMemo(
    () => calendarDayUtils.getEffectiveHourRange(entries, rawStartHour, rawEndHour),
    [rawStartHour, rawEndHour, entries],
  );

  const scrollTo = useMemo(() => {
    if (calendarDayViewElementRef.current == null) return 0;
    const height = calendarDayViewElementRef.current.getBoundingClientRect().height;
    return Math.max(0, Math.round(calendarDayUtils.getOffset(viewingDate, hourHeight, startHour) - (height / 2)));
  }, [viewingDate, hourHeight, calendarDayViewElementRef.current]);

  return (
    <Flex tagName="calendar-day-view" className={join(css.dayView, className)} gap={4} maxHeight isVertical>
      <Label>{resolvedLabel}</Label>
      <Flex tagName="calendar-day-view-scrolling-area" ref={calendarDayViewElementRef} maxHeight disableOverflow>
        <Scroller scrollTo={scrollTo}>
          <CalendarDayViewHours hourHeight={hourHeight} startHour={startHour} endHour={endHour} />
          <CalendarDayViewEntries entries={entries} date={viewingDate} hourHeight={hourHeight} startHour={startHour} endHour={endHour} onSelect={onSelect} />
        </Scroller>
      </Flex>
    </Flex>
  );
});
