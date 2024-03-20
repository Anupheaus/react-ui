import { ReactNode, useState } from 'react';
import { DistributedState, useBound, useDistributedState } from '../../../hooks';
import { createStyles } from '../../../theme';
import { createComponent } from '../../Component';
import { Button } from '../../Button';

const useStyles = createStyles(() => ({
  tabButton: {
    paddingLeft: 16,
    paddingRight: 16,

    '&::after': {
      position: 'absolute',
      content: '""',
      inset: 0,
      // borderBottomWidth: inactiveTab.highlightHeight,
      // borderBottomColor: inactiveTab.highlightColor,
      borderBottomStyle: 'solid',
      transitionProperty: 'border-bottom-width, border-bottom-color',
      transitionDuration: '400ms',
      transitionTimingFunction: 'ease',
    },

    '&.is-visible::after': {
      // borderBottomWidth: activeTab.highlightHeight,
      // borderBottomColor: activeTab.highlightColor,
    },
  },
}));

interface Props {
  label: ReactNode;
  state: DistributedState<number>;
  tabIndex: number;
}

export const TabButton = createComponent('TabButton', ({
  label,
  state,
  tabIndex,
}: Props) => {
  const { css, join } = useStyles();
  const { get, set, onChange } = useDistributedState(state);
  const [isFocused, setIsFocused] = useState(get() === tabIndex);

  onChange(newIndex => {
    if (newIndex !== tabIndex && isFocused) setIsFocused(false);
    if (newIndex === tabIndex && !isFocused) setIsFocused(true);
  });

  const selectTab = useBound(() => set(tabIndex));

  return (
    <Button onSelect={selectTab} className={join(css.tabButton, isFocused && 'is-visible')}>{label}</Button>
  );
});
