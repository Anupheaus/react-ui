import { ReactNode } from 'react';
import { pureFC } from '../../anuxComponents';
import { ErrorIcon } from '../../errors';
import { IconType } from '../../theme';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import { IconTheme } from './IconTheme';

export { IconType };

interface Props {
  className?: string;
  size?: 'normal' | 'small' | 'large' | number;
  tooltip?: ReactNode;
  children: IconType | undefined;
}

export const Icon = pureFC<Props>()('Icon', IconTheme, ({ opacity }) => ({
  icon: {
    display: 'flex',
    opacity,
    minWidth: 16,
    minHeight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
}), ({
  className,
  size = 'normal',
  theme: { css, join },
  children,
}, ref) => {
  const renderIcon = children as unknown as IconType;

  const sizeAmount = (() => {
    if (typeof (size) === 'number') return size;
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20;
    }
  })();

  return (
    <Tag name="Icon" ref={ref} className={join(css.icon, className)} data-icon-type={renderIcon.name}>
      <Skeleton variant="circle">{renderIcon({ size: sizeAmount })}</Skeleton>
    </Tag>
  );
}, {
  onError: (error, { size }) => <ErrorIcon size={size} error={error} />,
});
