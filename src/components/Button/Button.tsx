import { createComponent } from '../Component';
import { useUIState } from '../../providers';
import { useRipple } from '../Ripple';
import { NoSkeletons, Skeleton } from '../Skeleton';
import { useBound } from '../../hooks';
import { useEventIsolator } from '../../hooks/useEventIsolator';
import { useDOMRef } from '../../hooks/useDOMRef';
import { IconType, TransitionTheme } from '../../theme';
import { ButtonTheme } from './ButtonTheme';
import { MouseEvent, ReactNode, Ref } from 'react';
import { Tag } from '../Tag';
import { Icon } from '../Icon';

interface Props {
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  icon?: IconType;
  onClick?(event: MouseEvent): void;
  children?: ReactNode;
}

export const Button = createComponent({
  id: 'Button',

  styles: ({ useTheme }) => {
    const { definition: transitionSettings } = useTheme(TransitionTheme);
    const { definition: { backgroundColor, activeBackgroundColor, activeTextColor, borderColor, borderRadius, fontSize, fontWeight, textColor } } = useTheme(ButtonTheme);
    return {
      styles: {
        button: {
          appearance: 'none',
          borderWidth: 1,
          borderRadius: borderRadius,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          borderStyle: 'solid',
          padding: '4px 8px 6px',
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
          minHeight: 34,

          '&:hover, &:active, &:focus, &:focus-visible': {
            backgroundColor: activeBackgroundColor,
            color: activeTextColor,
          },
        },
        isLoading: {
          pointerEvents: 'none',
          cursor: 'default',
          visibility: 'hidden',
          borderWidth: 0,
        },
        iconOnly: {
          borderRadius: '50%',
          width: 34,
          height: 34,
          padding: 0,
          justifyContent: 'center',
          gap: 0,
        },
      },
    };
  },

  render({
    className,
    children = null,
    ref,
    icon,
    onClick,
  }: Props, { css, join }) {
    const { isLoading } = useUIState();
    const { UIRipple, rippleTarget } = useRipple();
    const eventsIsolator = useEventIsolator({ clickEvents: 'propagation', focusEvents: 'propagation', onParentElement: true });
    const internalRef = useDOMRef([ref, rippleTarget, eventsIsolator]);
    const isIconOnly = icon != null && children == null;

    const handleClick = useBound((event: MouseEvent) => onClick?.(event));

    return (
      <Tag
        ref={internalRef}
        name={'button'}
        className={join(
          css.button,
          isLoading && css.isLoading,
          isIconOnly && css.iconOnly,
          className,
        )}
        onClickCapture={handleClick}
      >
        <UIRipple />
        <NoSkeletons>
          {icon != null && <Icon>{icon}</Icon>}
          {children}
        </NoSkeletons>
        <Skeleton />
      </Tag>
    );
  },

});
