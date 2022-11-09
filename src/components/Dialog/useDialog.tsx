import { ComponentProps, useMemo } from 'react';
import { Dialog as DialogComponent, DialogProps } from './Dialog';
import { useDistributedState, useBound, useDelegatedBound } from '../../hooks';
import { Button } from '../Button';
import { DialogContent } from './DialogContent';
import { DialogActions } from './DialogActions';
import { createComponent } from '../Component';

export function useDialog() {
  const { state, set } = useDistributedState(() => false);

  const Dialog = useMemo(() => createComponent({ id: 'Dialog', render: (props: DialogProps) => (<DialogComponent state={state} {...props} />) }), []);

  const openDialog = useBound(() => set(true));
  const closeDialog = useBound(() => set(false));

  const handleClick = useDelegatedBound((buttonId: string, onClick?: () => void) => () => {
    closeDialog();
    onClick?.();
  });

  const OkButton = useMemo(() => createComponent({ id: 'OkButton', render: (props: ComponentProps<typeof Button>) => (<Button {...props} onClick={handleClick('Ok', props.onClick)}>Okay</Button>) }), []);

  return {
    openDialog,
    closeDialog,
    Dialog,
    DialogContent,
    DialogActions,
    OkButton,
  };
}