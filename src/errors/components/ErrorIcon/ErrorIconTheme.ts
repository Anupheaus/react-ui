import { FiAlertCircle } from 'react-icons/fi';
import { createTheme } from '../../../theme';

export const ErrorIconTheme = createTheme({
  id: 'ErrorIconTheme',
  definition: {
    iconColor: '#870000',
  },
  icons: {
    error: FiAlertCircle,
  },
});
