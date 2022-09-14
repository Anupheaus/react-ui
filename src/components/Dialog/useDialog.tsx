import { ComponentProps, useMemo } from 'react';
import { Dialog as DialogComponent, DialogProps } from './Dialog';
import { useDistributedState } from '../../hooks/useDistributedState';
import { anuxPureFC } from '../../anuxComponents';
import { useBound, useDelegatedBound } from '../../hooks/useBound';
import { Button } from '../Button';
import { DialogContent } from './DialogContent';
import { DialogActions } from './DialogActions';

export function useDialog() {
  const { state, set } = useDistributedState(() => false);

  const Dialog = useMemo(() => anuxPureFC<DialogProps>('Dialog', props => (<DialogComponent state={state} {...props} />)), []);

  const openDialog = useBound(() => set(true));
  const closeDialog = useBound(() => set(false));

  const handleClick = useDelegatedBound((buttonId: string, onClick?: () => void) => () => {
    closeDialog();
    onClick?.();
  });

  const OkButton = useMemo(() => anuxPureFC<ComponentProps<typeof Button>>('OkButton', props => (<Button {...props} onClick={handleClick('Ok', props.onClick)}>Okay</Button>)), []);

  return {
    openDialog,
    closeDialog,
    Dialog,
    DialogContent,
    DialogActions,
    OkButton,
  };
}