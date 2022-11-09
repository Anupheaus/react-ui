import { ReactNode, useMemo } from 'react';
import { useBound } from '../../hooks/useBound';
import { createComponent } from '../Component';
import { Drawer as MuiDrawer, AppBar, Toolbar, DrawerProps as MuiDrawerProps, ModalProps } from '@mui/material';
import { DistributedState, useDistributedState } from '../../hooks';
import { DrawerTheme } from './DrawerTheme';
import { Button } from '../Button';
import { Flex } from '../Flex';
import { IconType } from '../Icon';
import { FiX } from 'react-icons/fi';

type DrawerCloseReasons = Parameters<Required<ModalProps>['onClose']>[1] | 'drawerClosed';

export interface DrawerProps {
  className?: string;
  headerActions?: ReactNode;
  title?: ReactNode;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  children?: ReactNode;
  closeIcon?: IconType;
  onClose?(reason: DrawerCloseReasons): boolean | void;
}

interface Props extends DrawerProps {
  state: DistributedState<boolean>;
}

export const Drawer = createComponent({
  id: 'Drawer',
  styles: ({ useTheme }) => {
    const { definition: { titleBackgroundColor, titleTextColor, titleFontSize, titleFontWeight, backgroundColor, textColor } } = useTheme(DrawerTheme);
    return {
      styles: {
        drawer: {
          minWidth: 400,
          backgroundColor,
          color: textColor,
        },
        drawerTitle: {
          gap: 12,
          padding: '0 12px !important',
          fontSize: titleFontSize,
          fontWeight: titleFontWeight,
          color: titleTextColor,
          backgroundColor: titleBackgroundColor,
        },
        closeDrawerButton: {
          marginRight: 8,
        },
      },
    };
  },

  render({
    className,
    title,
    headerActions,
    disableBackdropClick,
    disableEscapeKeyDown,
    state,
    closeIcon = FiX,
    onClose,
    children = null,
    ...props
  }: Props, { css, join }) {
    const { getAndObserve: getOpenState, set: setOpenState } = useDistributedState(state);

    const drawerClasses = useMemo<MuiDrawerProps['classes']>(() => ({
      paper: join(css.drawer, className),
    }), [className]);

    const close = useBound((event?: {}, standardReason: DrawerCloseReasons = 'drawerClosed') => {
      if (standardReason === 'backdropClick' && disableBackdropClick === true) return;
      if (standardReason === 'escapeKeyDown' && disableEscapeKeyDown === true) return;
      if (onClose?.(standardReason) === false) return;
      setOpenState(false);
    });

    return (
      <MuiDrawer
        open={getOpenState()}
        onClose={close}
        anchor="right"
        classes={drawerClasses}
        {...props}

      >
        <AppBar position="static">
          <Toolbar className={css.drawerTitle}>
            <Button icon={closeIcon} onClick={close} />
            <Flex tagName="drawer-title-text">
              {title}
            </Flex>
            <Flex tagName="drawer-title-actions" gap={12}>
              {headerActions}
            </Flex>
          </Toolbar>
        </AppBar>
        {children}
      </MuiDrawer>
    );
  },
});
