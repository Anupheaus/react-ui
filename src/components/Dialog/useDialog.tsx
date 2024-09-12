import { ComponentProps, useContext, useMemo, useRef } from 'react';
import { useBound, useDelegatedBound, useId } from '../../hooks';
import { Button } from '../Button';
import { DialogContent } from './DialogContent';
import { DialogActions } from './DialogActions';
import { ReactUIComponent, createComponent } from '../Component';
import { Dialog as DialogComponent } from './Dialog';
import { DialogProps } from './Dialog';
import { DeferredPromise, InternalError, PromiseMaybe } from '@anupheaus/common';
import { useWindows } from '../Windows';
import { DialogManagerContext } from './DialogContexts';

export interface UseDialogApi {
  openDialog: () => Promise<string>;
  closeDialog: (reason?: string) => Promise<void>;
  Dialog: ReactUIComponent<(props: DialogProps) => JSX.Element>;
  DialogContent: ReactUIComponent<(props: ComponentProps<typeof DialogContent>) => JSX.Element>;
  DialogActions: ReactUIComponent<(props: ComponentProps<typeof DialogActions>) => JSX.Element>;
  OkButton: ReactUIComponent<(props: ComponentProps<typeof Button>) => JSX.Element>;
  CancelButton: ReactUIComponent<(props: ComponentProps<typeof Button>) => JSX.Element>;
}

function internalUseDialog(providedId?: string): UseDialogApi {
  const { isValid, id } = useContext(DialogManagerContext);
  if (!isValid) throw new InternalError('useDialog can only be used within a Dialogs component');
  const managerId = providedId ?? id;
  const { openWindow, closeWindow } = useWindows(managerId);
  const dialogId = useId();
  const dialogPromiseRef = useRef<DeferredPromise<string>>();
  const dialogCloseReasonRef = useRef<string>();

  const handleClosed = useDelegatedBound((onClosed?: (reason: string) => void) => (reason: string) => {
    dialogPromiseRef.current?.resolve(reason);
    dialogPromiseRef.current = undefined;
    onClosed?.(reason);
    dialogCloseReasonRef.current = undefined;
  });

  const Dialog: ReactUIComponent<(props: DialogProps) => JSX.Element> = useMemo(() => createComponent('Dialog', (props: DialogProps) => (
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

  const OkButton: ReactUIComponent<(props: ComponentProps<typeof Button>) => JSX.Element> = useMemo(() => createComponent('OkButton', (props: ComponentProps<typeof Button>) => (
    <Button {...props} onClick={handleClick('ok', props.onClick)}>{props.children ?? 'Okay'}</Button>
  )), []);

  const CancelButton: ReactUIComponent<(props: ComponentProps<typeof Button>) => JSX.Element> = useMemo(() => createComponent('CancelButton', (props: ComponentProps<typeof Button>) => (
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

export function useDialog(id?: string): UseDialogApi {
  return internalUseDialog(id);
}