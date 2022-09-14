import { Theme } from '../../providers/ThemeProvider';

export const TooltipTheme = Theme.createThemeFor('tooltip', {
  styles: {
    backgroundColor: '#555',
    textColor: '#fff',
    fontSize: 13,
    fontWeight: 400,
  },
});