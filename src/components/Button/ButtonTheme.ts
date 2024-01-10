import { createTheme, DefaultTheme } from '../../theme';

export const ButtonTheme = createTheme({
  id: 'ButtonTheme',
  definition: {
    default: {
      backgroundColor: DefaultTheme.action.default.backgroundColor,
      textColor: DefaultTheme.action.default.color,
      borderColor: DefaultTheme.action.default.borderColor,
    },
    active: {
      backgroundColor: DefaultTheme.action.active.backgroundColor,
      textColor: DefaultTheme.action.active.color,
      borderColor: DefaultTheme.action.active.borderColor,
    },
    disabled: {
      backgroundColor: DefaultTheme.action.disabled.backgroundColor,
      textColor: DefaultTheme.action.disabled.color,
      borderColor: DefaultTheme.action.disabled.backgroundColor,
    },
    borderRadius: 4 as string | number,
    fontSize: DefaultTheme.action.default.fontSize,
    fontWeight: DefaultTheme.action.default.fontWeight,
    alignment: 'center' as 'center' | 'left' | 'right',
  },
});
