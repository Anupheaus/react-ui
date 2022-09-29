import { useMemo } from 'react';
import { Dialog as DialogComponent, DialogProps } from './Dialog';
import { useDistributedState, useBound, useDelegatedBound } from '../../hooks';
import { pureFC } from '../../anuxComponents';
import { Button } from '../Button';
import { DialogContent } from './DialogContent';
import { DialogActions } from './DialogActions';
import { PropsOf } from '../../extensions';

export function useDialog() {
  const { state, set } = useDistributedState(() => false);

  const Dialog = useMemo(() => pureFC<DialogProps>()('Dialog', props => (<DialogComponent state={state} {...props} />)), []);

  const openDialog = useBound(() => set(true));
  const closeDialog = useBound(() => set(false));

  const handleClick = useDelegatedBound((buttonId: string, onClick?: () => void) => () => {
    closeDialog();
    onClick?.();
  });

  const OkButton = useMemo(() => pureFC<PropsOf<typeof Button>>()('OkButton', props => (<Button {...props} onClick={handleClick('Ok', props.onClick)}>Okay</Button>)), []);

  return {
    openDialog,
    closeDialog,
    Dialog,
    DialogContent,
    DialogActions,
    OkButton,
  };
}