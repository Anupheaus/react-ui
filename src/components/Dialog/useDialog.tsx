import { ComponentProps, useMemo, useRef } from 'react';
import { useBound, useDelegatedBound, useId } from '../../hooks';
import { Button } from '../Button';
import { DialogContent } from './DialogContent';
import { DialogActions } from './DialogActions';
import { createComponent } from '../Component';
import { Dialog as DialogComponent } from './Dialog';
import { defaultDialogManagerId } from './InternalDialogModels';
import { DialogProps } from './Dialog';
import { DeferredPromise, PromiseMaybe } from '@anupheaus/common';
import { useWindows } from '../Windows';

function internalUseDialog(id = defaultDialogManagerId) {
  const { openWindow, closeWindow } = useWindows(id);
  const dialogId = useId();
  const dialogPromiseRef = useRef<DeferredPromise<string>>();
  const dialogCloseReasonRef = useRef<string>();

  const handleClosed = useDelegatedBound((onClosed?: (reason: string) => void) => (reason: string) => {
    dialogPromiseRef.current?.resolve(reason);
    dialogPromiseRef.current = undefined;
    onClosed?.(reason);
    dialogCloseReasonRef.current = undefined;
  });

  const Dialog = useMemo(() => createComponent('Dialog', (props: DialogProps) => (
    <DialogComponent {...props} id={dialogId} managerId={id} closeReasonRef={dialogCloseReasonRef} onClosed={handleClosed(props.onClosed)} />
  )), []);

  const openDialog = useBound(async () => {
    if (dialogPromiseRef.current != null) return dialogPromiseRef.current;
    dialogPromiseRef.current = new DeferredPromise<string>();
    openWindow({ id: dialogId, type: 'dialog' });
    return dialogPromiseRef.current;
  });

  const closeDialog = useBound(async (reason?: string) => {
    if (dialogPromiseRef.current == null) return; // the dialog is not open
    dialogCloseReasonRef.current = reason ?? 'close';
    await closeWindow(dialogId);
  });

  const handleClick = useDelegatedBound((buttonId: string, onClick?: (...args: any[]) => PromiseMaybe<unknown>) => async () => {
    await Promise.whenAllSettled([closeDialog(buttonId), onClick?.() as Promise<unknown>].removeNull());
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

export function useDialog(id?: string): UseDialogApi {
  return internalUseDialog(id);
}