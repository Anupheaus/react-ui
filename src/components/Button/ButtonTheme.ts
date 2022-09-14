import { Theme } from '../../providers/ThemeProvider/Theme';

export const ButtonTheme = Theme.createThemeFor('button', {
  styles: {
    backgroundColor: '#eee',
    textColor: '#000',
    borderColor: 'transparent',
    borderRadius: 4,
    activeBackgroundColor: '#ddd',
    activeTextColor: '#000',
  },
});
