import { ComponentProps, ReactNode, useMemo, useRef } from 'react';
import { useDialog } from './useDialog';
import { createComponent } from '../Component';
import { useBound, useOnUnmount, useUpdatableState } from '../../hooks';

interface ConfirmationDialogProps extends ComponentProps<ReturnType<typeof useDialog>['Dialog']> {
  okLabel?: ReactNode;
  cancelLabel?: ReactNode;
}

export function useConfirmationDialog() {
  const { Dialog, DialogContent, DialogActions, OkButton, CancelButton, openDialog } = useDialog();
  const setConfirmationMessageRef = useRef<(message: ReactNode) => void>(() => void 0);

  const openConfirmDialog = useBound(async (confirmationMessage?: ReactNode) => {
    if (confirmationMessage != null) setConfirmationMessageRef.current(confirmationMessage);
    return (await openDialog()) === 'ok';
  });

  const ConfirmationDialog = useMemo(() => createComponent('ConfirmationDialog', ({
    children,
    okLabel = 'Yes',
    cancelLabel = 'No',
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
          <OkButton>{okLabel}</OkButton>
          <CancelButton>{cancelLabel}</CancelButton>
        </DialogActions>
      </Dialog>
    );
  }), []);

  return {
    ConfirmationDialog,
    openConfirmDialog,
  };
}