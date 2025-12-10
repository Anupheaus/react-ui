import type { ReactNode } from 'react';
import { createContext } from 'react';

export interface ModalLoaderContextType {
  showLoadingOf(id: string, message: ReactNode): void;
  hideLoadingOf(id: string): void;
}

export const ModalLoaderContext = createContext<ModalLoaderContextType>({
  showLoadingOf: () => void 0,
  hideLoadingOf: () => void 0,
});
