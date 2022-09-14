import { createContext } from 'react';

export const UIStateContexts = {
  isLoadingContext: createContext(false),
  isReadOnlyContext: createContext(false),
  isCompactContext: createContext(false),
};
