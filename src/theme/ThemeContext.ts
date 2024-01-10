import { AnyObject } from '@anupheaus/common';
import { createContext } from 'react';

export interface ThemeContextProps {
  theme: AnyObject;
  isValid: boolean;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: {},
  isValid: false,
});
