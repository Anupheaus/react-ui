import { createComponent } from '../Component';
import { useRipple } from '../Ripple';
import { NoSkeletons, Skeleton } from '../Skeleton';
import { useBound, useForceUpdate } from '../../hooks';
import { useEventIsolator } from '../../hooks/useEventIsolator';
import { useDOMRef } from '../../hooks/useDOMRef';
import { createStyles2 } from '../../theme';
import { Children, CSSProperties, KeyboardEvent, MouseEvent, ReactNode, Ref, useRef } from 'react';
import { Tag } from '../Tag';
import { is, PromiseMaybe } from '@anupheaus/common';
import { Icon } from '../Icon';
import { useUIState } from '../../providers';

export interface ButtonProps {
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  variant?: 'default' | 'bordered' | 'hover',
  size?: 'default' | 'small' | 'large';
  style?: CSSProperties;
  iconOnly?: boolean;
  children?: ReactNode;
  onClick?(event: MouseEvent): PromiseMaybe<unknown>;
  onSelect?(event: MouseEvent | KeyboardEvent): PromiseMaybe<void>;
}

const useStyles = createStyles2(({ animation, action: { default: defaultAction, disabled: disabledAction, active: activeAction }, activePseudoClasses }) => ({
  button: {
    ...defaultAction,
    ...animation,
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

    '&:not(.is-read-only)': {
      [activePseudoClasses]: {
        ...activeAction,
      }
    },
    '&.is-read-only': {
      ...disabledAction,
      cursor: 'default',
    },

    '&.is-icon-only': {
      overflow: 'hidden',
      borderRadius: '50%',
    },

    '&.is-loading': {
      visibility: 'hidden',
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
      width: 22,
      height: 22,
    },
  },
  size_variant_large: {
    minHeight: 34,
    padding: '8px 16px 12px',
  },
  variant_default: {
  },
  variant_bordered: {
    boxShadow: `inset 0 0 0 1px ${defaultAction.borderColor}`,
    backgroundColor: 'transparent',
  },
  variant_hover: {
    backgroundColor: 'transparent',
  },
}));

export const Button = createComponent('Button', ({
  className,
  children = null,
  variant = 'default',
  ref,
  size,
  iconOnly: providedIconOnly,
  style,
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
        isLoading && 'is-loading',
        css[`size_variant_${size}`],
        css[`variant_${variant}`],
        className,
      )}
      style={style}
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
