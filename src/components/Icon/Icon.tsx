import { createStyles } from '../../theme/createStyles';
import { Ref, useMemo } from 'react';
import { createComponent } from '../Component';
import type { IconType } from '../../theme';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import { IconTheme } from './IconTheme';
import { IconDefinitions, IconName } from './Icons';
import { is } from '@anupheaus/common';

export { IconType };

interface Props {
  name: IconName;
  className?: string;
  size?: 'normal' | 'small' | 'large' | number;
  ref?: Ref<HTMLDivElement>;
}
const useStyles = createStyles(({ useTheme }) => {
  const { opacity } = useTheme(IconTheme);
  return {
    styles: {
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
    },
  };
});

export const Icon = createComponent('Icon', ({
  name,
  className,
  size = 'normal',
  ref,
}: Props) => {
  const { css, join } = useStyles();
  const sizeAmount = (() => {
    if (typeof (size) === 'number') return size;
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20;
    }
  })();

  const icon = useMemo(() => {
    let iconFunc = IconDefinitions[name];
    if (!is.function(iconFunc)) iconFunc = IconDefinitions['no-image'];
    return iconFunc({ size: sizeAmount });
  }, [name, sizeAmount]);

  return (
    <Tag name="Icon" ref={ref} className={join(css.icon, className)} data-icon-type={name}>
      <Skeleton variant="circle">{icon}</Skeleton>
    </Tag>
  );
});
