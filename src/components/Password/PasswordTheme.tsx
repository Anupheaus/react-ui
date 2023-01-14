import { FiEye, FiEyeOff } from 'react-icons/fi';
import { createTheme } from '../../theme';
import { InternalTextTheme } from '../InternalText';

export const PasswordTheme = createTheme({
  id: 'PasswordTheme',

  definition: {
    ...InternalTextTheme.definition,
  },
  icons: {
    showPassword: FiEye,
    hidePassword: FiEyeOff,
  },
});
