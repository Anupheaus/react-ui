import { FiEye, FiEyeOff } from 'react-icons/fi';
import { createTheme } from '../../theme';

export const PasswordTheme = createTheme({
  id: 'PasswordTheme',
  definition: {},
  icons: {
    showPassword: FiEye,
    hidePassword: FiEyeOff,
  },
});
