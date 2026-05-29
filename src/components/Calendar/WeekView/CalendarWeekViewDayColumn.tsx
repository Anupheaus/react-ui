import { createComponent } from '../../Component';
import { Flex } from '../../Flex';
import type { CalendarEntryRecord } from '../CalendarModels';
import { CalendarDayViewEntries } from '../DayView/CalendarDayViewEntries';
import { createStyles } from '../../../theme';
import { CalendarWeekViewHourGridLines } from './CalendarWeekViewHourGridLines';

interface Props {
  className?: string;
  date: Date;
  entries: readonly CalendarEntryRecord[];
  hourHeight: number;
  startHour: number;
  endHour: number;
  gridHeight: number;
  onSelect(entry: CalendarEntryRecord): void;
}

const useStyles = createStyles(() => ({
  dayColumn: {
    position: 'relative',
    flex: '1 1 0',
    minWidth: 0,
    boxSizing: 'border-box',
  },
  entriesLayer: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
  },
}));

export const CalendarWeekViewDayColumn = createComponent('CalendarWeekViewDayColumn', ({
  className,
  date,
  entries,
  hourHeight,
  startHour,
  endHour,
  gridHeight,
  onSelect,
}: Props) => {
  const { css, join, useInlineStyle } = useStyles();

  const style = useInlineStyle(() => ({
    minHeight: gridHeight,
    maxHeight: gridHeight,
  }), [gridHeight]);

  return (
    <Flex tagName="calendar-week-view-day-column" className={join(css.dayColumn, className)} style={style}>
      <CalendarWeekViewHourGridLines hourHeight={hourHeight} startHour={startHour} endHour={endHour} omitFirstLine />
      <Flex tagName="calendar-week-view-day-column-entries" className={css.entriesLayer}>
        <CalendarDayViewEntries
          date={date}
          entries={entries}
          hourHeight={hourHeight}
          startHour={startHour}
          endHour={endHour}
          fillColumn
          onSelect={onSelect}
        />
      </Flex>
    </Flex>
  );
});
