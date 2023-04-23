import { useLayoutEffect } from 'react';
import { createComponent } from '../Component';
import { useWindows } from '../Windows';

interface Props {
  id: string;
  isDialogOpen: boolean;
}

export const DialogWindowActions = createComponent('DialogWindowActions', ({
  id,
  isDialogOpen,
}: Props) => {
  const { closeWindow } = useWindows();

  useLayoutEffect(() => {
    if (isDialogOpen) return;
    closeWindow(id);
  }, [isDialogOpen]);

  return null;
});