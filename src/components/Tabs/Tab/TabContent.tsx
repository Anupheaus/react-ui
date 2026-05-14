import type { ReactNode } from 'react';
import { useState } from 'react';
import type { DistributedState } from '../../../hooks';
import { useBatchUpdates, useDistributedState } from '../../../hooks';
import { createComponent } from '../../Component';
import { createStyles } from '../../../theme';
import { Flex, type FlexProps } from '../../Flex';
import { Scroller } from '../../Scroller';

const useStyles = createStyles(({ windows: { content: { active: contentActive } } }) => ({
  tab: {
    gridRow: '1 / 1',
    gridColumn: '1 / 1',
    opacity: 0,
    transitionDuration: '400ms',
    transitionTimingFunction: 'ease',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: -1,

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

    '&.slide-up': {
      marginTop: -50,
      marginBottom: 50,
    },

    '&.slide-down': {
      marginTop: 50,
      marginBottom: -50,
    },
  },
  tabHorizontal: {
    transitionProperty: 'opacity, margin-left, margin-right',
  },
  tabVertical: {
    transitionProperty: 'opacity, margin-top, margin-bottom',
  },
  tabContent: {
    padding: contentActive.padding,

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
  orientation: 'horizontal' | 'vertical';
}

export const TabContent = createComponent('Tab', ({
  className,
  tabIndex,
  state,
  children,
  noPadding = false,
  contentProps,
  orientation,
}: Props) => {
  const { onChange, get } = useDistributedState(state);
  const { css, join } = useStyles();
  const [isFocused, setIsFocused] = useState(get() === tabIndex);
  const [direction, setDirection] = useState(orientation === 'vertical' ? 'down' : 'right');
  const batchUpdate = useBatchUpdates();

  onChange(newIndex => batchUpdate(() => {
    if (orientation === 'vertical') {
      setDirection(newIndex > tabIndex ? 'up' : 'down');
    } else {
      setDirection(newIndex > tabIndex ? 'left' : 'right');
    }
    setIsFocused(newIndex === tabIndex);
  }));

  return (
    <Flex tagName="tab" className={join(css.tab, orientation === 'vertical' ? css.tabVertical : css.tabHorizontal, !isFocused && `slide-${direction}`, isFocused && 'is-visible')}>
      <Scroller fullHeight>
        <Flex tagName="tab-content-inner" isVertical className={join(css.tabContent, noPadding && 'no-padding', className)} {...contentProps}>
          {children}
        </Flex>
      </Scroller>
    </Flex>
  );
});