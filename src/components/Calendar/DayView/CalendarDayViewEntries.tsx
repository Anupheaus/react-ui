import { useMemo } from 'react';
import { createComponent } from '../../Component';
import { Flex } from '../../Flex';
import type { CalendarEntryRecord } from '../CalendarModels';
import { createStyles } from '../../../theme';
import { DateTime } from 'luxon';
import { calendarDayUtils } from './CalendarDayUtils';

const useStyles = createStyles(({ surface: { shadows } }) => ({
  entries: {
    position: 'absolute',
    inset: 0,
    right: 30,
  },
  entry: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  entryContent: {
    ...shadows.light,
    position: 'absolute',
    top: 0,
    left: 2,
    right: 2,
    bottom: 0,
    border: '1px solid rgba(0 0 0 / 20%)',
    borderRadius: 8,
    padding: '1px 2px',
    fontSize: 11,
    overflow: 'hidden',
  },
}));

interface ColumnEntry {
  entry: CalendarEntryRecord;
  column: number;
  isLastColumn: boolean;
}

function lineUpEntries(entries: readonly CalendarEntryRecord[]): [ColumnEntry[], number] {
  let lastEntry: ColumnEntry | undefined;
  let maxColumns = 0;
  const linedUpEntries = entries.map(entry => {
    const result = (() => {
      if (lastEntry != null) {
        if (lastEntry.entry.endDate == null || entry.startDate < lastEntry.entry.endDate) {
          lastEntry.isLastColumn = false;
          return { entry, column: lastEntry.column + 1, isLastColumn: true };
        } else {
          return { entry, column: 1, isLastColumn: true };
        }
      } else {
        return { entry, column: 1, isLastColumn: true };
      }
    })();
    lastEntry = result;
    maxColumns = Math.max(maxColumns, result.column);
    return result;
  });
  return [linedUpEntries, maxColumns];
}

interface Props {
  date: Date;
  startHour: number;
  endHour: number;
  entries: readonly CalendarEntryRecord[];
  hourHeight: number;
  onSelect(entry: CalendarEntryRecord): void;
}

export const CalendarDayViewEntries = createComponent('CalendarDayViewEntries', ({
  date,
  startHour,
  entries,
  hourHeight,
  onSelect,
}: Props) => {
  const { css, theme, useInlineStyle } = useStyles();

  const [renderedEntries, topOffset] = useMemo(() => {
    const luxonDate = DateTime.fromJSDate(date);
    const startOfDay = luxonDate.startOf('day').toJSDate();
    const endOfDay = luxonDate.endOf('day').toJSDate();
    let innerTopOffset = 0;
    const [linedUpEntries, maxColumns] = lineUpEntries(entries
      .filter(entry => entry.startDate <= endOfDay && (entry.endDate ?? entry.startDate) >= startOfDay)
      .orderBy(entry => entry.startDate.getTime()));
    const columnWidth = Math.round(100 / maxColumns);

    const innerRenderedEntities = linedUpEntries
      .map((linedUpEntry, index) => {
        const top = calendarDayUtils.getOffset(linedUpEntry.entry.endDate == null ? startOfDay : linedUpEntry.entry.startDate, hourHeight, startHour);
        const height = calendarDayUtils.getOffset(linedUpEntry.entry.endDate ?? endOfDay, hourHeight, startHour) - top;
        const left = `${(linedUpEntry.column - 1) * columnWidth}%`;
        const width = `${(linedUpEntry.isLastColumn ? maxColumns - (linedUpEntry.column - 1) : 1) * columnWidth}%`;
        return (
          <Flex
            tagName="calendar-day-view-entry"
            key={linedUpEntry.entry.id}
            className={css.entry}
            style={{ top, height, left, width }}
          >
            <Flex
              tagName="calendar-day-view-entry-content"
              className={css.entryContent}
              style={{ backgroundColor: linedUpEntry.entry.color ?? theme.dataPaletteColors[index % theme.dataPaletteColors.length] }}
              testId={`calendar-day-view-entry-${index}`}
              onClickCapture={event => {
                event.stopPropagation();
                onSelect(linedUpEntry.entry);
              }}
            >
              {linedUpEntry.entry.title}
            </Flex>
          </Flex>
        );
      });
    const firstEntry = entries[0]?.startDate;
    if (firstEntry != null && firstEntry < startOfDay) innerTopOffset = -((24 - firstEntry.getHours()) * hourHeight);
    return [innerRenderedEntities, innerTopOffset];
  }, [entries, date, startHour, onSelect]);

  const style = useInlineStyle(() => ({
    top: topOffset,
  }), [topOffset]);

  return (
    <Flex tagName="calendar-day-view-entries" className={css.entries} style={style}>
      {renderedEntries}
    </Flex>
  );
});
