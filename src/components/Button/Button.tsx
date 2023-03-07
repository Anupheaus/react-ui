import { createComponent } from '../Component';
import { useRipple } from '../Ripple';
import { NoSkeletons, Skeleton } from '../Skeleton';
import { useBound } from '../../hooks';
import { useEventIsolator } from '../../hooks/useEventIsolator';
import { useDOMRef } from '../../hooks/useDOMRef';
import { createStyles, TransitionTheme } from '../../theme';
import { Children, KeyboardEvent, MouseEvent, ReactNode, Ref, useRef } from 'react';
import { Tag } from '../Tag';
import { ButtonTheme } from './ButtonTheme';
import { IconButtonTheme } from './IconButtonTheme';
import { is, PromiseMaybe } from '@anupheaus/common';
import { Icon } from '../Icon';

export interface ButtonProps {
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  onClick?(event: MouseEvent): void;
  onSelect?(event: MouseEvent | KeyboardEvent): PromiseMaybe<void>;
  size?: 'default' | 'small' | 'large';
  children?: ReactNode;
}

const useStyles = createStyles(({ useTheme }, { children }: ButtonProps) => {
  const isIconOnly = Children.count(children) === 1 && is.reactElement(children) && children.type === Icon;
  const {
    backgroundColor, activeBackgroundColor, borderRadius, fontSize, fontWeight,
    textColor, activeTextColor, borderColor, activeBorderColor,
  } = useTheme(isIconOnly ? IconButtonTheme : ButtonTheme);
  const transitionSettings = useTheme(TransitionTheme);

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
        justifyContent: 'center',
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
      size_variant_default: {
        ...(isIconOnly ? {
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
    },
  };
});

export const Button = createComponent('Button', ({
  className,
  children = null,
  ref,
  size = 'default',
  onClick,
  onSelect,
}: ButtonProps) => {
  const { css, join } = useStyles();
  const { Ripple, rippleTarget } = useRipple();
  const eventsIsolator = useEventIsolator({ clickEvents: 'propagation', focusEvents: 'propagation', onParentElement: true });
  const useAnimatedBorderEffectRef = useRef(false);
  const internalRef = useDOMRef([ref, rippleTarget, eventsIsolator]);
  const handleClick = useBound(async (event: MouseEvent) => {
    onClick?.(event);
    useAnimatedBorderEffectRef.current = true;
    await onSelect?.(event);
    useAnimatedBorderEffectRef.current = false;
  });

  return (
    <Tag
      ref={internalRef}
      name={'button'}
      className={join(
        css.button,
        css[`size_variant_${size}`],
        className,
      )}
      onClickCapture={handleClick}
    >
      <Ripple />
      <NoSkeletons>
        {children}
      </NoSkeletons>
      <Skeleton useAnimatedBorder={useAnimatedBorderEffectRef.current} />
    </Tag>
  );
});
