import { ReactNode, useRef, useState } from 'react';
import { DistributedState, useDistributedState } from '../../../hooks';
import { createComponent } from '../../Component';
import { Tag } from '../../Tag';
import { createStyles } from '../../../theme';

const useStyles = createStyles(() => ({
  tabContent: {
    display: 'flex',
    gridRow: '1 / 1',
    gridColumn: '1 / 1',
    opacity: 0,
    transitionProperty: 'opacity, margin-left, margin-right',
    transitionDuration: '400ms',
    transitionTimingFunction: 'ease',
    overflow: 'hidden',
    pointerEvents: 'none',

    '&.is-visible': {
      opacity: 1,
      pointerEvents: 'all',
    },

    '&.slide-left': {
      marginLeft: -50,
      marginRight: 50,
    },

    '&.slide-right': {
      marginLeft: 50,
      marginRight: -50,
    },
  },
}));

interface Props {
  className?: string;
  tabIndex: number;
  state: DistributedState<number>;
  children: ReactNode;

}

export const TabContent = createComponent('Tab', ({
  className,
  tabIndex,
  state,
  children,
}: Props) => {
  const { onChange, get } = useDistributedState(state);
  const { css, join } = useStyles();
  const [isFocused, setIsFocused] = useState(get() === tabIndex);
  const directionRef = useRef('right');

  onChange(newIndex => {
    directionRef.current = newIndex > tabIndex ? 'left' : 'right';
    if (newIndex !== tabIndex && isFocused) setIsFocused(false);
    if (newIndex === tabIndex && !isFocused) setIsFocused(true);
  });

  return (
    <Tag name="tab" className={join(css.tabContent, !isFocused && `slide-${directionRef.current}`, isFocused && 'is-visible', className)}>
      {children}
    </Tag>
  );
});