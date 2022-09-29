import { FiX } from 'react-icons/fi';
import { createTheme } from '../../theme';

export const DrawerTheme = createTheme({
  id: 'DrawerTheme',
  definition: {
    titleFontSize: 20,
    titleFontWeight: 600,
    titleTextColor: 'black',
    titleBackgroundColor: '#eee',
    backgroundColor: 'white',
    textColor: 'black',
  },
  icons: {
    close: FiX,
  },
});
