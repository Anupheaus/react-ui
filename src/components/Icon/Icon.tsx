import { Ref, useMemo } from 'react';
import { createComponent } from '../Component';
import { createStyles2, type IconType } from '../../theme';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import { IconDefinitions, LocalIconDefinitions } from './Icons';
import { is } from '@anupheaus/common';
import { useUIState } from '../../providers';

export { IconType };

interface Props<T extends IconDefinitions = typeof LocalIconDefinitions> {
  name: keyof T;
  className?: string;
  color?: string;
  size?: 'normal' | 'small' | 'large' | number;
  ref?: Ref<HTMLDivElement>;
  onClick?(): void;
}

const useStyles = createStyles2(({ animation, icon: { default: defaultIcon, active: activeIcon }, activePseudoClasses }) => ({
  icon: {
    ...defaultIcon,
    ...animation,
    display: 'flex',
    minWidth: 16,
    minHeight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 0,
    transitionProperty: 'opacity',

    [activePseudoClasses]: {
      '&.is-clickable:not(.is-read-only)': {
        ...activeIcon,
      },
    },

    '&.is-clickable:not(.is-read-only)': {
      cursor: 'pointer',
    },
  },
}));

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
  const { isReadOnly } = useUIState();

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
    <Tag name="icon" ref={ref} className={join(css.icon, isReadOnly && 'is-read-only', onClick != null && 'is-clickable', className)} data-icon-type={name} onClick={onClick}>
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
