import { createContext } from 'react';

export interface FormObserverContextProps {
  isReal: boolean;
  setIsDirty(id: string, isDirty: boolean): void;
  getIsDirty(): boolean;
}

export const FormObserverContext = createContext<FormObserverContextProps>({
  isReal: false,
  setIsDirty: () => void 0,
  getIsDirty: () => false,
});
