import { createComponent } from '../Component';
import { useUIState } from '../../providers';
import { useRipple } from '../Ripple';
import { NoSkeletons, Skeleton } from '../Skeleton';
import { useBound } from '../../hooks';
import { useEventIsolator } from '../../hooks/useEventIsolator';
import { useDOMRef } from '../../hooks/useDOMRef';
import { TransitionTheme } from '../../theme';
import { ComponentProps, MouseEvent, ReactNode, Ref, useMemo } from 'react';
import { Tag } from '../Tag';
import { Icon } from '../Icon';
import { ButtonTheme } from './ButtonTheme';
import { IconButtonTheme } from './IconButtonTheme';
import { IconName } from '../Icon/Icons';

export interface ButtonProps {
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  icon?: IconName;
  onClick?(event: MouseEvent): void;
  size?: 'default' | 'small' | 'large';
  children?: ReactNode;
}

export const Button = createComponent({
  id: 'Button',

  styles: ({ useTheme }, props: ButtonProps) => {
    const { icon, children } = props;
    const isIconOnly = icon != null && children == null;
    const {
      backgroundColor, activeBackgroundColor, borderRadius, fontSize, fontWeight,
      textColor, activeTextColor, borderColor, activeBorderColor,
    } = useTheme(isIconOnly ? IconButtonTheme : ButtonTheme);
    const transitionSettings = useTheme(TransitionTheme);

    // console.log({ backgroundColor, textColor, activeBackgroundColor, activeTextColor });

    return {
      styles: {
        button: {
          appearance: 'none',
          borderRadius: borderRadius,
          borderStyle: 'none',
          boxShadow: `0 0 1px 0 ${borderColor}`,
          backgroundColor: backgroundColor,
          color: textColor,
          fontSize: fontSize,
          fontWeight: fontWeight,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flex: 'none',
          gap: 4,
          alignItems: 'center',
          transitionProperty: 'background-color, color',
          ...transitionSettings,
          boxSizing: 'border-box',
          outline: 'none',


          '&:hover, &:active, &:focus, &:focus-visible': {
            backgroundColor: activeBackgroundColor,
            boxShadow: `0 0 1px 0 ${activeBorderColor}`,
            color: activeTextColor,
          },
        },
        isLoading: {
          pointerEvents: 'none',
          cursor: 'default',
          visibility: 'hidden',
          borderWidth: 0,
        },
        size_variant_default: {
          ...(isIconOnly ? {
            width: 34,
            height: 34,
            padding: 0,
            justifyContent: 'center',
          } : {
            minHeight: 34,
            padding: '4px 8px 6px',
          }),

        },
        size_variant_small: {
          padding: '1px 2px',
        },
        size_variant_large: {
          minHeight: 34,
          padding: '8px 16px 12px',
        },
      },
    };
  },

  render({
    className,
    children = null,
    ref,
    size = 'default',
    icon,
    onClick,
  }: ButtonProps, { css, join }) {
    const { isLoading } = useUIState();
    const { UIRipple, rippleTarget } = useRipple();
    const eventsIsolator = useEventIsolator({ clickEvents: 'propagation', focusEvents: 'propagation', onParentElement: true });
    const internalRef = useDOMRef([ref, rippleTarget, eventsIsolator]);
    const handleClick = useBound((event: MouseEvent) => onClick?.(event));

    const iconSize = useMemo<Required<ComponentProps<typeof Icon>>['size']>(() => {
      switch (size) {
        case 'default': return 'normal';
        default: return size;
      }
    }, [size]);

    return (
      <Tag
        ref={internalRef}
        name={'button'}
        className={join(
          css.button,
          isLoading && css.isLoading,
          css[`size_variant_${size}`],
          className,
        )}
        onClickCapture={handleClick}
      >
        <UIRipple />
        <NoSkeletons>
          {icon != null && <Icon name={icon} size={iconSize} />}
          {children}
        </NoSkeletons>
        <Skeleton />
      </Tag>
    );
  },

});
