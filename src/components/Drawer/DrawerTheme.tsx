import { FiX } from 'react-icons/fi';
import { createTheme } from '../../theme';

export const DrawerTheme = createTheme({
  id: 'DrawerTheme',
  definition: {
    header: {
      fontSize: 20,
      fontWeight: 600,
      backgroundColor: '#eee',
      textColor: 'black',
    },
    content: {
      backgroundColor: 'white',
      textColor: 'black',
    },
  },
  icons: {
    close: FiX,
  },
});
