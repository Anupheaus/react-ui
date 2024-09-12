import { ReactNode } from 'react';
import { createComponent } from '../Component';
import { DialogContent as MuiDialogContent } from '@mui/material';

interface Props {
  children?: ReactNode;
}

export const DialogContent = createComponent('DialogContent', ({
  children = null
}: Props) => {
  return (
    <MuiDialogContent>
      {children}
    </MuiDialogContent>
  );
});