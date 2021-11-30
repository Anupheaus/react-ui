import { MutableRefObject, ReactNode, useMemo } from 'react';
import { Dialog as MuiDialog, DialogTitle, DialogProps as MuiDialogProps } from '@material-ui/core';
import { anuxPureFC } from '../anuxComponents';
import { useBound } from '../useBound';
import { useForceUpdate } from '../useForceUpdate';

export interface DialogProps {
  className?: string;
  title?: ReactNode;
}

export interface DialogState {
  isOpen: boolean;
  openDialog(): void;
  closeDialog(): void;
}

interface InternalProps extends DialogProps {
  state: MutableRefObject<DialogState>;
}

export const Dialog = anuxPureFC<InternalProps>('Dialog', ({
  className,
  title,
  state,
  children = null,
}) => {
  const update = useForceUpdate();

  state.current.openDialog = useBound(() => { state.current.isOpen = true; update(); });
  const close = state.current.closeDialog = useBound(() => { state.current.isOpen = false; update(); });

  const dialogClasses = useMemo<MuiDialogProps['classes']>(() => ({
    paper: className,
  }), [className]);

  return (
    <MuiDialog
      open={state.current.isOpen}
      onClose={close}
      classes={dialogClasses}
    >
      {title != null && <DialogTitle>{title}</DialogTitle>}
      {children}
    </MuiDialog>
  );
});
