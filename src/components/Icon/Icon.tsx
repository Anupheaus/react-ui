import type { Ref } from 'react';
import { useMemo } from 'react';
import { createComponent } from '../Component';
import { createStyles, type IconType } from '../../theme';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import type { IconDefinitions } from './Icons';
import { LocalIconDefinitions } from './Icons';
import { is } from '@anupheaus/common';

export { IconType };

interface Props<T extends IconDefinitions = typeof LocalIconDefinitions> {
  name: keyof T;
  className?: string;
  color?: string;
  size?: 'normal' | 'small' | 'large' | number;
  ref?: Ref<HTMLDivElement>;
  dropShadow?: boolean;
  onClick?(): void;
}

const useStyles = createStyles(({ icons: { normal, active, readOnly }, pseudoClasses }, tools) => ({
  icon: {
    display: 'flex',
    opacity: normal.opacity ?? 1,
    minWidth: 16,
    minHeight: 16,
    width: 'min-content',
    height: 'min-content',
    maxWidth: '100%',
    maxHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 0,
    ...tools.applyTransition('opacity'),

    [pseudoClasses.active]: {
      opacity: active.opacity ?? normal.opacity ?? 1,
    },

    [pseudoClasses.readOnly]: {
      opacity: readOnly.opacity ?? normal.opacity ?? 1,
    },

    '&.drop-shadow': {
      filter: 'drop-shadow(rgba(0 0 0 / 50%) 0px 0px 2px)',
    },
  },
  clickable: {
    cursor: 'pointer',
  },
}));

let augmentedIconDefinitions = LocalIconDefinitions;

const IconComponent = createComponent('Icon', function ({
  name,
  className,
  color,
  size = 'normal',
  dropShadow = false,
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
    const defaultIcon = () => augmentedIconDefinitions['no-image']({ size: '100%', color });
    const iconFunc = augmentedIconDefinitions[name as keyof typeof augmentedIconDefinitions];
    if (!is.function(iconFunc)) return defaultIcon();

    const returnedIcon = (() => {
      try {
        return iconFunc({ size: '100%', color });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error rendering icon "${name}":`, error);
        return defaultIcon();
      }
    })();

    if (returnedIcon.type == null) {
      // eslint-disable-next-line no-console
      console.error(`Icon "${name}" is not a valid icon`);
      return defaultIcon();
    }

    return returnedIcon;
  }, [name, color, sizeAmount]);

  return (
    <Tag name="icon" ref={ref} className={join(css.icon, dropShadow && 'drop-shadow', onClick != null && css.clickable, className)} data-icon-type={name} onClick={onClick}>
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
