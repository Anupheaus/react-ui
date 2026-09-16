import { useEffect, useState } from 'react';
import { createComponent } from '../../Component';
import { Flex } from '../../Flex';
import { createStyles } from '../../../theme';
import { calendarDayUtils } from './CalendarDayUtils';

const useStyles = createStyles(({ calendar: { currentTimeLineColor } }) => ({
  nowLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 0,
    borderTop: `2px solid ${currentTimeLineColor}`,
    zIndex: 2,
    pointerEvents: 'none',
  },
  nowDot: {
    position: 'absolute',
    left: -1,
    top: -5,
    width: 9,
    height: 9,
    borderRadius: '50%',
    backgroundColor: currentTimeLineColor,
  },
}));

interface Props {
  /** The day this column/view represents; the line only shows when it is today. */
  date: Date;
  startHour: number;
  endHour: number;
  hourHeight: number;
}

/** Re-renders once a minute so the line tracks the current time. */
function useNow(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/**
 * A horizontal red line with a left-edge dot marking the current time on the hour grid. Renders
 * nothing unless `date` is today and the current time falls within the visible hour range. Absolutely
 * positioned, so it must sit inside the same positioned container as the day's entries overlay.
 */
export const CalendarNowLine = createComponent('CalendarNowLine', ({ date, startHour, endHour, hourHeight }: Props) => {
  const { css, useInlineStyle } = useStyles();
  const now = useNow();
  const offset = calendarDayUtils.getNowLineOffset(now, date, hourHeight, startHour, endHour);
  const style = useInlineStyle(() => ({ top: offset ?? 0 }), [offset]);

  if (offset == null) return null;

  return (
    <Flex tagName="calendar-now-line" className={css.nowLine} style={style}>
      <Flex tagName="calendar-now-line-dot" className={css.nowDot} />
    </Flex>
  );
});
