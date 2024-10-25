import { createContext } from 'react';

export interface FaderContextProps {
  isValid: boolean;
  duration: number;
  updateFadeData(id: string, element: HTMLElement): void;
  fadeOut(id: string): void;
}

export const FaderContext = createContext<FaderContextProps>({
  isValid: false,
  duration: 1000,
  updateFadeData: () => void 0,
  fadeOut: () => void 0,
});
