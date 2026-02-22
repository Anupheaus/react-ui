import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

export interface ConfirmationDialogResult {
  ConfirmationDialog: React.ComponentType<{
    title?: ReactNode;
    message?: ReactNode;
    minWidth?: number;
    hideOk?: boolean;
    okLabel?: ReactNode;
    hideCancel?: boolean;
    cancelLabel?: ReactNode;
    children?: ReactNode;
    onClosing?(reason?: string): Promise<boolean | void> | boolean | void;
  }>;
  openConfirmationDialog(message?: ReactNode): Promise<boolean>;
  openConfirmationDialog(title?: ReactNode, message?: ReactNode): Promise<boolean>;
}

const ConfirmationDialogContext = createContext<ConfirmationDialogResult | null>(null);

export const ConfirmationDialogContextProvider = ConfirmationDialogContext.Provider;

export function useConfirmationDialog(): ConfirmationDialogResult {
  const value = useContext(ConfirmationDialogContext);
  if (value == null) {
    throw new Error('useConfirmationDialog must be used within ConfirmationDialogProvider');
  }
  return value;
}
