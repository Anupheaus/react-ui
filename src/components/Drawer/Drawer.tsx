import type { ReactNode} from 'react';
import { useMemo } from 'react';
import { useBound } from '../../hooks/useBound';
import { createComponent } from '../Component';
import type { DrawerProps as MuiDrawerProps, ModalProps } from '@mui/material';
import { Drawer as MuiDrawer, AppBar, Toolbar } from '@mui/material';
import type { DistributedState} from '../../hooks';
import { useDistributedState } from '../../hooks';
import { Button } from '../Button';
import { Flex } from '../Flex';
import { createStyles } from '../../theme';
import { Icon } from '../Icon';

type DrawerCloseReasons = Parameters<Required<ModalProps>['onClose']>[1] | 'drawerClosed';

export interface DrawerProps {
  className?: string;
  headerActions?: ReactNode;
  title?: ReactNode;
  /** Which edge the drawer slides in from. `'bottom'` renders a full-width bottom-sheet (mobile-friendly). Defaults to `'right'`. */
  position?: 'right' | 'bottom';
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  children?: ReactNode;
  onClose?(reason: DrawerCloseReasons): boolean | void;
}

interface Props extends DrawerProps {
  state: DistributedState<boolean>;
}

const useStyles = createStyles(({ toolbar }) => ({
  drawer: {
    // contentBackgroundColor,
    // color: textColor,
  },
  drawerRight: {
    minWidth: 400,
  },
  drawerBottom: {
    minWidth: 0,
    width: '100%',
    maxHeight: '85vh',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  drawerTitle: {
    gap: 12,
    padding: '0 12px !important',
    // Header colour comes from the app theme — matching the window title bar (`theme.toolbar`)
    // rather than MUI's default primary (blue) AppBar. The AppBar itself is made transparent below
    // so this background (the window-title background colour) is what shows.
    backgroundColor: toolbar.normal.backgroundColor,
    color: toolbar.normal.color,
  },
  drawerTitleText: {
    color: toolbar.normal.color,
  },
  closeDrawerButton: {
    marginRight: 8,
  },
}));

export const Drawer = createComponent('Drawer', ({
  className,
  title,
  headerActions,
  position = 'right',
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
    paper: join(css.drawer, position === 'bottom' ? css.drawerBottom : css.drawerRight, className),
  }), [className, position]);

  const close = useBound((_event?: {}, standardReason: DrawerCloseReasons = 'drawerClosed') => {
    if (standardReason === 'backdropClick' && disableBackdropClick === true) return;
    if (standardReason === 'escapeKeyDown' && disableEscapeKeyDown === true) return;
    if (onClose?.(standardReason) === false) return;
    setOpenState(false);
  });

  return (
    <MuiDrawer
      open={getOpenState()}
      onClose={close}
      anchor={position}
      classes={drawerClasses}
      {...props}

    >
      <AppBar position="static" color="transparent" elevation={0}>
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
