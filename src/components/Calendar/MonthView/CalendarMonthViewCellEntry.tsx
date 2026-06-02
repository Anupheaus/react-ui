import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import { createComponent } from '../../Component';
import { Flex } from '../../Flex';
import { Icon } from '../../Icon';
import { createStyles } from '../../../theme';
import { Typography } from '../../Typography';
import { useCalendarEntrySelection } from '../CalendarEntrySelectionProvider';
import type { CalendarEntryRecord } from '../CalendarModels';
import { CalendarUtils } from '../CalendarUtils';
import { useCalendarEntryHighlighting } from '../CalenderEntryHighlightProvider';
import { CalendarMonthViewUtils } from './CalendarMonthViewUtils';

interface Props {
  entry: CalendarEntryRecord;
  viewingDate: Date;
  cellDate: Date;
  renderedOnRow: number;
  dayIndex: number;
}

const MONTH_ENTRY_HEIGHT = 19;

const useStyles = createStyles(({ surface: { shadows } }, { applyTransition }) => ({
  cellEntry: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
    height: MONTH_ENTRY_HEIGHT,
    marginTop: 1,
    cursor: 'pointer',
    ...applyTransition('box-shadow, opacity'),
  },
  entryContent: {
    ...shadows.light,
    position: 'absolute',
    top: 0,
    left: 2,
    right: 2,
    bottom: 0,
    border: '1px solid rgba(0 0 0 / 20%)',
    padding: '1px 2px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    borderRadius: 0,
  },
  roundedStart: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  roundedEnd: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  isHighlighted: {
    boxShadow: '0 1px 4px 2px rgba(0 0 0 / 10%)',
  },
  isDehighlighted: {
    opacity: 0.3,
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

export const CalendarMonthViewCellEntry = createComponent('CalendarMonthViewCellEntry', ({
  entry,
  viewingDate,
  cellDate,
  renderedOnRow,
  dayIndex,
}: Props) => {
  const { css, join, theme } = useStyles();
  const { isSelected } = useCalendarEntrySelection(entry.id);
  const { highlight, dehighlight, isHighlighted, isDehighlighted } = useCalendarEntryHighlighting(entry.id);
  const daysToEndFromCurrentCell = entry.endDate == null ? 0 : CalendarUtils.daysInBetween(cellDate, entry.endDate);
  const widthInDays = dayIndex + daysToEndFromCurrentCell > 7 ? 7 - dayIndex : daysToEndFromCurrentCell + 1;
  const hasStart = CalendarUtils.daysInBetween(entry.startDate, cellDate) <= dayIndex;
  const hasEnd = daysToEndFromCurrentCell <= (7 - dayIndex);
  const spanWidth = `calc(${widthInDays} * 100% + ${widthInDays - 1}px)`;
  const showIconAndTitle = CalendarMonthViewUtils.shouldShowEntryLabel(entry, cellDate, dayIndex, viewingDate);

  const cellEntryStyle = useMemo<CSSProperties>(() => ({
    top: renderedOnRow * 20,
    minWidth: spanWidth,
    width: spanWidth,
  }), [renderedOnRow, spanWidth]);

  const entryContentStyle = useMemo<CSSProperties>(() => ({
    backgroundColor: entry.color ?? theme.paletteColours[renderedOnRow % theme.paletteColours.length],
  }), [entry.color, renderedOnRow, theme.paletteColours]);

  return (
    <Flex
      tagName="calendar-month-cell-entry"
      className={join(css.cellEntry, isDehighlighted && css.isDehighlighted)}
      style={cellEntryStyle}
      onMouseEnter={highlight}
      onMouseLeave={dehighlight}
      tabIndex={0}
    >
      <Flex
        tagName="calendar-month-cell-entry-content"
        className={join(
          css.entryContent,
          hasStart && css.roundedStart,
          hasEnd && css.roundedEnd,
          (isSelected || isHighlighted) && css.isHighlighted,
        )}
        style={entryContentStyle}
      >
        {showIconAndTitle && entry.icon != null && <Icon name={entry.icon} size="small" />}
        {showIconAndTitle && (
          <Flex tagName="calendar-month-cell-entry-title-wrapper" className={css.entryTitleWrapper}>
            <Typography tagName="calendar-month-cell-entry-title" className={css.entryTitle} disableWrap disableGrow>
              {entry.title}
            </Typography>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
});
