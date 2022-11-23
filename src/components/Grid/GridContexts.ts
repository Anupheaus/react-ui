import { createContext, ReactNode } from 'react';

export interface GridContextsColumnEntry { order: number; render: ReactNode; }

export const GridContexts = {
  setHeaderHeight: createContext<(height: number) => void>(() => void 0),
  // addcreateContext<GridContextsColumnEntry[]> ([]),
};