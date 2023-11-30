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

interface Props<T extends IconDefinitions = typeof LocalIconDefinitions> {
  name: keyof T;
  className?: string;
  color?: string;
  size?: 'normal' | 'small' | 'large' | number;
  ref?: Ref<HTMLDivElement>;
  onClick?(): void;
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

let augmentedIconDefinitions = LocalIconDefinitions;

const IconComponent = createComponent('Icon', function ({
  name,
  className,
  color,
  size = 'normal',
  ref,
  onClick,
}: Props<typeof LocalIconDefinitions>) {
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
    let iconFunc = augmentedIconDefinitions[name as keyof typeof augmentedIconDefinitions];
    if (!is.function(iconFunc)) iconFunc = augmentedIconDefinitions['no-image'];
    return iconFunc({ size: sizeAmount, color });
  }, [name, color, sizeAmount]);

  return (
    <Tag name="icon" ref={ref} className={join(css.icon, className)} data-icon-type={name} onClick={onClick}>
      <Skeleton type="circle">{icon}</Skeleton>
    </Tag>
  );
});

class AugmentedIconComponent<T extends IconDefinitions> { public getAugmentedIconType(): (props: Props<T & typeof LocalIconDefinitions>) => JSX.Element { return null as any; } }
const Icon = IconComponent as typeof IconComponent & { augmentWith<T extends IconDefinitions>(icons: T): ReturnType<AugmentedIconComponent<T>['getAugmentedIconType']>; };

Icon.augmentWith = ((newIconDefinitions: IconDefinitions) => {
  augmentedIconDefinitions = {
    ...augmentedIconDefinitions,
    ...newIconDefinitions,
  };
  return Icon;
}) as typeof Icon.augmentWith;

export { Icon };

// const NewIcon = Icon.augmentWith({
//   blah: () => <></>,
// });

// const a = <NewIcon name="blah" />;
