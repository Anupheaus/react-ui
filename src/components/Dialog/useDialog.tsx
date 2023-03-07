import { ComponentProps, FunctionComponent, useMemo } from 'react';
import { useDistributedState, useBound, useDelegatedBound } from '../../hooks';
import { Button } from '../Button';
import { DialogContent } from './DialogContent';
import { DialogActions } from './DialogActions';
import { createComponent } from '../Component';
import { DialogContainer } from './DialogContainer';
import { DialogState } from './InternalDialogModels';
import { DialogProps } from './Dialog';

export interface UseDialogApi {
  openDialog(): void;
  closeDialog(): void;
  Dialog: FunctionComponent<DialogProps>;
  DialogContent: typeof DialogContent;
  DialogActions: typeof DialogActions;
  OkButton: typeof Button;
}

export function useDialog(): UseDialogApi {
  const { state, set } = useDistributedState<DialogState>(() => ({ isOpen: false }));
  // const { setActions, close } = useActions<DialogActionsType>();

  const Dialog = useMemo(() => createComponent('Dialog', (props: DialogProps) => (<DialogContainer dialogProps={props} state={state} />)), []);

  const openDialog = useBound(() => set({ isOpen: true }));
  const closeDialog = useBound(() => set({ isOpen: false, closeReason: 'close' }));

  const handleClick = useDelegatedBound((buttonId: string, onClick?: (...args: any[]) => void) => () => {
    set({ isOpen: false, closeReason: buttonId });
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