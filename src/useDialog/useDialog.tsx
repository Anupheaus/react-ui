import { useBound } from '../useBound';
import { useMemo, useRef } from 'react';
import { DialogContent, DialogActions } from '@mui/material';
import { Dialog as DialogComponent, DialogProps, DialogState } from './Dialog';
import { anuxPureFC } from '../anuxComponents';

export function useDialog() {
  const state = useRef<DialogState>({
    isOpen: false,
    openDialog: () => { state.current.isOpen = true; },
    closeDialog: () => { state.current.isOpen = false; },
  });

  const Dialog = useMemo(() => anuxPureFC<DialogProps>('UseDialog', props => (<DialogComponent state={state} {...props} />)), []);

  const openDialog = useBound(() => state.current.openDialog());
  const closeDialog = useBound(() => state.current.closeDialog());

  return {
    openDialog,
    closeDialog,
    Dialog,
    DialogContent,
    DialogActions,
  };
}