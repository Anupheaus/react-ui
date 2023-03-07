import { createTheme, DefaultTheme } from '../../theme';

export const MenuTheme = createTheme({
  id: 'MenuTheme',

  definition: {
    backgroundColor: 'transparent',

    menuItem: {
      default: {
        ...DefaultTheme.action.default,
      },
      active: {
        ...DefaultTheme.action.active,
      },
      fontSize: 13,
      fontWeight: 400,
      padding: 8,
    },
  },
});
