import { ReactNode, useState } from 'react';
import { DistributedState, useBound, useDistributedState } from '../../../hooks';
import { ThemeProvider, createStyles } from '../../../theme';
import { createComponent } from '../../Component';
import { Button } from '../../Button';

const useStyles = createStyles(({ pseudoClasses, tabs, buttons: { default: defaultButton } }, { toPx, applyTransition, valueOf }) => ({
  tabButton: {
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 0,
    backgroundColor: tabs?.buttons?.normal?.backgroundColor ?? defaultButton.normal.backgroundColor,
    color: tabs?.buttons?.normal?.textColor ?? defaultButton.normal.textColor,
    fontSize: tabs?.buttons?.normal?.textSize ?? defaultButton.normal.textSize,
    borderColor: tabs?.buttons?.normal?.borderColor ?? defaultButton.normal.borderColor,

    '&:first-of-type': {
      borderRadius: `${toPx(tabs?.buttons?.normal?.borderRadius ?? defaultButton.normal.borderRadius, '4px')} 0 0`,
    },

    '&:last-of-type': {
      borderRadius: `0 ${toPx(tabs?.buttons?.normal?.borderRadius ?? defaultButton.normal.borderRadius, '4px')} 0 0`,
    },

    '&::after': {
      position: 'absolute',
      content: '""',
      inset: 0,
      ...applyTransition('border-bottom-width, border-bottom-color, border-top-width, border-top-color'),
      ...((tabs?.buttons?.normal?.activeStripPosition ?? 'bottom') === 'bottom' ? {
        borderBottomWidth: tabs?.buttons?.normal?.activeStripWidth ?? '2px',
        borderBottomColor: tabs?.buttons?.normal?.activeStripColor,
        borderBottomStyle: 'solid',
      } : {
        borderTopWidth: tabs?.buttons?.normal?.activeStripWidth ?? '2px',
        borderTopColor: tabs?.buttons?.normal?.activeStripColor,
        borderTopStyle: 'solid',
      }),
    },

    '&.is-focused': {
      backgroundColor: valueOf(tabs?.buttons).using('focused', 'normal').andProperty('backgroundColor', defaultButton.normal.backgroundColor),
      color: valueOf(tabs?.buttons).using('focused', 'normal').andProperty('textColor') ?? defaultButton.normal.textColor,
      fontSize: valueOf(tabs?.buttons).using('focused', 'normal').andProperty('textSize') ?? defaultButton.normal.textSize,
      borderColor: valueOf(tabs?.buttons).using('focused', 'normal').andProperty('borderColor') ?? defaultButton.normal.borderColor,

      '&::after': {
        ...(valueOf(tabs?.buttons).using('focused', 'normal').andProperty('activeStripPosition', 'bottom') === 'bottom' ? {
          borderBottomWidth: valueOf(tabs?.buttons).using('focused', 'normal').andProperty('activeStripWidth', '2px'),
          borderBottomColor: valueOf(tabs?.buttons).using('focused', 'normal').andProperty('activeStripColor', 'rgba(255 255 255 / 80%)'),
        } : {
          borderTopWidth: valueOf(tabs?.buttons).using('focused', 'normal').andProperty('activeStripWidth', '2px'),
          borderTopColor: valueOf(tabs?.buttons).using('focused', 'normal').andProperty('activeStripColor', 'rgba(255 255 255 / 80%)'),
        }),
      },
    },

    [pseudoClasses.active]: {
      backgroundColor: tabs?.buttons?.active?.backgroundColor ?? defaultButton.active.backgroundColor ?? tabs?.buttons?.normal?.backgroundColor ?? defaultButton.normal.backgroundColor,
      color: tabs?.buttons?.active?.textColor ?? defaultButton.active.textColor ?? tabs?.buttons?.normal?.textColor ?? defaultButton.normal.textColor,
      fontSize: tabs?.buttons?.active?.textSize ?? defaultButton.normal.textSize ?? tabs?.buttons?.normal?.textSize ?? defaultButton.normal.textSize,
      borderColor: tabs?.buttons?.active?.borderColor ?? defaultButton.active.borderColor ?? tabs?.buttons?.normal?.borderColor ?? defaultButton.normal.borderColor,
      borderRadius: 0,

      '&:first-of-type': {
        borderRadius: '4px 0 0',
      },

      '&:last-of-type': {
        borderRadius: '0 4px 0 0',
      },

      '&.is-focused': {
        backgroundColor: valueOf(tabs?.buttons).using('focusedAndActive', 'focused', 'normal').andProperty('backgroundColor', defaultButton.active.backgroundColor ?? defaultButton.normal.backgroundColor),
        color: valueOf(tabs?.buttons).using('focusedAndActive', 'focused', 'normal').andProperty('textColor') ?? defaultButton.active.textColor ?? defaultButton.normal.textColor,
        fontSize: valueOf(tabs?.buttons).using('focusedAndActive', 'focused', 'normal').andProperty('textSize') ?? defaultButton.active.textSize ?? defaultButton.normal.textSize,
        borderColor: valueOf(tabs?.buttons).using('focusedAndActive', 'focused', 'normal').andProperty('borderColor') ?? defaultButton.active.borderColor ?? defaultButton.normal.borderColor,

        '&::after': {
          ...(valueOf(tabs?.buttons).using('focused', 'active', 'normal').andProperty('activeStripPosition', 'bottom') === 'bottom' ? {
            borderBottomWidth: valueOf(tabs?.buttons).using('focused', 'active', 'normal').andProperty('activeStripWidth', '2px'),
            borderBottomColor: valueOf(tabs?.buttons).using('focused', 'active', 'normal').andProperty('activeStripColor', 'rgba(255 255 255 / 80%)'),
          } : {
            borderTopWidth: valueOf(tabs?.buttons).using('focused', 'active', 'normal').andProperty('activeStripWidth', '2px'),
            borderTopColor: valueOf(tabs?.buttons).using('focused', 'active', 'normal').andProperty('activeStripColor', 'rgba(255 255 255 / 80%)'),
          }),
        },
      },
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
  const { css, join, alterTheme } = useStyles();
  const { get, set, onChange } = useDistributedState(state);
  const [isFocused, setIsFocused] = useState(get() === tabIndex);

  onChange(newIndex => {
    if (newIndex !== tabIndex && isFocused) setIsFocused(false);
    if (newIndex === tabIndex && !isFocused) setIsFocused(true);
  });

  const selectTab = useBound(() => set(tabIndex));

  const buttonTheme = alterTheme(currentTheme => ({
    buttons: {
      default: {
        normal: isFocused ? currentTheme.tabs?.buttons?.focused : currentTheme.tabs?.buttons?.normal,
        active: isFocused ? currentTheme.tabs?.buttons?.focusedAndActive : currentTheme.tabs?.buttons?.active,
        readOnly: currentTheme.tabs?.buttons?.readOnly,
      },
    }
  }));

  return (
    <ThemeProvider theme={buttonTheme}>
      <Button onSelect={selectTab} className={join(css.tabButton, isFocused && 'is-focused')}>{label}</Button>
    </ThemeProvider>
  );
});
