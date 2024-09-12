import { createContext } from 'react';

export interface DialogStateContextProps {
  isVisible: boolean;
  closeWith(value?: string): void;
}

export const DialogStateContext = createContext<DialogStateContextProps>({
  isVisible: false,
  closeWith: () => void 0,
});

