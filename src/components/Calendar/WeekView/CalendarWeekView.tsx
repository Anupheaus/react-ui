import { useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { DateTime } from 'luxon';
import { createComponent } from '../../Component';
import { Flex } from '../../Flex';
import { Label } from '../../Label';
import { Scroller } from '../../Scroller';
import { Tag } from '../../Tag';
import { createStyles } from '../../../theme';
import { getCalendarGridLineColor } from '../CalendarGridLineColor';
import type { CalendarEntryRecord, CalendarWeekDay } from '../CalendarModels';
import { CalendarDayViewHours } from '../DayView/CalendarDayViewHours';
import { calendarDayUtils } from '../DayView/CalendarDayUtils';
import { CalendarWeekViewDayColumn } from './CalendarWeekViewDayColumn';
import { CalendarWeekViewDayHeader } from './CalendarWeekViewDayHeader';
import { CalendarWeekViewUtils } from './CalendarWeekViewUtils';
import { useCalendarWeekViewColumnLayout } from './useCalendarWeekViewColumnLayout';

const HOURS_COLUMN_WIDTH = 40;

const useStyles = createStyles(({ fields: { content: { normal } } }) => {
  const gridLineColor = getCalendarGridLineColor(normal);

  return {
  weekViewShell: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    width: '100%',
    maxHeight: '100%',
  },
  weekGrid: {
    display: 'flex',
    flexDirection: 'column',
    flex: 'auto',
    minWidth: 400,
    minHeight: 0,
    overflow: 'hidden',
    border: `solid 1px ${gridLineColor}`,
    borderRadius: 8,
  },
  gridShell: {
    flex: 'auto',
    minHeight: 0,
  },
  headerRow: {
    flex: 'none',
    borderBottom: `solid 1px ${gridLineColor}`,
  },
  headerCorner: {
    minWidth: HOURS_COLUMN_WIDTH,
    maxWidth: HOURS_COLUMN_WIDTH,
    flexShrink: 0,
    boxSizing: 'border-box',
    outline: `solid 1px ${gridLineColor}`,
  },
  headerDayColumns: {
    flex: '1 1 auto',
    minWidth: 0,
  },
  headerDayColumnsMeasured: {
    flex: 'none',
    minWidth: 0,
  },
  gridCellBorder: {
    outline: `solid 1px ${gridLineColor}`,
  },
  scrollBody: {
    position: 'relative',
    flex: 'auto',
    minHeight: 0,
  },
  hoursColumn: {
    minWidth: HOURS_COLUMN_WIDTH,
    maxWidth: HOURS_COLUMN_WIDTH,
    flexShrink: 0,
    outline: `solid 1px ${gridLineColor}`,
  },
  dayColumns: {
    flex: '1 1 auto',
    minWidth: 0,
  },
};
});

interface Props {
  className?: string;
  label?: ReactNode;
  viewingDate: Date;
  entries: readonly CalendarEntryRecord[];
  weekDays?: readonly CalendarWeekDay[];
  hourHeight?: number;
  startHour?: number;
  endHour?: number;
  onSelect(entry: CalendarEntryRecord): void;
}

function entryIntersectsDay(entry: CalendarEntryRecord, date: Date): boolean {
  const luxonDate = DateTime.fromJSDate(date);
  const startOfDay = luxonDate.startOf('day').toJSDate();
  const endOfDay = luxonDate.endOf('day').toJSDate();
  return entry.startDate <= endOfDay && (entry.endDate ?? entry.startDate) >= startOfDay;
}

export const CalendarWeekView = createComponent('CalendarWeekView', ({
  className,
  label,
  viewingDate,
  entries,
  weekDays,
  hourHeight = 60,
  startHour: rawStartHour,
  endHour: rawEndHour,
  onSelect,
}: Props) => {
  const { css, join, useInlineStyle } = useStyles();
  const calendarWeekViewElementRef = useRef<HTMLDivElement | null>(null);

  const weekDayDates = useMemo(
    () => CalendarWeekViewUtils.getWeekDayDates(viewingDate, weekDays),
    [viewingDate, weekDays],
  );

  const weekEntries = useMemo(() => entries.filter(entry =>
    weekDayDates.some(({ date }) => entryIntersectsDay(entry, date)),
  ), [entries, weekDayDates]);

  const { startHour, endHour } = useMemo(
    () => calendarDayUtils.getEffectiveHourRange(weekEntries, rawStartHour, rawEndHour),
    [weekEntries, rawStartHour, rawEndHour],
  );

  const gridHeight = (endHour - startHour) * hourHeight;

  const {
    scrollerContainerRef,
    dayColumnsElementRef,
    dayColumnsAreaWidth,
    verticalScrollbarWidth,
  } = useCalendarWeekViewColumnLayout(weekDayDates.length, gridHeight);

  const headerDayColumnsStyle = useInlineStyle(() => {
    if (dayColumnsAreaWidth == null) return {};
    return { width: dayColumnsAreaWidth };
  }, [dayColumnsAreaWidth]);

  const headerRowStyle = useInlineStyle(() => {
    if (dayColumnsAreaWidth != null) return {};
    return { paddingRight: verticalScrollbarWidth };
  }, [dayColumnsAreaWidth, verticalScrollbarWidth]);

  const scrollTo = useMemo(() => {
    if (calendarWeekViewElementRef.current == null) return 0;
    const height = calendarWeekViewElementRef.current.getBoundingClientRect().height;
    return Math.max(0, Math.round(calendarDayUtils.getOffset(viewingDate, hourHeight, startHour) - (height / 2)));
  }, [viewingDate, hourHeight, startHour]);

  const renderedDayHeaders = useMemo(() => weekDayDates.map(({ day, date }) => (
    <CalendarWeekViewDayHeader key={day} className={css.gridCellBorder} day={day} date={date} />
  )), [weekDayDates, css.gridCellBorder]);

  const renderedDayColumns = useMemo(() => weekDayDates.map(({ day, date }) => (
    <CalendarWeekViewDayColumn
      key={day}
      className={css.gridCellBorder}
      date={date}
      entries={entries}
      hourHeight={hourHeight}
      startHour={startHour}
      endHour={endHour}
      gridHeight={gridHeight}
      onSelect={onSelect}
    />
  )), [weekDayDates, entries, hourHeight, startHour, endHour, gridHeight, onSelect, css.gridCellBorder]);

  const weekGrid = (
    <Flex tagName="calendar-week-view" className={join(css.weekGrid, className)} maxHeight disableOverflow isVertical>
      <Flex tagName="calendar-week-view-grid-shell" className={css.gridShell} maxHeight disableOverflow isVertical>
        <Flex
          tagName="calendar-week-view-header-row"
          className={css.headerRow}
          style={headerRowStyle}
        >
          <Tag name="calendar-week-view-header-corner" className={css.headerCorner} />
          <Flex
            tagName="calendar-week-view-header-day-columns"
            className={join(dayColumnsAreaWidth == null ? css.headerDayColumns : css.headerDayColumnsMeasured)}
            style={headerDayColumnsStyle}
            gap={1}
          >
            {renderedDayHeaders}
          </Flex>
        </Flex>
        <Flex tagName="calendar-week-view-scrolling-area" ref={calendarWeekViewElementRef} maxHeight disableOverflow className={css.scrollBody}>
          <Scroller ref={scrollerContainerRef} scrollTo={scrollTo}>
            <Flex tagName="calendar-week-view-scroll-content">
              <Flex tagName="calendar-week-view-hours-column" className={css.hoursColumn}>
                <CalendarDayViewHours hourHeight={hourHeight} startHour={startHour} endHour={endHour} omitFirstLine />
              </Flex>
              <Flex tagName="calendar-week-view-day-columns" ref={dayColumnsElementRef} wide className={css.dayColumns} gap={1}>
                {renderedDayColumns}
              </Flex>
            </Flex>
          </Scroller>
        </Flex>
      </Flex>
    </Flex>
  );

  if (label == null) {
    return weekGrid;
  }

  return (
    <Tag name="calendar-week-view-root" className={css.weekViewShell}>
      <Label>{label}</Label>
      {weekGrid}
    </Tag>
  );
});
