import { createContext, ReactNode } from 'react';
import { DialogApi } from './DialogModels';

export interface DialogsContextProps {
  isValid: boolean;
  setContent(dialogId: string, content: ReactNode): void;
  onOpened(dialog: DialogApi): void;
  onClosed(dialog: DialogApi): void;
}

export const DialogsContext = createContext<DialogsContextProps>({
  isValid: false,
  setContent: () => void 0,
  onOpened: () => void 0,
  onClosed: () => void 0,
});
