import { createContext } from 'react';
import type { ReactNode } from 'react';

export interface ConfirmationDialogContextValue {
  openConfirmationDialog(message?: ReactNode): Promise<boolean>;
  openConfirmationDialog(title?: ReactNode, message?: ReactNode): Promise<boolean>;
}

/** Context for confirmation dialog. Provided by ConfirmationDialogProvider inside Dialogs. */
export const ConfirmationDialogContext = createContext<ConfirmationDialogContextValue | undefined>(undefined);
