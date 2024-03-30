import { ReactNode, useState } from 'react';
import { DistributedState, useBatchUpdates, useDistributedState } from '../../../hooks';
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
  const [direction, setDirection] = useState('right');
  const batchUpdate = useBatchUpdates();

  onChange(newIndex => batchUpdate(() => {
    setDirection(newIndex > tabIndex ? 'left' : 'right');
    setIsFocused(newIndex === tabIndex);
  }));

  return (
    <Tag name="tab" className={join(css.tabContent, !isFocused && `slide-${direction}`, isFocused && 'is-visible', className)}>
      {children}
    </Tag>
  );
});