import { useMemo } from 'react';
import { createComponent } from '../../Component';
import { Flex } from '../../Flex';
import type { CalendarEntryRecord } from '../CalendarModels';
import { createStyles } from '../../../theme';
import { DateTime } from 'luxon';
import { calendarDayUtils } from './CalendarDayUtils';
import { layoutDayViewEntries, clipEntryToDay } from './CalendarDayViewLayout';
import { Typography } from '../../Typography';
import { Icon } from '../../Icon';

const useStyles = createStyles(({ surface: { shadows } }) => ({
  entries: {
    position: 'absolute',
    inset: 0,
    right: 30,
  },
  entriesFillColumn: {
    position: 'absolute',
    inset: 0,
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
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 4,
  },
  entryTitleWrapper: {
    flex: '1 1 auto',
    minWidth: 0,
    overflow: 'hidden',
  },
  entryTitle: {
    fontSize: 11,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

interface Props {
  date: Date;
  startHour: number;
  endHour: number;
  entries: readonly CalendarEntryRecord[];
  hourHeight: number;
  fillColumn?: boolean;
  onSelect(entry: CalendarEntryRecord): void;
}

export const CalendarDayViewEntries = createComponent('CalendarDayViewEntries', ({
  date,
  startHour,
  entries,
  hourHeight,
  fillColumn = false,
  onSelect,
}: Props) => {
  const { css, theme, join } = useStyles();

  const renderedEntries = useMemo(() => {
    const luxonDate = DateTime.fromJSDate(date);
    const startOfDay = luxonDate.startOf('day').toJSDate();
    const endOfDay = luxonDate.endOf('day').toJSDate();
    const dayEntries = entries
      .map(entry => clipEntryToDay(entry, startOfDay, endOfDay))
      .filter((entry): entry is CalendarEntryRecord => entry != null);
    const laidOutSegments = layoutDayViewEntries(dayEntries);

    return laidOutSegments.map((laidOutSegment, index) => {
      const top = calendarDayUtils.getOffset(laidOutSegment.segmentStart, hourHeight, startHour);
      const height = calendarDayUtils.getOffset(laidOutSegment.segmentEnd, hourHeight, startHour) - top;
      const left = `${laidOutSegment.leftPercent}%`;
      const width = `${laidOutSegment.widthPercent}%`;
      return (
        <Flex
          tagName="calendar-day-view-entry"
          key={`${laidOutSegment.entry.id}-${laidOutSegment.segmentStart.getTime()}`}
          className={css.entry}
          style={{ top, height, left, width }}
        >
          <Flex
            tagName="calendar-day-view-entry-content"
            className={css.entryContent}
            style={{ backgroundColor: laidOutSegment.entry.color ?? theme.paletteColours[index % theme.paletteColours.length] }}
            testId={`calendar-day-view-entry-${index}`}
            onClickCapture={event => {
              event.stopPropagation();
              onSelect(laidOutSegment.entry);
            }}
          >
            {laidOutSegment.entry.icon != null && (
              <Icon name={laidOutSegment.entry.icon} size="small" />
            )}
            <Flex tagName="calendar-day-view-entry-title-wrapper" className={css.entryTitleWrapper}>
              <Typography tagName="calendar-day-view-entry-title" className={css.entryTitle} disableWrap disableGrow>
                {laidOutSegment.entry.title}
              </Typography>
            </Flex>
          </Flex>
        </Flex>
      );
    });
  }, [entries, date, startHour, hourHeight, onSelect, css.entry, css.entryContent, css.entryTitle, css.entryTitleWrapper, theme.paletteColours]);

  return (
    <Flex tagName="calendar-day-view-entries" className={join(fillColumn ? css.entriesFillColumn : css.entries)}>
      {renderedEntries}
    </Flex>
  );
});
