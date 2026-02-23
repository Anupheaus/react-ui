import type { ReactNode } from 'react';
import { useConfirmationDialog } from './useConfirmationDialog';
import { ConfirmationDialogContext } from './ConfirmationDialogContext';

interface Props {
  children: ReactNode;
}

/** Provides confirmation dialog via context. Must be used within Dialogs. */
export function ConfirmationDialogProvider({ children }: Props) {
  const value = useConfirmationDialog();
  return (
    <ConfirmationDialogContext.Provider value={value}>
      {children}
    </ConfirmationDialogContext.Provider>
  );
}
