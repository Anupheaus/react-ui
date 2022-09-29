import { createTheme, ThemeProvider } from '@mui/material';
import { CSSInterpolation, GlobalStyles } from 'tss-react';
import { pureFC } from '../anuxComponents';

const muiTheme = createTheme();

interface Props {
  globalStyles?: CSSInterpolation;
}

export function createRootThemeProvider({ globalStyles }: Props) {
  return pureFC()('ThemeProvider', ({
    children = null,
  }) => {
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