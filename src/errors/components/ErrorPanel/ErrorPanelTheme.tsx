import { FiXCircle } from 'react-icons/fi';
import { createTheme } from '../../../theme';

export const ErrorPanelTheme = createTheme({
  id: 'ErrorPanelTheme',
  definition: {
    backgroundColor: '#f38989',
  },
  icons: {
    error: ({ size }) => (<FiXCircle size={size} />),
  },
});
