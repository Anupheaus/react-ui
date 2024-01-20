import { FiMaximize, FiMinimize, FiX } from 'react-icons/fi';
import { createTheme, DefaultTheme } from '../../theme';

export const WindowTheme = createTheme({
  id: 'WindowTheme',

  definition: {
    backgroundColor: DefaultTheme.surface.asAContainer.normal.backgroundColor,
    textColor: DefaultTheme.surface.asAContainer.normal.color,
    fontSize: DefaultTheme.surface.asAContainer.normal.fontSize,
    fontWeight: DefaultTheme.surface.asAContainer.normal.fontWeight,

    titleBar: {
      backgroundColor: DefaultTheme.surface.titleArea.normal.backgroundColor,
      textColor: DefaultTheme.surface.titleArea.normal.color,
      fontSize: DefaultTheme.surface.titleArea.normal.fontSize,
      fontWeight: DefaultTheme.surface.titleArea.normal.fontWeight,
    },
  },
  icons: {
    close: FiX,
    maximize: FiMaximize,
    restore: FiMinimize,
  }
});