import { FiX } from 'react-icons/fi';
import { createTheme } from '../../theme';

export const DialogTheme = createTheme({
  id: 'DialogTheme',
  definition: {
    titleFontSize: 20,
    titleFontWeight: 600,
    titleBackgroundColor: '#eee',
  },
  icons: {
    close: FiX,
  },
});
