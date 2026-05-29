import { useMemo } from 'react';
import { createStyles } from '../../../theme';
import { createComponent } from '../../Component';
import { Flex } from '../../Flex';

interface Props {
  hourHeight: number;
  startHour: number;
  endHour: number;
  omitFirstLine?: boolean;
}

const useStyles = createStyles(({ fields: { content: { normal } } }) => ({
  hours: {
    width: '100%',
  },
  hour: {
    borderColor: normal.borderColor ?? 'rgba(0 0 0 / 10%)',
    borderWidth: 0,
    borderTopWidth: 1,
    borderStyle: 'solid',
    fontSize: 10,
    padding: '0 2px',
    opacity: 0.8,
    textAlign: 'right',
    justifyContent: 'flex-end',
    width: '100%',
  },
  firstHour: {
    borderTopWidth: 0,
  },
}));
export const CalendarDayViewHours = createComponent('CalendarDayViewHours', ({
  hourHeight,
  startHour,
  endHour,
  omitFirstLine = false,
}: Props) => {
  const { css, join, useInlineStyle } = useStyles();

  const style = useInlineStyle(() => ({
    minHeight: hourHeight,
    maxHeight: hourHeight,
  }), [hourHeight]);

  const renderedHours = useMemo(() => {
    return Array(endHour - startHour).fill(0).map((_, hourIndex) => {
      const hour = `${(hourIndex + startHour).toString().padStart(2, '0')}:00`;
      return (
        <Flex tagName="calendar-day-view-hour" key={hour} className={join(css.hour, omitFirstLine && hourIndex === 0 && css.firstHour)} style={style}>
          {hour}
        </Flex>
      );
    });
  }, [css.firstHour, css.hour, endHour, join, omitFirstLine, startHour, style]);

  return (
    <Flex tagName="calendar-day-view-hours" className={css.hours} isVertical>
      {renderedHours}
    </Flex>
  );
});