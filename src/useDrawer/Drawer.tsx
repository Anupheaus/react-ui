import { ReactNode, useMemo } from 'react';
import { useBound } from '../useBound';
import { useDistributedState } from '../DistributedState';
import { anuxPureFC } from '../anuxComponents';
import { theme } from '../theme';
import { Icon, IconNameType } from '../components';
import { DistributedDrawerState } from './DistributedDrawerState';
import { Drawer as MuiDrawer, AppBar, Toolbar, IconButton, Typography, DrawerProps as MuiDrawerProps, ModalProps } from '@mui/material';

const useStyles = theme.createStyles({
  drawer: {
    minWidth: 400,
  },
  closeDrawerButton: {
    marginRight: 8,
  },
});

type DrawerCloseReasons = Parameters<Required<ModalProps>['onClose']>[1] | 'drawerClosed';

interface Props extends Partial<Omit<MuiDrawerProps, 'title' | 'ref'>> {
  headerActions?: ReactNode;
  title?: ReactNode;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  closeIconName?: IconNameType;
  onClose?(reason: DrawerCloseReasons): boolean | void;
}

export const Drawer = anuxPureFC<Props>('Drawer', ({
  className,
  title,
  headerActions,
  disableBackdropClick,
  enableLogging,
  logging: {
    verbose,
  },
  disableEscapeKeyDown,
  closeIconName = 'MdArrowForward',
  onClose,
  children = null,
  ...props
}) => {
  const { classes, join } = useStyles();
  const { getAndObserve: getOpenState, set: changeOpenState } = useDistributedState(DistributedDrawerState);

  const drawerClasses = useMemo<Props['classes']>(() => ({
    paper: join(classes.drawer, className),
  }), []);

  const close = useBound((event?: {}, standardReason: DrawerCloseReasons = 'drawerClosed') => {
    verbose('Closing drawer', { event, standardReason });
    if (standardReason === 'backdropClick' && disableBackdropClick === true) return;
    if (standardReason === 'escapeKeyDown' && disableEscapeKeyDown === true) return;
    if (onClose?.(standardReason) === false) {
      verbose('called onClose and false was returned, indicating preventDefault, so returning without changing state.');
      return;
    }
    changeOpenState(false);
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
        <Toolbar>
          <IconButton edge="start" className={classes.closeDrawerButton} aria-label="menu" onClick={close}>
            <Icon name={closeIconName} />
          </IconButton>
          <div className={classes.flex.auto}>
            <Typography variant="h6" className={join(classes.flex.auto, classes.cursor.pointer)}>
              {title}
            </Typography>
            <div className={classes.flex.none.vertical}>
              {headerActions}
            </div>
          </div>
        </Toolbar>
      </AppBar>
      {children}
    </MuiDrawer>
  );
});
