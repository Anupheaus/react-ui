import { createTheme, ThemeProvider } from '@mui/material';
import type { ReactNode } from 'react';
import type { CSSInterpolation } from 'tss-react';
import { GlobalStyles } from 'tss-react';
import { createComponent } from '../components/Component';

const muiTheme = createTheme();

interface Props {
  globalStyles?: CSSInterpolation;
}

interface ThemeProviderProps {
  children?: ReactNode;
}

export function createRootThemeProvider({ globalStyles }: Props) {
  return createComponent('ThemeProvider', ({
    children = null,
  }: ThemeProviderProps) => {
    let content = (
      <ThemeProvider theme={muiTheme}>
        {children}
      </ThemeProvider>
    );

    if (globalStyles != null) content = (<>
      <GlobalStyles styles={globalStyles} />
      {content}
    </>);

    return content;
  });
}