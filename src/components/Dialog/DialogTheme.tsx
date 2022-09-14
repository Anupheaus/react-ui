import { Theme } from '../../providers/ThemeProvider';
import { FiX } from 'react-icons/fi';

export const DialogTheme = Theme.createThemeFor('dialog', {
  styles: {
    titleFontSize: 20,
    titleFontWeight: 600,
    titleBackgroundColor: '#eee',
  },
  icons: {
    close: ({ size }) => <FiX size={size} />
  },
});

export const myDialogTheme = DialogTheme.createVariant({
  styles: {

  },
});
