import { createTheme, DefaultTheme } from '../../theme';

export const MenuTheme = createTheme({
  id: 'MenuTheme',

  definition: {
    backgroundColor: 'transparent',

    menuItem: {
      default: {
        ...DefaultTheme.menuItem.default,
      },
      active: {
        ...DefaultTheme.menuItem.active,
      },
      fontSize: 13,
      fontWeight: 400,
      padding: 8,
    },
  },
});
