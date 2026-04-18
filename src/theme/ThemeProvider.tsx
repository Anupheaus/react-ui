import { createComponent } from '../components/Component';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import type { ThemeContextProps } from './ThemeContext';
import { ThemeContext } from './ThemeContext';
import type { Theme } from './themes';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import type { CSSInterpolation } from 'tss-react';
import { GlobalStyles } from 'tss-react';

const muiTheme = createTheme();

interface Props<ThemeType extends Theme> {
  theme: ThemeType;
  globalStyles?: CSSInterpolation;
  children: ReactNode;
}

export const ThemeProvider = createComponent('ThemeProvider', <ThemeType extends Theme = Theme>({
  theme: providedTheme,
  globalStyles,
  children,
}: Props<ThemeType>) => {

  const context = useMemo<ThemeContextProps>(() => ({
    theme: providedTheme,
    isValid: true,
  }), [providedTheme]);

  const { text, fonts } = providedTheme;

  const fontFaceStyles = useMemo(() => {
    if (fonts == null || fonts.length === 0) return null;
    return fonts.map(font => ({
      '@font-face': {
        fontFamily: font.fontFamily,
        src: font.src,
        ...(font.fontWeight != null && { fontWeight: font.fontWeight }),
        ...(font.fontStyle != null && { fontStyle: font.fontStyle }),
      },
    }));
  }, [fonts]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <GlobalStyles styles={{
        'body, html, root': {
          display: 'flex',
          flex: 'auto',
          fontFamily: text.family,
          fontSize: text.size,
          fontWeight: text.weight as string | number,
          color: text.color,
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          WebkitTapHighlightColor: 'transparent',
          overflow: 'hidden',
        },
        '*': {
          boxSizing: 'border-box',
        },
      }} />
      {fontFaceStyles != null && <GlobalStyles styles={fontFaceStyles} />}
      {globalStyles != null && <GlobalStyles styles={globalStyles} />}
      <ThemeContext.Provider value={context}>
        {children}
      </ThemeContext.Provider>
    </MuiThemeProvider>
  );
});
