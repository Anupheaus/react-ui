import { FiMaximize, FiMinimize, FiX } from 'react-icons/fi';
import { createTheme, DefaultTheme } from '../../theme';

export const WindowTheme = createTheme({
  id: 'WindowTheme',

  definition: {
    backgroundColor: DefaultTheme.surface.asAContainer.backgroundColor,
    textColor: DefaultTheme.surface.asAContainer.textColor,
    fontSize: DefaultTheme.surface.asAContainer.fontSize,
    fontWeight: DefaultTheme.surface.asAContainer.fontWeight,

    titleBar: {
      backgroundColor: DefaultTheme.surface.titleArea.backgroundColor,
      textColor: DefaultTheme.surface.titleArea.textColor,
      fontSize: DefaultTheme.surface.titleArea.fontSize,
      fontWeight: DefaultTheme.surface.titleArea.fontWeight,
    },
  },
  icons: {
    close: FiX,
    maximize: FiMaximize,
    restore: FiMinimize,
  }
});