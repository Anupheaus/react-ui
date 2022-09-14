import { Theme } from '../../providers/ThemeProvider';
import { FiHelpCircle } from 'react-icons/fi';

export const FieldHelpTheme = Theme.createThemeFor('fieldHelp', {
  styles: {

  },
  icons: {
    help: ({ size }) => (<FiHelpCircle size={size} />),
  },
});
