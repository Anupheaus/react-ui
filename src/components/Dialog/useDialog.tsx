import { ComponentProps, useMemo, useRef } from 'react';
import { useDistributedState, useBound, useDelegatedBound, useId } from '../../hooks';
import { Button } from '../Button';
import { DialogContent } from './DialogContent';
import { DialogActions } from './DialogActions';
import { createComponent } from '../Component';
import { Dialog as DialogComponent } from './Dialog';
import { DialogState } from './InternalDialogModels';
import { DialogProps } from './Dialog';
import { PromiseState } from '@anupheaus/common';

function internalUseDialog() {
  const dialogId = useId();
  const { state, set } = useDistributedState<DialogState>(() => ({ isOpen: false }));
  const dialogPromise = useRef(useMemo(() => Promise.createDeferred<string>(), []));

  const handleClosed = useDelegatedBound((onClosed?: (reason: string) => void) => (reason: string) => {
    dialogPromise.current.resolve(reason);
    onClosed?.(reason);
  });

  const Dialog = useMemo(() => createComponent('Dialog', (props: DialogProps) => (
    <DialogComponent {...props} id={dialogId} state={state} onClosed={handleClosed(props.onClosed)} />
  )), []);

  const openDialog = useBound(() => {
    if (dialogPromise.current.state !== PromiseState.Pending) dialogPromise.current = Promise.createDeferred();
    set({ isOpen: true });
    return dialogPromise.current;
  });

  const closeDialog = useBound((reason?: string) => set({ isOpen: false, closeReason: reason }));

  const handleClick = useDelegatedBound((buttonId: string, onClick?: (...args: any[]) => void) => () => {
    closeDialog(buttonId);
    onClick?.();
  });

  const OkButton = useMemo(() => createComponent('OkButton', (props: ComponentProps<typeof Button>) => (
    <Button {...props} onClick={handleClick('ok', props.onClick)}>{props.children ?? 'Okay'}</Button>
  )), []);

  const CancelButton = useMemo(() => createComponent('CancelButton', (props: ComponentProps<typeof Button>) => (
    <Button {...props} onClick={handleClick('cancel', props.onClick)}>{props.children ?? 'Cancel'}</Button>
  )), []);

  return {
    openDialog,
    closeDialog,
    Dialog,
    DialogContent,
    DialogActions,
    OkButton,
    CancelButton,
  };
}

export type UseDialogApi = ReturnType<typeof internalUseDialog>;

export function useDialog(): UseDialogApi {
  return internalUseDialog();
}