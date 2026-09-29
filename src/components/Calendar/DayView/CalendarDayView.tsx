import { createComponent } from '../../Component';
import { Flex } from '../../Flex';
import { Scroller } from '../../Scroller';
import type { CalendarDayAdornmentRenderer, CalendarEntryRecord } from '../CalendarModels';
import { CalendarDayViewHours } from './CalendarDayViewHours';
import { createStyles } from '../../../theme';
import { CalendarDayViewEntries } from './CalendarDayViewEntries';
import { CalendarNowLine } from './CalendarNowLine';
import { calendarDayUtils } from './CalendarDayUtils';
import type { ReactNode } from 'react';
import { useMemo, useRef } from 'react';
import { Label } from '../../Label';
import { useLocale } from '../../../providers/LocaleProvider';

const useStyles = createStyles(({ surface: { asAContainer: { normal } } }) => ({
  dayView: {
    ...normal,
    flex: 'auto',
  },
  header: {
    alignItems: 'center',
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
  renderDayAdornment?: CalendarDayAdornmentRenderer;
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
  renderDayAdornment,
}: Props) => {
  const { css, join } = useStyles();
  const { formatDate } = useLocale();
  const calendarDayViewElementRef = useRef<HTMLDivElement | null>(null);

  // Default the header to the viewing date ("Monday 28 September" in en-GB), in the app's locale, not the machine's.
  const resolvedLabel = useMemo(
    () => label ?? formatDate(viewingDate, { format: 'cccc d MMMM' }),
    [label, viewingDate, formatDate],
  );

  const dayAdornment = useMemo(() => renderDayAdornment?.(viewingDate), [renderDayAdornment, viewingDate]);

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
      <Flex tagName="calendar-day-view-header" className={css.header} gap={8} disableGrow>
        <Label>{resolvedLabel}</Label>
        {dayAdornment}
      </Flex>
      <Flex tagName="calendar-day-view-scrolling-area" ref={calendarDayViewElementRef} maxHeight disableOverflow>
        <Scroller scrollTo={scrollTo}>
          <CalendarDayViewHours hourHeight={hourHeight} startHour={startHour} endHour={endHour} />
          <CalendarDayViewEntries entries={entries} date={viewingDate} hourHeight={hourHeight} startHour={startHour} endHour={endHour} onSelect={onSelect} />
          <CalendarNowLine date={viewingDate} startHour={startHour} endHour={endHour} hourHeight={hourHeight} />
        </Scroller>
      </Flex>
    </Flex>
  );
});
