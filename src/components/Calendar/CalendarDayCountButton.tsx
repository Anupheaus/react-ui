import { useContext } from 'react';
import { createComponent } from '../Component';
import { Button } from '../Button';
import { Tooltip } from '../Tooltip';
import { createStyles } from '../../theme';
import { useBound } from '../../hooks';
import { CalendarDayCountContext } from './CalendarDayCountContext';

const useStyles = createStyles(({ error }) => ({
  // `&&` outranks the button variant's own colours, whichever stylesheet was inserted last.
  count: {
    '&&': {
      minWidth: 22,
      height: 22,
      minHeight: 22,
      padding: '0 6px',
      borderRadius: 11,
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1,
    },
    // The button resets its outline, so a keyboard user would otherwise not see where they are.
    '&&:focus-visible': {
      outline: '2px solid currentColor',
      outlineOffset: 2,
    },
  },
  // The theme's error colour, with white on it: readable, and the tooltip carries the same fact in words.
  alert: {
    '&&': {
      backgroundColor: error.color,
      color: '#fff',
    },
  },
}));

interface Props {
  date: Date;
}

/**
 * The small count a day shows in its header (`Calendar`'s `getDayCount`): just the number, nothing at all when the day
 * has none. Where it sits is each view's business; what it counts is the consumer's. Pressing it calls `onDayCountSelect`
 * with the day, hovering or focusing it shows the tooltip, and the tooltip is also its accessible name.
 */
export const CalendarDayCountButton = createComponent('CalendarDayCountButton', ({ date }: Props) => {
  const { css, join } = useStyles();
  const { getDayCount, onDayCountSelect } = useContext(CalendarDayCountContext);
  const dayCount = getDayCount?.(date);

  const select = useBound(() => onDayCountSelect?.(date));

  if (dayCount == null || dayCount.count <= 0) return null;
  const { count, tone = 'normal', tooltip = `${count} on this day` } = dayCount;

  return (
    <Tooltip content={tooltip}>
      <Button size="small" className={join(css.count, tone === 'alert' && css.alert)} aria-label={tooltip} onSelect={select}>{count}</Button>
    </Tooltip>
  );
});
