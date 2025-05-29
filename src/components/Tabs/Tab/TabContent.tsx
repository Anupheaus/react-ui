import type { ReactNode } from 'react';
import { useState } from 'react';
import type { DistributedState } from '../../../hooks';
import { useBatchUpdates, useDistributedState } from '../../../hooks';
import { createComponent } from '../../Component';
import { createStyles } from '../../../theme';
import { Flex, type FlexProps } from '../../Flex';

const useStyles = createStyles(({ windows: { content: { active: contentActive } } }) => ({
  tabContent: {
    gridRow: '1 / 1',
    gridColumn: '1 / 1',
    opacity: 0,
    transitionProperty: 'opacity, margin-left, margin-right',
    transitionDuration: '400ms',
    transitionTimingFunction: 'ease',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: -1,
    padding: contentActive.padding,

    '&.is-visible': {
      opacity: 1,
      pointerEvents: 'all',
      zIndex: 0,
    },

    '&.slide-left': {
      marginLeft: -50,
      marginRight: 50,
    },

    '&.slide-right': {
      marginLeft: 50,
      marginRight: -50,
    },

    '&.no-padding': {
      padding: 0,
    },
  },
}));

interface Props {
  className?: string;
  tabIndex: number;
  state: DistributedState<number>;
  children: ReactNode;
  noPadding?: boolean;
  contentProps?: FlexProps;
}

export const TabContent = createComponent('Tab', ({
  className,
  tabIndex,
  state,
  children,
  noPadding = false,
  contentProps,
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
    <Flex tagName="tab" className={join(css.tabContent, !isFocused && `slide-${direction}`, isFocused && 'is-visible', noPadding && 'no-padding', className)} {...contentProps}>
      {children}
    </Flex>
  );
});