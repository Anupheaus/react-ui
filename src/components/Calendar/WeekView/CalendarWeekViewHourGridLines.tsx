import { useMemo } from 'react';
import { createComponent } from '../../Component';
import { Tag } from '../../Tag';
import { createStyles } from '../../../theme';

interface Props {
  hourHeight: number;
  startHour: number;
  endHour: number;
  omitFirstLine?: boolean;
}

const useStyles = createStyles(() => ({
  gridLines: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    pointerEvents: 'none',
    zIndex: 0,
  },
  hourLine: {
    borderColor: '#eee',
    borderWidth: 0,
    borderTopWidth: 1,
    borderStyle: 'solid',
    flexShrink: 0,
    boxSizing: 'border-box',
  },
  firstHourLine: {
    borderTopWidth: 0,
  },
}));

export const CalendarWeekViewHourGridLines = createComponent('CalendarWeekViewHourGridLines', ({
  hourHeight,
  startHour,
  endHour,
  omitFirstLine = false,
}: Props) => {
  const { css, join, useInlineStyle } = useStyles();

  const hourLineStyle = useInlineStyle(() => ({
    minHeight: hourHeight,
    maxHeight: hourHeight,
  }), [hourHeight]);

  const renderedHourLines = useMemo(() => {
    return Array(endHour - startHour).fill(0).map((_, hourIndex) => (
      <Tag
        name="calendar-week-view-hour-grid-line"
        key={`${startHour + hourIndex}`}
        className={join(css.hourLine, omitFirstLine && hourIndex === 0 && css.firstHourLine)}
        style={hourLineStyle}
      />
    ));
  }, [css.firstHourLine, css.hourLine, endHour, hourLineStyle, join, omitFirstLine, startHour]);

  return (
    <Tag name="calendar-week-view-hour-grid-lines" className={css.gridLines}>
      {renderedHourLines}
    </Tag>
  );
});
