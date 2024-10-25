import { createContext } from 'react';
import type { Theme } from './themes';

export interface ThemeContextProps {
  theme: Theme;
  isValid: boolean;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: null as unknown as Theme,
  isValid: false,
});
