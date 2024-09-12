import { ReactNode, useContext } from 'react';
import { createComponent } from '../Component';
import { Dialog as MuiDialog, DialogTitle as MuiDialogTitle } from '@mui/material';
import { DialogStateContext } from './dialogContexts';

interface Props {
  title?: ReactNode;
  children?: ReactNode;
}

export const Dialog = createComponent('Dialog', ({
  title = 'Untitled Dialog',
  children = null,
}: Props) => {
  const { isVisible } = useContext(DialogStateContext);

  return (
    <MuiDialog
      open={isVisible}
    >
      <MuiDialogTitle>{title}</MuiDialogTitle>
      {children}
    </MuiDialog>
  );
});
