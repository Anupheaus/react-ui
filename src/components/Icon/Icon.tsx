import { createStyles } from '../../theme/createStyles';
import { Ref, useMemo } from 'react';
import { createComponent } from '../Component';
import type { IconType } from '../../theme';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import { IconTheme } from './IconTheme';
import { IconDefinitions, LocalIconDefinitions } from './Icons';
import { is } from '@anupheaus/common';

export { IconType };

interface Props<T extends IconDefinitions = IconDefinitions> {
  name: keyof T;
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

const IconComponent = createComponent('Icon', function <T extends IconDefinitions>({
  name,
  className,
  size = 'normal',
  ref,
}: Props<T>) {
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
    let iconFunc = LocalIconDefinitions[name as keyof typeof LocalIconDefinitions];
    if (!is.function(iconFunc)) iconFunc = LocalIconDefinitions['no-image'];
    return iconFunc({ size: sizeAmount });
  }, [name, sizeAmount]);

  return (
    <Tag name="Icon" ref={ref} className={join(css.icon, className)} data-icon-type={name}>
      <Skeleton variant="circle">{icon}</Skeleton>
    </Tag>
  );
});

const Icon = IconComponent as typeof IconComponent & { augmentWith<T extends IconDefinitions>(icons: T): typeof IconComponent & T; };

Icon.augmentWith = () => {
  // do nothing
};

export { Icon };


const NewIcon = Icon.augmentWith({
  blah: () => <></>,
});

const a = <NewIcon name="blah" />;
