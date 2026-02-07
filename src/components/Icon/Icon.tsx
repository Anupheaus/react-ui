import type { MouseEvent, Ref } from 'react';
import { useMemo } from 'react';
import { createComponent } from '../Component';
import { createStyles, type IconType, type IconTypeConfig } from '../../theme';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import type { IconDefinitions } from './Icons';
import { LocalIconDefinitions } from './Icons';
import { is } from '@anupheaus/common';

export { IconType };

type InternalUseMemoResult = Omit<IconTypeConfig, 'render'> & { icon: JSX.Element; };

interface Props<T extends IconDefinitions = typeof LocalIconDefinitions> {
  name: keyof T;
  className?: string;
  color?: string;
  size?: 'normal' | 'small' | 'large' | number;
  ref?: Ref<HTMLDivElement>;
  dropShadow?: boolean;
  rotate?: number;
  onClick?(event: MouseEvent): void;
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
    transformOrigin: 'center',
    flexGrow: 0,
    flexShrink: 0,
    ...tools.applyTransition('opacity, transform'),

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
  rotate: propsRotate,
  ref,
  onClick,
}: Props<typeof LocalIconDefinitions>) {
  const { css, useInlineStyle, join } = useStyles();

  const sizeAmount = (() => {
    if (typeof (size) === 'number') return size;
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20;
    }
  })();

  const { icon, rotate, flip } = useMemo((): InternalUseMemoResult => {
    const defaultIcon = () => ({ icon: augmentedIconDefinitions['no-image']({ size: '100%', color }), rotate: propsRotate, flip: undefined });
    const iconFuncOrConfig = augmentedIconDefinitions[name as keyof typeof augmentedIconDefinitions] as IconType;
    const config: IconTypeConfig = is.function(iconFuncOrConfig) ? { render: iconFuncOrConfig } : iconFuncOrConfig;
    if (!is.function(config.render)) return defaultIcon();

    const returnedIcon = (() => {
      try {
        return config.render({ size: sizeAmount, color });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error rendering icon "${name}":`, error);
        return defaultIcon().icon;
      }
    })();

    if (returnedIcon == null || returnedIcon.type == null) {
      // eslint-disable-next-line no-console
      console.error(`Icon "${name}" is not a valid icon`);
      return defaultIcon();
    }

    return { ...config, icon: returnedIcon, rotate: propsRotate ?? config.rotate };
  }, [name, color, sizeAmount, propsRotate]);

  const style = useInlineStyle(() => ({
    transform: rotate != null ? `rotate(${rotate}deg)` : flip === 'horizontal' ? 'scaleX(-1)' : flip === 'vertical' ? 'scaleY(-1)' : undefined,
  }), [rotate, flip]);

  return (
    <Tag name="icon" ref={ref} className={join(css.icon, dropShadow && 'drop-shadow', onClick != null && css.clickable, className)} data-icon-type={name} onClick={onClick} style={style}>
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
