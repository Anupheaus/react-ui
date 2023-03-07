import { createContext } from 'react';

export interface PopupMenuContextProps {
  isValid: boolean;
  close(): void;
}

export const PopupMenuContext = createContext<PopupMenuContextProps>({
  isValid: false,
  close: () => void 0,
});
