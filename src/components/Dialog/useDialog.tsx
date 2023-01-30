import { ComponentProps, FunctionComponent, useMemo } from 'react';
import { useDistributedState, useBound, useDelegatedBound, useActions } from '../../hooks';
import { Button } from '../Button';
import { DialogContent } from './DialogContent';
import { DialogActions } from './DialogActions';
import { createComponent } from '../Component';
import { DialogContainer } from './DialogContainer';
import { Dialog as DialogComponent, DialogActions as DialogActionsType } from './Dialog';

type DialogProps = Omit<ComponentProps<typeof DialogComponent>, 'actions'>;

export interface UseDialogApi {
  openDialog(): void;
  closeDialog(): void;
  Dialog: FunctionComponent<DialogProps>;
  DialogContent: typeof DialogContent;
  DialogActions: typeof DialogActions;
  OkButton: typeof Button;
}

export function useDialog(): UseDialogApi {
  const { state, set } = useDistributedState(() => false);
  const { setActions, close } = useActions<DialogActionsType>();

  const Dialog = useMemo(() => createComponent('Dialog', (props: DialogProps) => (<DialogContainer {...props} state={state} actions={setActions} />)), []);

  const openDialog = useBound(() => set(true));
  const closeDialog = useBound(() => close('code'));

  const handleClick = useDelegatedBound((buttonId: string, onClick?: (...args: any[]) => void) => () => {
    close(buttonId);
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