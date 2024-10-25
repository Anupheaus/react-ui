import { createComponent } from '../components/Component';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import type { ThemeContextProps } from './ThemeContext';
import { ThemeContext } from './ThemeContext';
import type { Theme } from './themes';

interface Props<ThemeType extends Theme> {
  theme: ThemeType;
  children: ReactNode;
}

export const ThemeProvider = createComponent('ThemeProvider', <ThemeType extends Theme = Theme>({
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