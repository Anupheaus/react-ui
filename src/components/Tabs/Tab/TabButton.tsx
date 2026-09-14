import type { ReactNode } from 'react';
import { useState } from 'react';
import type { DistributedState } from '../../../hooks';
import { useBound, useDistributedState } from '../../../hooks';
import { ThemeProvider, createStyles } from '../../../theme';
import { createComponent } from '../../Component';
import { Button } from '../../Button';

const useStyles = createStyles(({ tabs: { button } = {}, buttons: { default: { normal: { backgroundColor: activeButtonBackgroundColor } } }, pseudoClasses }, { toPx, applyTransition }) => {
  const stripColor = button?.stripColor ?? activeButtonBackgroundColor ?? 'rgba(0 0 0 / 5%)';
  const stripWidth = toPx(button?.stripWidth, '2px');
  const borderRadius = toPx(button?.borderRadius, '4px');

  return {
    tabButton: {
      [pseudoClasses.tablet]: {
        padding: '16px 24px !important',

        '&.is-focused': {
          backgroundColor: 'rgba(0 0 0 / 5%)',
        },
      },
    },
    tabButtonHorizontal: {
      borderRadius: `${borderRadius} ${borderRadius} 0 0 !important`,

      '&::after': {
        position: 'absolute',
        content: '""',
        inset: 0,
        borderBottomWidth: stripWidth,
        borderBottomColor: 'transparent',
        borderBottomStyle: 'solid',
        ...applyTransition('border-bottom-color'),
      },

      '&.is-focused::after': {
        borderBottomColor: stripColor,
      },
    },
    tabButtonVertical: {
      borderRadius: `${borderRadius} 0 0 ${borderRadius} !important`,

      '&::after': {
        position: 'absolute',
        content: '""',
        inset: 0,
        borderRightWidth: stripWidth,
        borderRightColor: 'transparent',
        borderRightStyle: 'solid',
        ...applyTransition('border-right-color'),
      },

      '&.is-focused::after': {
        borderRightColor: stripColor,
      },
    },
  };
});

interface Props {
  label: ReactNode;
  state: DistributedState<number>;
  tabIndex: number;
  testId?: string;
  orientation: 'horizontal' | 'vertical';
}

export const TabButton = createComponent('TabButton', ({
  label,
  state,
  tabIndex,
  testId,
  orientation,
}: Props) => {
  const { css, join, useAlterTheme } = useStyles();
  const { get, set, onChange } = useDistributedState(state);
  const [isFocused, setIsFocused] = useState(get() === tabIndex);

  onChange(newIndex => {
    if (newIndex !== tabIndex && isFocused) setIsFocused(false);
    if (newIndex === tabIndex && !isFocused) setIsFocused(true);
  });

  const selectTab = useBound(() => set(tabIndex));

  const buttonTheme = useAlterTheme(currentTheme => {
    const mergeWith = (style: Partial<typeof currentTheme.buttons.hover.normal>): Partial<typeof currentTheme.buttons.hover.normal> => ({
      ...style,
      backgroundColor: 'transparent',
    });
    return {
      buttons: {
        hover: {
          normal: mergeWith(currentTheme.buttons.hover.normal),
          active: mergeWith(currentTheme.buttons.hover.active),
          readOnly: mergeWith(currentTheme.buttons.hover.readOnly),
        },
      },
    };
  });

  return (
    <ThemeProvider theme={buttonTheme}>
      <Button onSelect={selectTab} variant="hover" className={join(css.tabButton, orientation === 'vertical' ? css.tabButtonVertical : css.tabButtonHorizontal, isFocused && 'is-focused')} testId={testId}>{label}</Button>
    </ThemeProvider>
  );
});
