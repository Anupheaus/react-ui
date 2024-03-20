import { ComponentProps, ReactNode, useMemo, useRef } from 'react';
import { useDialog } from './useDialog';
import { createComponent } from '../Component';
import { useBound, useOnUnmount, useUpdatableState } from '../../hooks';

interface ConfirmationDialogProps extends ComponentProps<ReturnType<typeof useDialog>['Dialog']> {
  okLabel?: ReactNode;
  hideOk?: boolean;
  cancelLabel?: ReactNode;
  hideCancel?: boolean;
}

export function useConfirmationDialog() {
  const { Dialog, DialogContent, DialogActions, OkButton, CancelButton, openDialog, closeDialog } = useDialog();
  const setConfirmationMessageRef = useRef<(message: ReactNode) => void>(() => void 0);

  const openConfirmDialog = useBound(async (confirmationMessage?: ReactNode) => {
    if (confirmationMessage != null) setConfirmationMessageRef.current(confirmationMessage);
    return (await openDialog()) === 'ok';
  });

  const ConfirmationDialog = useMemo(() => createComponent('ConfirmationDialog', ({
    children,
    okLabel = 'Yes',
    hideOk = false,
    cancelLabel = 'No',
    hideCancel = false,
    ...props
  }: ConfirmationDialogProps) => {
    const [message, setMessage] = useUpdatableState(() => children, [children]);
    setConfirmationMessageRef.current = setMessage;

    useOnUnmount(() => { setConfirmationMessageRef.current = () => void 0; });

    return (
      <Dialog {...props}>
        <DialogContent>
          {message}
        </DialogContent>
        <DialogActions>
          {!hideOk && (<OkButton>{okLabel}</OkButton>)}
          {!hideCancel && (<CancelButton>{cancelLabel}</CancelButton>)}
        </DialogActions>
      </Dialog>
    );
  }), []);

  return {
    ConfirmationDialog,
    openConfirmDialog,
    closeConfirmDialog: closeDialog,
  };
}