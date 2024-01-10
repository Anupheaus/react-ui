import { CSSProperties, useLayoutEffect, useMemo, useRef } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { useDOMRef } from '../../hooks/useDOMRef';
import { RippleConfig, RippleState } from './RippleModels';
import { DistributedState, useDistributedState } from '../../hooks';
import { createAnimationKeyFrame, createStyles2 } from '../../theme';
import { useUIState } from '../../providers';

function getMarginFrom(element: HTMLElement) {
  const { top, left } = window.getComputedStyle(element);
  const parseSize = (value: string) => {
    const v = parseInt(value.replace(/[^0-9-]+/g, ''));
    return isNaN(v) ? 0 : v;
  };

  return {
    top: parseSize(top),
    left: parseSize(left),
  };
}

function getRippleStyle(element: HTMLElement | null, x: number, y: number, useCoords: boolean) {
  if (element == null) return {};
  const size = Math.round(Math.max(element.clientHeight, element.clientWidth) * 2);
  if (!useCoords) {
    x = element.clientWidth / 2;
    y = element.clientHeight / 2;
  } else {
    const { top, left } = getMarginFrom(element);
    x -= left;
    y -= top;
  }
  const top = Math.round(y - (size / 2));
  const left = Math.round(x - (size / 2));
  return { width: size, height: size, top, left };
}

const activeKeyFrame = createAnimationKeyFrame({
  from: {
    transform: 'scale(0)',
    opacity: 1,
  },
  to: {
    transform: 'scale(1.2)',
    opacity: 0.5,
  },
});

const inactiveKeyFrame = createAnimationKeyFrame({
  from: {
    transform: 'scale(1.2)',
    opacity: 0.5,
  },
  to: {
    transform: 'scale(1.2)',
    opacity: 0,
  }
});

const useStyles = createStyles2(({ vars }) => ({
  ripple: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'none',

    '&.stay-within-container': {
      overflow: 'hidden',
    },
  },
  rippleAnimation: {
    position: 'absolute',
    borderRadius: '50%',
    transform: 'scale(0)',
    animationFillMode: 'forwards',
    animationDuration: '800ms',
    animationTimingFunction: 'ease-out',
    backgroundColor: `var(${vars.ripple}, currentColor)`,
    pointerEvents: 'none',

    '&.is-active:not(.is-read-only)': {
      animationName: activeKeyFrame,
    },

    '&.is-inactive': {
      animationDuration: '400ms',
      animationName: inactiveKeyFrame,
    },
  },
}));

export interface RippleProps {
  isDisabled?: boolean;
  className?: string;
  stayWithinContainer?: boolean;
  ignoreMouseCoords?: boolean;
}

interface Props extends RippleProps {
  rippleState: DistributedState<RippleState>;
  rippleConfig: DistributedState<RippleConfig>;
}

export const Ripple = createComponent('Ripple', ({
  className,
  isDisabled = false,
  stayWithinContainer = false,
  ignoreMouseCoords = false,
  rippleConfig,
  rippleState,
}: Props) => {
  const { css, join } = useStyles();
  const { getAndObserve } = useDistributedState(rippleState);
  const { modify } = useDistributedState(rippleConfig);
  const { isReadOnly } = useUIState();
  const { isActive, x, y, useCoords } = getAndObserve();
  const beenActiveRef = useRef(false);
  const [element, target] = useDOMRef();

  if (isActive === true && !isReadOnly && !isDisabled) beenActiveRef.current = true;

  useLayoutEffect(() => {
    modify(existing => ({ ...existing, rippleElement: element.current }));
  }, [element.current]);

  useLayoutEffect(() => {
    modify(existing => ({ ...existing, ignoreMouseCoords }));
  }, [ignoreMouseCoords]);

  const rippleStyle = useMemo<CSSProperties>(() => getRippleStyle(element.current, x, y, useCoords),
    [element.current?.clientHeight, element.current?.clientWidth, useCoords, x, y]);

  return (
    <Tag ref={target} name="ui-ripple" className={join(css.ripple, stayWithinContainer && 'stay-within-container', className)}>
      <Tag
        name="ui-ripple-animation"
        className={join(
          css.rippleAnimation,
          isActive && !isDisabled && !isReadOnly && 'is-active',
          (!isActive || isReadOnly) && beenActiveRef.current && 'is-inactive',
        )}
        style={rippleStyle}
      />
    </Tag>
  );
});
