import { createTheme, DefaultTheme } from '../../theme';

export const PINTheme = createTheme({
  id: 'PINTheme',

  definition: {
    default: {
      ...DefaultTheme.field.default,
      backgroundColor: 'transparent',
    },
    active: {
      ...DefaultTheme.field.active,
    },
    disabled: {
      ...DefaultTheme.field.disabled,
    },
  },
});
