import { InternalTextTheme } from '../InternalText';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export const PasswordTheme = InternalTextTheme.createVariant({
  icons: {
    showPassword: FiEye,
    hidePassword: FiEyeOff,
  },
});
