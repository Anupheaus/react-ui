import { useLayoutEffect } from 'react';
import { createComponent } from '../Component';
import { useWindowActions } from '../Windows';

interface Props {
  id: string;
  isDialogOpen: boolean;
}

export const DialogWindowActions = createComponent('DialogWindowActions', ({
  id,
  isDialogOpen,
}: Props) => {
  const { closeWindow } = useWindowActions();

  useLayoutEffect(() => {
    if (isDialogOpen) return;
    closeWindow(id);
  }, [isDialogOpen]);

  return null;
});