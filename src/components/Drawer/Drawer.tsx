import { ReactNode, useMemo } from 'react';
import { useBound } from '../../hooks/useBound';
import { createComponent } from '../Component';
import { Drawer as MuiDrawer, AppBar, Toolbar, DrawerProps as MuiDrawerProps, ModalProps } from '@mui/material';
import { DistributedState, useDistributedState } from '../../hooks';
import { Button } from '../Button';
import { Flex } from '../Flex';
import { createStyles } from '../../theme';
import { Icon } from '../Icon';

type DrawerCloseReasons = Parameters<Required<ModalProps>['onClose']>[1] | 'drawerClosed';

export interface DrawerProps {
  className?: string;
  headerActions?: ReactNode;
  title?: ReactNode;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  children?: ReactNode;
  onClose?(reason: DrawerCloseReasons): boolean | void;
}

interface Props extends DrawerProps {
  state: DistributedState<boolean>;
}

const useStyles = createStyles({
  drawer: {
    minWidth: 400,
    // contentBackgroundColor,
    // color: textColor,
  },
  drawerTitle: {
    gap: 12,
    padding: '0 12px !important',
    // fontSize,
    // fontWeight,
    // color: headerTextColor,
    // backgroundColor: headerBackgroundColor,
  },
  drawerTitleText: {
    // color: headerTextColor,
    // fontSize,
    // fontWeight,
  },
  closeDrawerButton: {
    marginRight: 8,
  },
});

export const Drawer = createComponent('Drawer', ({
  className,
  title,
  headerActions,
  disableBackdropClick,
  disableEscapeKeyDown,
  state,
  onClose,
  children = null,
  ...props
}: Props) => {
  const { css, join } = useStyles();
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
          <Button onClick={close}><Icon name="drawer-close" /></Button>
          <Flex tagName="drawer-title-text" className={css.drawerTitleText}>
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
});
