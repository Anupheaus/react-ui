import { useLayoutEffect, useState } from 'react';
import { createComponent } from '../Component';
import { DateTime } from 'luxon';
import { Flex } from '../Flex';

const aSecond = 1000;
const aMinute = 60 * aSecond;

interface Props {
  className?: string;
  to: DateTime;
  showSeconds?: boolean;
  showDays?: boolean;
  asReadable?: boolean;
}

export const Countdown = createComponent('Countdown', ({
  className,
  to,
  showSeconds = false,
  showDays = false,
  asReadable = false,
}: Props) => {
  const [content, setContent] = useState<string>('');

  useLayoutEffect(() => {
    const updateContent = () => {
      const now = DateTime.local();
      const diff = to.diff(now);
      const duration = diff.shiftTo('days', 'hours', 'minutes', 'seconds');
      const format = `${showDays ? 'd: ' : ''}hh:mm${showSeconds ? ':ss' : ''}`;
      if (asReadable) {
        const days = showDays ? `${duration.days} days` : '';
        const hoursAsNumber = duration.hours + (showDays ? 0 : duration.days * 24);
        const hours = `${hoursAsNumber === 0 && !showDays ? '' : `${hoursAsNumber} hour${hoursAsNumber === 1 ? '' : 's'}`}`;
        const minutes = `${duration.minutes} minute${duration.minutes === 1 ? '' : 's'}`;
        const seconds = showSeconds ? `${duration.seconds} second${duration.seconds === 1 ? '' : 's'}` : '';
        setContent([days, hours, minutes, seconds].filter(v => v.trim().length > 0).join(', ').replace(/,([^,]*)$/, ' and$1'));
      } else {
        setContent(duration.toFormat(format));
      }
    };
    setInterval(updateContent, showSeconds ? aSecond : aMinute);
    updateContent();
  }, [to]);

  return (
    <Flex tagName="countdown" className={className}>
      {content}
    </Flex>
  );
});
