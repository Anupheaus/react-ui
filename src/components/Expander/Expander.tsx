import { useRef, type ReactNode } from 'react';
import { createComponent } from '../Component';
import type { FlexProps } from '../Flex';
import { Flex } from '../Flex';
import { createStyles } from '../../theme';
import { useBound } from '../../hooks';

const useStyles = createStyles((_ignore, { applyTransition }) => ({
  expander: {
    height: 0,
    contain: 'paint',
    ...applyTransition('height'),
  },
}));

interface Props extends Pick<FlexProps, 'className' | 'isVertical' | 'gap'> {
  isExpanded?: boolean;
  children: ReactNode;
  debug?: boolean;
}

export const Expander = createComponent('Expander', ({
  isExpanded = false,
  children,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const targetRef = useRef<HTMLDivElement | null>(null);
  const lastIsExpandedRef = useRef(false);
  const stateRef = useRef<'collapsed' | 'expanding' | 'expanded' | 'collapsing'>('collapsed');

  if (isExpanded !== lastIsExpandedRef.current) {
    lastIsExpandedRef.current = isExpanded;
    if (isExpanded) stateRef.current = 'expanding';
    else stateRef.current = 'collapsing';
  }

  const updateHeight = () => {
    if (stateRef.current === 'expanding' || stateRef.current === 'collapsing') {
      if (targetRef.current == null) return;
      targetRef.current.style.setProperty('max-height', '0px');
      const scrollHeight = targetRef.current.scrollHeight;
      const duration = Math.max(Math.round(scrollHeight * 0.2), 400);
      targetRef.current.style.setProperty('height', `${scrollHeight}px`);
      targetRef.current.style.setProperty('transition-duration', `${duration}ms`);
      targetRef.current.style.removeProperty('max-height');

      requestAnimationFrame(() => {
        if (targetRef.current == null) return;
        if (stateRef.current === 'collapsing') targetRef.current.style.setProperty('height', '0px');
      });
    }
  };
  updateHeight();

  const handleTransitionEnd = useBound(() => {
    if (stateRef.current === 'collapsing') stateRef.current = 'collapsed';
    if (stateRef.current === 'expanding') stateRef.current = 'expanded';
    if (targetRef.current == null) return;
    targetRef.current.style.setProperty('height', stateRef.current === 'collapsed' ? '0px' : 'auto');
  });

  const saveTargetElement = useBound((element: HTMLDivElement | null) => {
    targetRef.current = element;
    updateHeight();
  });

  return (
    <Flex
      tagName="expander"
      isVertical
      {...props}
      ref={saveTargetElement}
      className={join(css.expander, props.className)}
      onTransitionEnd={handleTransitionEnd}
      disableGrow
    >
      {children}
    </Flex>
  );
});
