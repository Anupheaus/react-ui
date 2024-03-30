import { createContext } from 'react';

export const WindowManagerIdContext = createContext('default');

export interface WindowContextProps {
  id: string;
  index: number;
  isFocused: boolean;
}
export const WindowContext = createContext<WindowContextProps>({
  id: '',
  index: 0,
  isFocused: false,
});
