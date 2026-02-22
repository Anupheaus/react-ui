import type { ReactNode } from 'react';
import { useConfirmationDialogInternal } from './useConfirmationDialog';
import { ConfirmationDialogContextProvider } from './ConfirmationDialogContext';

interface Props {
  children: ReactNode;
}

export function ConfirmationDialogProvider({ children }: Props) {
  const value = useConfirmationDialogInternal();
  return (
    <ConfirmationDialogContextProvider value={value}>
      {children}
    </ConfirmationDialogContextProvider>
  );
}
