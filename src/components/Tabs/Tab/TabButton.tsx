import type { ReactNode } from 'react';
import { useState } from 'react';
import type { DistributedState } from '../../../hooks';
import { useBound, useDistributedState } from '../../../hooks';
import { ThemeProvider, createStyles } from '../../../theme';
import { createComponent } from '../../Component';
import { Button } from '../../Button';
import { Flex } from '../../Flex';
import type { TabsVariant } from '../Tabs';

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
    // Navigation variant: an equal-width, icon-over-label item that reads as a mobile nav button.
    // The active tab keeps a subtle "pressed" background (the same feel as tapping it) rather than
    // fading the inactive tabs — every tab stays at full strength.
    tabButtonNav: {
      flex: '1 1 0 !important',
      minWidth: '0 !important',
      borderRadius: '0 !important',
      padding: '8px 6px !important',
      ...applyTransition('background-color'),

      '&.is-focused': {
        backgroundColor: 'rgba(0 0 0 / 8%) !important',
      },

      [pseudoClasses.tablet]: {
        padding: '12px 8px !important',
      },
    },
    navContent: {
      lineHeight: 1.1,
    },
    navLabel: {
      fontSize: 11,
      fontWeight: 600,
      textAlign: 'center',
    },
  };
});

interface Props {
  label: ReactNode;
  icon?: ReactNode;
  state: DistributedState<number>;
  tabIndex: number;
  testId?: string;
  orientation: 'horizontal' | 'vertical';
  variant: TabsVariant;
}

export const TabButton = createComponent('TabButton', ({
  label,
  icon,
  state,
  tabIndex,
  testId,
  orientation,
  variant,
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

  const isNavigation = variant === 'navigation';
  const buttonClassName = isNavigation
    ? join(css.tabButtonNav, isFocused && 'is-focused')
    : join(css.tabButton, orientation === 'vertical' ? css.tabButtonVertical : css.tabButtonHorizontal, isFocused && 'is-focused');

  return (
    <ThemeProvider theme={buttonTheme}>
      <Button onSelect={selectTab} variant="hover" className={buttonClassName} testId={testId}>
        {isNavigation ? (
          <Flex tagName="tab-nav-content" isVertical alignCentrally gap={3} className={css.navContent}>
            {icon}
            {label != null && <Flex tagName="tab-nav-label" disableGrow className={css.navLabel}>{label}</Flex>}
          </Flex>
        ) : label}
      </Button>
    </ThemeProvider>
  );
});
