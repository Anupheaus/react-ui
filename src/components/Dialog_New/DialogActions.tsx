import { ReactNode } from 'react';
import { createComponent } from '../Component';
import { DialogActions as MuiDialogActions } from '@mui/material';

interface Props {
  children?: ReactNode;
}

export const DialogActions = createComponent('DialogActions', ({
  children = null
}: Props) => {
  return (
    <MuiDialogActions>
      {children}
    </MuiDialogActions>
  );
});