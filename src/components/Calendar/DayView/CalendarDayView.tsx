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
  onSelect(entry: CalendarEntryRecord): void;
}

export const CalendarDayView = createComponent('CalendarDayView', ({
  className,
  entries,
  viewingDate,
  hourHeight = 60,
  onSelect,
}: Props) => {
  const { css, join } = useStyles();
  const calendarDayViewElementRef = useRef<HTMLDivElement | null>(null);

  const scrollTo = useMemo(() => {
    if (calendarDayViewElementRef.current == null) return 0;
    const height = calendarDayViewElementRef.current.getBoundingClientRect().height;
    return Math.max(0, Math.round(calendarDayUtils.getOffset(viewingDate, hourHeight) - (height / 2)));
  }, [viewingDate, hourHeight, calendarDayViewElementRef.current]);

  return (
    <Flex tagName="calendar-day-view" ref={calendarDayViewElementRef} className={join(css.dayView, className)} maxHeight>
      <Scroller scrollTo={scrollTo}>
        <CalendarDayViewHours hourHeight={hourHeight} />
        <CalendarDayViewEntries entries={entries} date={viewingDate} hourHeight={hourHeight} onSelect={onSelect} />
      </Scroller>
    </Flex>
  );
});
