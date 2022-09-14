import { Theme } from '../src/providers/ThemeProvider';

export const GlobalTheme = Theme.createThemeFor('global', {
  styles: {
    backgroundColor: 'transparent',
    textColor: '#000',
  },
});

export const PrimaryTheme = GlobalTheme.createVariant({
  styles: {
    backgroundColor: '#8fb6d5',
    textColor: '#000',
  },
});

export const SecondaryTheme = GlobalTheme.createVariant({
  styles: {
    backgroundColor: '#8fd5aa',
    textColor: '#000',
  },
});
