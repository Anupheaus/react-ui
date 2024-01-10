import { AnyObject } from '@anupheaus/common';
import { createComponent } from '../components/Component';
import { ReactNode, useMemo } from 'react';
import { ThemeContext, ThemeContextProps } from './ThemeContext';

interface Props<ThemeType extends AnyObject> {
  theme: ThemeType;
  children: ReactNode;
}

export const ThemeProvider = createComponent('ThemeProvider', <ThemeType extends AnyObject = AnyObject>({
  theme: providedTheme,
  children,
}: Props<ThemeType>) => {

  const context = useMemo<ThemeContextProps>(() => ({
    theme: providedTheme,
    isValid: true,
  }), [providedTheme]);

  return (
    <ThemeContext.Provider value={context}>
      {children}
    </ThemeContext.Provider>
  );
});