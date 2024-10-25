import { useMemo } from 'react';
import { createStyles } from '../../../theme';
import { createComponent } from '../../Component';
import { Flex } from '../../Flex';

const useStyles = createStyles(({ field: { value: { normal } } }) => ({
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
}));

interface Props {
  hourHeight: number;
  startHour: number;
  endHour: number;
}

export const CalendarDayViewHours = createComponent('CalendarDayViewHours', ({
  hourHeight,
  startHour,
  endHour,
}: Props) => {
  const { css, useInlineStyle } = useStyles();

  const style = useInlineStyle(() => ({
    minHeight: hourHeight,
    maxHeight: hourHeight,
  }), [hourHeight]);

  const renderedHours = useMemo(() => {
    return Array(endHour - startHour).fill(0).map((_, index) => {
      const hour = `${(index + startHour).toString().padStart(2, '0')}:00`;
      return (
        <Flex tagName="calendar-day-view-hour" key={hour} className={css.hour} style={style}>
          {hour}
        </Flex>
      );
    });
  }, [style, startHour, endHour]);

  return (
    <Flex tagName="calendar-day-view-hours" className={css.hours} isVertical>
      {renderedHours}
    </Flex>
  );
});