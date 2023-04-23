import { createComponent } from '../Component';
import { useRipple } from '../Ripple';
import { NoSkeletons, Skeleton } from '../Skeleton';
import { useBound, useForceUpdate } from '../../hooks';
import { useEventIsolator } from '../../hooks/useEventIsolator';
import { useDOMRef } from '../../hooks/useDOMRef';
import { createStyles, TransitionTheme } from '../../theme';
import { Children, KeyboardEvent, MouseEvent, ReactNode, Ref, useRef } from 'react';
import { Tag } from '../Tag';
import { ButtonTheme } from './ButtonTheme';
import { IconButtonTheme } from './IconButtonTheme';
import { is, PromiseMaybe } from '@anupheaus/common';
import { Icon } from '../Icon';
import { useUIState } from '../../providers';

export interface ButtonProps {
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  size?: 'default' | 'small' | 'large';
  iconOnly?: boolean;
  children?: ReactNode;
  onClick?(event: MouseEvent): void;
  onSelect?(event: MouseEvent | KeyboardEvent): PromiseMaybe<void>;
}

interface StyleProps {
  iconOnly: boolean;
  isReadOnly: boolean;
  isLoading: boolean;
}

const useStyles = createStyles(({ useTheme, activePseudoClasses }, { isLoading, iconOnly, isReadOnly }: StyleProps) => {
  const { default: standard, active, disabled, borderRadius, fontSize, fontWeight, alignment } = useTheme(iconOnly ? IconButtonTheme : ButtonTheme);
  const transitionSettings = useTheme(TransitionTheme);

  return {
    styles: {
      button: {
        appearance: 'none',
        borderRadius: borderRadius,
        borderStyle: 'none',
        boxShadow: `0 0 1px 0 ${isReadOnly ? disabled.borderColor : standard.borderColor}`,
        backgroundColor: isReadOnly ? disabled.backgroundColor : standard.backgroundColor,
        color: isReadOnly ? disabled.textColor : standard.textColor,
        fontSize: fontSize,
        fontWeight: fontWeight,
        cursor: isReadOnly ? 'default' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flex: 'none',
        gap: 4,
        ...(iconOnly ? { overflow: 'hidden' } : {}),
        alignItems: 'center',
        justifyContent: alignment,
        transitionProperty: 'background-color, color',
        ...transitionSettings,
        boxSizing: 'border-box',
        outline: 'none',
        visibility: isLoading ? 'hidden' : undefined,

        ...(isReadOnly ? {} : {
          [activePseudoClasses]: {
            backgroundColor: active.backgroundColor,
            boxShadow: `0 0 1px 0 ${active.borderColor}`,
            color: active.textColor,
          }
        }),


      },
      size_variant_default: {
        ...(iconOnly ? {
          width: 30,
          height: 30,
          padding: 0,
          justifyContent: 'center',
        } : {
          minHeight: 30,
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
      isReadOnly: {

      },
    },
  };
});

export const Button = createComponent('Button', ({
  className,
  children = null,
  ref,
  size = 'default',
  iconOnly: providedIconOnly,
  onClick,
  onSelect,
}: ButtonProps) => {
  const iconOnly = providedIconOnly ?? (Children.count(children) === 1 && is.reactElement(children) && children.type === Icon);
  const { isReadOnly, isLoading } = useUIState();
  const { css, join } = useStyles({ isLoading, iconOnly, isReadOnly });
  const { Ripple, rippleTarget } = useRipple();
  const eventsIsolator = useEventIsolator({ clickEvents: 'propagation', focusEvents: 'propagation', onParentElement: true });
  const useAnimatedBorderEffectRef = useRef(false);
  const internalRef = useDOMRef([ref, rippleTarget, eventsIsolator]);
  const update = useForceUpdate();
  const handleClick = useBound(async (event: MouseEvent) => {
    if (isLoading || isReadOnly) return;
    onClick?.(event);
    const result = onSelect?.(event);
    if (!is.promise(result)) return;
    useAnimatedBorderEffectRef.current = true;
    update();
    await result;
    useAnimatedBorderEffectRef.current = false;
    update();
  });

  return (
    <Tag
      ref={internalRef}
      name={'button'}
      {...{ type: 'button' }}
      className={join(
        css.button,
        css[`size_variant_${size}`],
        isReadOnly && css.isReadOnly,
        className,
      )}
      onClickCapture={handleClick}
    >
      <Ripple isDisabled={isReadOnly || isLoading} />
      <NoSkeletons>
        {children}
      </NoSkeletons>
      <Skeleton useAnimatedBorder={useAnimatedBorderEffectRef.current} />
    </Tag>
  );
});
