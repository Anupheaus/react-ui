import { createTheme, DefaultTheme } from '../../theme';

export const ButtonTheme = createTheme({
  id: 'ButtonTheme',
  definition: {
    default: {
      backgroundColor: DefaultTheme.action.normal.backgroundColor,
      textColor: DefaultTheme.action.normal.color,
      borderColor: DefaultTheme.action.normal.borderColor,
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
    fontSize: DefaultTheme.action.normal.fontSize,
    fontWeight: DefaultTheme.action.normal.fontWeight,
    alignment: 'center' as 'center' | 'left' | 'right',
  },
});
