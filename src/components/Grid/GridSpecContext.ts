import { createContext } from 'react';

export interface GridSpecContextProps {
  isValid: boolean;
  setSpec(id: string, width: number, columns: number): void;
  deleteSpec(id: string): void;
}

export const GridSpecContext = createContext<GridSpecContextProps>({
  isValid: false,
  setSpec: () => void 0,
  deleteSpec: () => void 0,
});