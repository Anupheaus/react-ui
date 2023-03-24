import { Popover, PopoverOrigin, PopoverProps } from '@mui/material';
import { MutableRefObject, useMemo } from 'react';
import { useBound } from '../../hooks';
import { createStyles, ThemesProvider } from '../../theme';
import { Button, IconButtonTheme } from '../Button';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { GridTheme } from './GridTheme';

const useStyles = createStyles(({ useTheme, createThemeVariant }) => {
  const { headers: { backgroundColor, textColor } } = useTheme(GridTheme);
  return {
    styles: {
      popover: {
        pointerEvents: 'none',
      },
      paper: {
        pointerEvents: 'all',
        backgroundColor,
        color: textColor,
        padding: 4,
      },
    },
    variants: {
      iconButtonTheme: createThemeVariant(IconButtonTheme, {
        borderRadius: '4px',
        backgroundColor: 'transparent',
        activeBackgroundColor: 'rgba(0 0 0 / 20%)',
      }),
    },
  };
});

interface Props {
  elementRef: MutableRefObject<HTMLDivElement | null>;
  isVisible: boolean;
}

export const GridActions = createComponent('GridActions', ({
  elementRef,
  isVisible,
}: Props) => {
  const { css, variants, join } = useStyles();

  const classes = useMemo<PopoverProps['classes']>(() => ({
    root: css.popover,
    paper: css.paper,
  }), []);

  const anchorOrigin = useMemo<PopoverOrigin>(() => ({
    horizontal: 'right',
    vertical: 'top',
  }), []);

  const transformOrigin = useMemo<PopoverOrigin>(() => ({
    horizontal: 'right',
    vertical: 'bottom',
  }), []);

  const handleRefresh = useBound(() => {
    // do nothing
  });

  return (
    <Popover
      open={isVisible}
      classes={classes}
      anchorEl={elementRef.current}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      transitionDuration={400}
      hideBackdrop
      disableEnforceFocus
    >
      <ThemesProvider themes={join(variants.iconButtonTheme)}>
        <Flex tagName="grid-actions" gap={2}>
          <Button onSelect={handleRefresh}><Icon name="grid-column-selection" /></Button>
          <Button onSelect={handleRefresh}><Icon name="grid-refresh" /></Button>
        </Flex>
      </ThemesProvider>
    </Popover>
  );
});