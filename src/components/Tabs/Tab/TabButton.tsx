import type { ReactNode } from 'react';
import { useState } from 'react';
import type { DistributedState } from '../../../hooks';
import { useBound, useDistributedState } from '../../../hooks';
import { ThemeProvider, createStyles } from '../../../theme';
import { createComponent } from '../../Component';
import { Button } from '../../Button';

const useStyles = createStyles(({ tabs: { button } = {}, buttons: { default: { normal: { backgroundColor: activeButtonBackgroundColor } } }, pseudoClasses }, { toPx, applyTransition }) => {

  return {
    tabButton: {
      borderRadius: `${toPx(button?.borderRadius, '4px')} ${toPx(button?.borderRadius, '4px')} 0 0 !important`,

      '&::after': {
        position: 'absolute',
        content: '""',
        inset: 0,
        borderBottomWidth: toPx(button?.stripWidth, '2px'),
        borderBottomColor: 'transparent',
        borderBottomStyle: 'solid',
        ...applyTransition('border-bottom-color'),
      },

      '&.is-focused::after': {
        borderBottomColor: button?.stripColor ?? activeButtonBackgroundColor ?? 'rgba(0 0 0 / 5%)',
      },

      [pseudoClasses.tablet]: {
        padding: '16px 24px !important',

        '&.is-focused': {
          backgroundColor: 'rgba(0 0 0 / 5%)',
        },
      },

      // [pseudoClasses.active]: {
      //   backgroundColor: button?.active?.backgroundColor ?? defaultButton.active.backgroundColor ?? button?.normal?.backgroundColor ?? defaultButton.normal.backgroundColor,
      //   color: button?.active?.textColor ?? defaultButton.active.textColor ?? button?.normal?.textColor ?? defaultButton.normal.textColor,
      //   fontSize: button?.active?.textSize ?? defaultButton.normal.textSize ?? button?.normal?.textSize ?? defaultButton.normal.textSize,
      //   borderColor: button?.active?.borderColor ?? defaultButton.active.borderColor ?? button?.normal?.borderColor ?? defaultButton.normal.borderColor,
      //   borderRadius: 0,

      //   '&:first-of-type': {
      //     borderRadius: '4px 0 0',
      //   },

      //   '&:last-of-type': {
      //     borderRadius: '0 4px 0 0',
      //   },

      //   '&.is-focused': {
      //     backgroundColor: backgroundColorOfFocusedAndActiveTabButton,
      //     color: valueOf(button).using('focusedAndActive', 'focused', 'normal').andProperty('textColor') ?? defaultButton.active.textColor ?? defaultButton.normal.textColor,
      //     fontSize: valueOf(button).using('focusedAndActive', 'focused', 'normal').andProperty('textSize') ?? defaultButton.active.textSize ?? defaultButton.normal.textSize,
      //     borderColor: valueOf(button).using('focusedAndActive', 'focused', 'normal').andProperty('borderColor') ?? defaultButton.active.borderColor ?? defaultButton.normal.borderColor,

      //     '&::after': {
      //       borderBottomWidth: valueOf(button).using('focused', 'active', 'normal').andProperty('stripWidth', '2px'),
      //       borderBottomColor: valueOf(button).using('focused', 'active', 'normal').andProperty('stripColor', 'rgba(255 255 255 / 80%)'),
      //     },
      //   },
      // },      
    },
  };
});

interface Props {
  label: ReactNode;
  state: DistributedState<number>;
  tabIndex: number;
  testId?: string;
}

export const TabButton = createComponent('TabButton', ({
  label,
  state,
  tabIndex,
  testId,
}: Props) => {
  const { css, join, alterTheme } = useStyles();
  const { get, set, onChange } = useDistributedState(state);
  const [isFocused, setIsFocused] = useState(get() === tabIndex);

  onChange(newIndex => {
    if (newIndex !== tabIndex && isFocused) setIsFocused(false);
    if (newIndex === tabIndex && !isFocused) setIsFocused(true);
  });

  const selectTab = useBound(() => set(tabIndex));

  const buttonTheme = alterTheme(currentTheme => {
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
      <Button onSelect={selectTab} variant="hover" className={join(css.tabButton, isFocused && 'is-focused')} testId={testId}>{label}</Button>
    </ThemeProvider>
  );
});
