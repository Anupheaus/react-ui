import { createTheme } from '../../theme';

export const ButtonTheme = createTheme({
  id: 'ButtonTheme',
  definition: {
    backgroundColor: '#eee',
    activeBackgroundColor: '#ddd',
    textColor: '#000',
    activeTextColor: '#000',
    borderRadius: 4 as string | number,
    borderColor: 'transparent',
    fontSize: 14,
    fontWeight: 400,
  }
});
