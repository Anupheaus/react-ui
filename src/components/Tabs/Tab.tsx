import { MapOf } from '@anupheaus/common';
import { ReactNode, useContext, useLayoutEffect, useRef, useState } from 'react';
import { DistributedState, useBound, useDistributedState, useId } from '../../hooks';
import { createStyles } from '../../theme';
import { Button } from '../Button';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { TabsContext } from './TabsContext';
import { TabsTheme } from './TabsTheme';

const useStyles = createStyles(({ useTheme }) => {
  const { activeTab, inactiveTab } = useTheme(TabsTheme);
  return {
    styles: {
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
      },
      isVisible: {
        opacity: 1,
        pointerEvents: 'all',
      },
      slideLeft: {
        marginLeft: -50,
        marginRight: 50,
      },
      slideRight: {
        marginLeft: 50,
        marginRight: -50,
      },
      tabButton: {
        paddingLeft: 16,
        paddingRight: 16,

        '&::after': {
          position: 'absolute',
          content: '""',
          inset: 0,
          borderBottomWidth: inactiveTab.highlightHeight,
          borderBottomColor: inactiveTab.highlightColor,
          borderBottomStyle: 'solid',
          transitionProperty: 'border-bottom-width, border-bottom-color',
          transitionDuration: '400ms',
          transitionTimingFunction: 'ease',
        },
      },
      isFocused: {
        '&::after': {
          borderBottomWidth: activeTab.highlightHeight,
          borderBottomColor: activeTab.highlightColor,
        },
      },
    },
  };
});

export interface TabProps {
  className?: string;
  label?: ReactNode;
  children: ReactNode;
}

export interface TabButtonProps {
  tabIndex: number;
}

export interface TabContentProps {
  tabIndex: number;
}

interface Props extends TabProps {
  state: DistributedState<number>;
}

export const TabComponent = createComponent('Tab', ({
  state,
  className,
  label,
  children,
}: Props) => {
  const id = useId();
  const { isValid, upsertTab } = useContext(TabsContext);

  if (!isValid) throw new Error('Tab must be a child of Tabs');

  useLayoutEffect(() => {
    upsertTab({
      id,
      hasLabel: label != null,
      Button: createComponent('TabButton', ({
        tabIndex,
      }: TabButtonProps) => {
        const { css, join } = useStyles();
        const { get, set, onChange } = useDistributedState(state);
        const [isFocused, setIsFocused] = useState(get() === tabIndex);

        onChange(newIndex => {
          if (newIndex !== tabIndex && isFocused) setIsFocused(false);
          if (newIndex === tabIndex && !isFocused) setIsFocused(true);
        });

        const selectTab = useBound(() => set(tabIndex));

        return (
          <Button onSelect={selectTab} className={join(css.tabButton, isFocused && css.isFocused)}>{label}</Button>
        );
      }),
      Content: createComponent('Tab', ({
        tabIndex,
      }: TabContentProps) => {
        const { onChange, get } = useDistributedState(state);
        const { css, join } = useStyles();
        const [isFocused, setIsFocused] = useState(get() === tabIndex);
        const directionRef = useRef('Right');

        onChange(newIndex => {
          directionRef.current = newIndex > tabIndex ? 'Left' : 'Right';
          if (newIndex !== tabIndex && isFocused) setIsFocused(false);
          if (newIndex === tabIndex && !isFocused) setIsFocused(true);
        });

        return (
          <Tag name="tab" className={join(css.tabContent, !isFocused && (css as MapOf<string>)[`slide${directionRef.current}`], isFocused && css.isVisible, className)}>
            {children}
          </Tag>
        );
      }),
    });
  }, [children, label]);

  return null;
});
