import { ComponentProps, FunctionComponent, useMemo, useRef } from 'react';
import { useDistributedState, useBound, useDelegatedBound, useId } from '../../hooks';
import { Button } from '../Button';
import { DialogContent } from './DialogContent';
import { DialogActions } from './DialogActions';
import { createComponent } from '../Component';
import { Dialog as DialogComponent } from './Dialog';
import { DialogState } from './InternalDialogModels';
import { DialogProps } from './Dialog';
import { PromiseState } from '@anupheaus/common';

export interface UseDialogApi {
  openDialog(): Promise<string>;
  closeDialog(reason?: string): void;
  Dialog: FunctionComponent<DialogProps>;
  DialogContent: typeof DialogContent;
  DialogActions: typeof DialogActions;
  OkButton: typeof Button;
}

export function useDialog(): UseDialogApi {
  const dialogId = useId();
  const { state, set } = useDistributedState<DialogState>(() => ({ isOpen: false }));
  const dialogPromise = useRef(useMemo(() => Promise.createDeferred<string>(), []));

  const Dialog = useMemo(() => createComponent('Dialog', (props: DialogProps) => (
    <DialogComponent {...props} id={dialogId} state={state} />
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
    <Button {...props} onClick={handleClick('Ok', props.onClick)}>{props.children ?? 'Okay'}</Button>
  )), []);

  return {
    openDialog,
    closeDialog,
    Dialog,
    DialogContent,
    DialogActions,
    OkButton,
  };
}