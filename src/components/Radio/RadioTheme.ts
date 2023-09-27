import { createTheme, DefaultTheme } from '../../theme';

export const RadioTheme = createTheme({
  id: 'RadioTheme',
  definition: {
    default: {
      backgroundColor: 'transparent',
      borderColor: DefaultTheme.action.default.backgroundColor,
    },
    toggled: {
      backgroundColor: DefaultTheme.action.active.backgroundColor,
      borderColor: DefaultTheme.action.active.borderColor,
    },
    disabled: {
      backgroundColor: DefaultTheme.action.disabled.backgroundColor,
      borderColor: DefaultTheme.action.disabled.backgroundColor,
    },
  },
});
