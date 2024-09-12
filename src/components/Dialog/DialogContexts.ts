import { createContext } from 'react';

export interface DialogManagerContextProps {
  isValid: boolean;
  id: string;
}

export const DialogManagerContext = createContext<DialogManagerContextProps>({
  isValid: false,
  id: '',
});
