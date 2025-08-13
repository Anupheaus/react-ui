import type { TransitionEvent } from 'react';
import { useRef, type ReactNode } from 'react';
import { createComponent } from '../Component';
import type { FlexProps } from '../Flex';
import { Flex } from '../Flex';
import { createStyles } from '../../theme';
import { useBound, useForceUpdate, useObserver } from '../../hooks';

const useStyles = createStyles((_ignore, { applyTransition }) => ({
  expander: {
    height: 0,
    contain: 'paint',
    ...applyTransition('height'),
    transitionDuration: 'var(--expander-duration)',

    '&.is-expanded, &.is-expanding': {
      height: 'var(--expander-height)',

      '&:has(expander.is-expanding), &:has(expander.is-collapsing), &:has(expander.is-expanded)': {
        height: 'auto',
      },
    },
  },
}));

interface Props extends Pick<FlexProps, 'className' | 'isVertical' | 'gap'> {
  isExpanded?: boolean;
  children: ReactNode;
}

export const Expander = createComponent('Expander', ({
  isExpanded = false,
  children,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const targetRef = useRef<HTMLDivElement | null>(null);
  const lastIsExpandedRef = useRef(isExpanded);
  const stateRef = useRef<'collapsed' | 'expanding' | 'expanded' | 'collapsing'>('collapsed');
  const lastStateRef = useRef<'collapsed' | 'expanding' | 'expanded' | 'collapsing'>(stateRef.current);
  const update = useForceUpdate();
  const timerRef = useRef(400);

  if (isExpanded !== lastIsExpandedRef.current) {
    lastIsExpandedRef.current = isExpanded;
    if (isExpanded) stateRef.current = 'expanding';
    else stateRef.current = 'collapsing';
  }

  const updateHeight = useBound((element: HTMLElement) => {
    element.style.setProperty('--expander-height', `${element.scrollHeight}px`);
    timerRef.current = Math.round(Math.max(element.scrollHeight * 0.2, 400));
    element.style.setProperty('--expander-duration', `${timerRef.current}ms`);
  });

  const { target: observerTarget } = useObserver({ onChange: updateHeight });

  const resetStates = () => {
    if (stateRef.current === 'expanding') stateRef.current = 'expanded';
    else if (stateRef.current === 'collapsing') stateRef.current = 'collapsed';
    update();
  };

  const handleTransitionEnd = useBound((event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== targetRef.current) return;
    resetStates();
  });

  const saveElement = useBound((element: HTMLDivElement | null) => {
    targetRef.current = element;
    observerTarget(element);
  });

  if (lastStateRef.current !== stateRef.current) {
    lastStateRef.current = stateRef.current;
    setTimeout(resetStates, timerRef.current);
  }

  return (
    <Flex
      isVertical
      {...props}
      ref={saveElement}
      tagName="expander"
      className={join(css.expander, `is-${stateRef.current}`, props.className)}
      onTransitionEndCapture={handleTransitionEnd}
      disableGrow
    >
      {children}
    </Flex>
  );
});
