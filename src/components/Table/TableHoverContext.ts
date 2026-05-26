import { createContext, useContext } from 'react';

export const TableHoverContext = createContext(false);

export function useTableHover() {
  return useContext(TableHoverContext);
}
