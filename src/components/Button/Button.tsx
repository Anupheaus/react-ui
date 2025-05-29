import { createComponent } from '../Component';
import { useRipple } from '../Ripple';
import { NoSkeletons, Skeleton } from '../Skeleton';
import { useBound, useForceUpdate } from '../../hooks';
import { useEventIsolator } from '../../hooks/useEventIsolator';
import { useDOMRef } from '../../hooks/useDOMRef';
import { createStyles } from '../../theme';
import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode, Ref } from 'react';
import { Children, useRef } from 'react';
import { Tag } from '../Tag';
import type { PromiseMaybe } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import { Icon } from '../Icon';
import { useUIState } from '../../providers';

export interface ButtonProps {
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  variant?: 'default' | 'bordered' | 'hover',
  size?: 'default' | 'small' | 'large';
  align?: 'left' | 'middle' | 'right';
  style?: CSSProperties;
  iconOnly?: boolean;
  children?: ReactNode;
  testId?: string;
  onClick?(event: MouseEvent): PromiseMaybe<unknown>;
  onSelect?(event: MouseEvent | KeyboardEvent): PromiseMaybe<void>;
}

const useStyles = createStyles(({ transition, text, buttons: { default: defaultButton, bordered, hover }, pseudoClasses }) => {

  const defineVariant = (variant: typeof defaultButton) => ({
    backgroundColor: variant.normal.backgroundColor,
    color: variant.normal.textColor,
    fontSize: variant.normal.textSize,
    boxShadow: variant.normal.borderColor == null ? 'none' : `inset 0 0 0 1px ${variant.normal.borderColor}`,
    borderRadius: variant.normal.borderRadius,


    [pseudoClasses.active]: {
      backgroundColor: variant.active.backgroundColor ?? variant.normal.backgroundColor,
      color: variant.active.textColor ?? variant.normal.textColor,
      boxShadow: (variant.active.borderColor ?? variant.normal.borderColor) == null ? 'none' : `inset 0 0 0 1px ${variant.active.borderColor ?? variant.normal.borderColor}`,
      borderRadius: variant.active.borderRadius ?? variant.normal.borderRadius,
    },

    [pseudoClasses.readOnly]: {
      backgroundColor: variant.readOnly.backgroundColor ?? variant.normal.backgroundColor,
      color: variant.readOnly.textColor ?? variant.normal.textColor,
      boxShadow: (variant.readOnly.borderColor ?? variant.normal.borderColor) == null ? 'none' : `inset 0 0 0 1px ${variant.readOnly.borderColor ?? variant.normal.borderColor}`,
      borderRadius: variant.readOnly.borderRadius ?? variant.normal.borderRadius,
    },
  });

  return {
    button: {
      appearance: 'none',
      borderStyle: 'none',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flex: 'none',
      gap: 4,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      transitionProperty: 'background-color, color',
      boxSizing: 'border-box',
      outline: 'none',
      fontFamily: text.family,
      fontSize: text.size,
      fontWeight: text.weight,
      color: text.color,
      ...transition,

      '&:not(.is-read-only)': {
        [pseudoClasses.active]: {
          '&.is-icon-only': {
            overflow: 'hidden',
            borderRadius: '50%',
          },
        }
      },
      [pseudoClasses.readOnly]: {
        cursor: 'default',
      },

      '&.is-icon-only': {
        overflow: 'hidden',
        borderRadius: '50%',
      },

      '&.is-loading': {
        visibility: 'hidden',
      },

      '&.left-align': {
        justifyContent: 'flex-start',
      },
      '&.right-align': {
        justifyContent: 'flex-end',
      },
      '&.middle-align': {
        justifyContent: 'center',
      },

      '&:not(.is-icon-only)': {
        '& > icon': {
          marginRight: 4,
        },

        '& > icon:last-child': {
          marginLeft: 4,
        },
      },
    },
    size_variant_default: {
      '&:not(.is-icon-only)': {
        minHeight: 30,
        padding: '6px 8px',
      },
      '&.is-icon-only': {
        width: 30,
        height: 30,
        padding: 0,
      },
    },
    size_variant_small: {
      padding: '2px 4px',

      '&.is-icon-only': {
        padding: '1px 2px',
        width: 20,
        height: 20,
      },
    },
    size_variant_large: {
      minHeight: 34,
      padding: '8px 16px 12px',
    },
    variant_default: defineVariant(defaultButton),
    variant_bordered: defineVariant(bordered),
    variant_hover: defineVariant(hover),

    ripple: {
      '&.variant-default': {
        backgroundColor: defaultButton.normal.rippleColor,
      },

      '&.variant-bordered': {
        backgroundColor: bordered.normal.rippleColor,
      },

      '&.variant-hover': {
        backgroundColor: hover.normal.rippleColor,
      },
    },
  };
});

export const Button = createComponent('Button', ({
  className,
  children = null,
  variant = 'default',
  align = 'middle',
  ref,
  size,
  iconOnly: providedIconOnly,
  style,
  testId,
  onClick,
  onSelect,
}: ButtonProps) => {
  const isIconOnly = providedIconOnly ?? (Children.count(children) === 1 && is.reactElement(children) && children.type === Icon);
  const { isReadOnly, isLoading, isCompact } = useUIState();
  if (size == null) size = isCompact ? 'small' : 'default';
  const { css, join } = useStyles();
  const { Ripple, rippleTarget } = useRipple();
  const eventsIsolator = useEventIsolator({ clickEvents: 'propagation', focusEvents: 'propagation', onParentElement: true });
  const useAnimatedBorderEffectRef = useRef(false);
  const internalRef = useDOMRef([ref, rippleTarget, eventsIsolator]);
  const update = useForceUpdate();

  const handleClick = useBound(async (event: MouseEvent) => {
    if (isLoading || isReadOnly) return;
    const clickResult = onClick?.(event);
    const selectResult = onSelect?.(event);
    if (!is.promise(clickResult) && !is.promise(selectResult)) return;
    useAnimatedBorderEffectRef.current = true;
    update();
    await Promise.all([clickResult, selectResult]);
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
        isReadOnly && 'is-read-only',
        isIconOnly && 'is-icon-only',
        `${align}-align`,
        isLoading && !useAnimatedBorderEffectRef.current && 'is-loading',
        css[`size_variant_${size}`],
        css[`variant_${variant}`],
        className,
      )}
      style={style}
      onClickCapture={handleClick}
      testId={testId}
    >
      <Ripple className={join(css.ripple, `variant-${variant}`)} isDisabled={isReadOnly || isLoading} />
      <NoSkeletons>
        {children}
      </NoSkeletons>
      <Skeleton useAnimatedBorder={useAnimatedBorderEffectRef.current} />
    </Tag>
  );
});


