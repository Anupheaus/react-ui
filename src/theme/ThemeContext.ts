import { createContext } from 'react';
import type { Theme } from './themes';
import type { DeviceType } from './useDevice/device-models';

export interface ThemeContextProps {
  theme: Theme;
  isValid: boolean;
  device: DeviceType;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: null as unknown as Theme,
  isValid: false,
  device: 'web',
});
