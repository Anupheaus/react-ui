import { FiMaximize, FiMinimize, FiX } from 'react-icons/fi';
import { createTheme } from '../../theme';

export const WindowTheme = createTheme({
  id: 'WindowTheme',

  definition: {
    backgroundColor: 'white',
    textColor: 'black',
    fontSize: 12,

    titleBar: {
      backgroundColor: '#eee',
      textColor: 'black',
      fontSize: 16,
    },
  },
  icons: {
    close: FiX,
    maximize: FiMaximize,
    restore: FiMinimize,
  }
});