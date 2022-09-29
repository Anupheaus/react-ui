import { CSSProperties, useMemo } from 'react';
import { pureFC } from '../../../anuxComponents';
import { colors } from '../../../theme';
import { Icon } from '../../Icon';
import { Tag } from '../../Tag';
import { useCalendarEntrySelection } from '../CalendarEntrySelectionProvider';
import { CalendarEntryRecord } from '../CalendarModels';
import { CalendarTheme } from '../CalendarTheme';
import { CalendarUtils } from '../CalendarUtils';
import { useCalendarEntryHighlighting } from '../CalenderEntryHighlightProvider';

interface Props {
  entry: CalendarEntryRecord;
  cellDate: Date;
  cellSize: number;
  renderedOnRow: number;
  dayIndex: number;
}

export const CalendarMonthViewCellEntry = pureFC<Props>()('CalendarMonthViewCellEntry', CalendarTheme, ({
  monthViewEventFontSize, monthViewEventFontWeight,
}) => ({
  cellEntry: {
    position: 'absolute',
    left: 0,
    display: 'flex',
    height: 19,
    marginTop: 1,
    zIndex: 1,
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 0,
    transitionProperty: 'box-shadow, opacity',
    transitionDuration: '400ms',
    transitionTimingFunction: 'ease-in-out',
    cursor: 'pointer',
    boxSizing: 'border-box',
    overflow: 'hidden',
    padding: '0 8px',
    gap: 8,
  },
  hasStart: {
    borderLeftWidth: 3,
  },
  hasEnd: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  isHighlighted: {
    boxShadow: '0 1px 4px 2px rgba(0 0 0 / 10%)',
  },
  isDehighlighted: {
    opacity: 0.3,
  },
  cellEntryTitle: {
    fontSize: monthViewEventFontSize,
    fontWeight: monthViewEventFontWeight,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    display: 'block',
  },
}), ({
  entry,
  cellDate,
  cellSize,
  renderedOnRow,
  dayIndex,
  theme: { css, join },
}) => {
  const { isSelected } = useCalendarEntrySelection(entry.id);
  const { highlight, dehighlight, isHighlighted, isDehighlighted } = useCalendarEntryHighlighting(entry.id);
  const daysToEndFromCurrentCell = entry.endDate == null ? 0 : CalendarUtils.daysInBetween(cellDate, entry.endDate);
  const widthInDays = dayIndex + daysToEndFromCurrentCell > 7 ? 7 - dayIndex : daysToEndFromCurrentCell + 1;
  const hasStart = CalendarUtils.daysInBetween(entry.startDate, cellDate) <= dayIndex;
  const hasEnd = daysToEndFromCurrentCell <= (7 - dayIndex);
  const width = (widthInDays * cellSize) + (widthInDays - 1);

  const style = useMemo<CSSProperties>(() => ({
    top: renderedOnRow * 20,
    backgroundColor: colors.lighten(entry.color ?? 'red', 15),
    borderLeftColor: entry.color ?? 'red',
    minWidth: width,
    width,
  }), [renderedOnRow, entry.color, width]);


  return (
    <Tag
      name="calendar-month-cell-entry"
      className={join(
        css.cellEntry,
        hasStart && css.hasStart,
        hasEnd && css.hasEnd,
        (isSelected || isHighlighted) && css.isHighlighted,
        isDehighlighted && css.isDehighlighted,
      )}
      style={style}
      onMouseEnter={highlight}
      onMouseLeave={dehighlight}
      tabIndex={0}
    >
      <Icon size={'small'}>{entry.icon}</Icon>
      <Tag name="calendar-month-cell-entry-title" className={css.cellEntryTitle}>
        {!hasStart && '...'}
        {entry.title}
      </Tag>
    </Tag>
  );
});
