import { createComponent } from '../components/Component';
import { ReactNode, useMemo } from 'react';
import { ThemeContext, ThemeContextProps } from './ThemeContext';
import { Theme } from './themes';

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