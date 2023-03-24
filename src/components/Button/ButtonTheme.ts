import { createTheme, DefaultTheme } from '../../theme';

export const ButtonTheme = createTheme({
  id: 'ButtonTheme',
  definition: {
    backgroundColor: DefaultTheme.action.default.backgroundColor,
    activeBackgroundColor: DefaultTheme.action.active.backgroundColor,
    textColor: DefaultTheme.action.default.textColor,
    activeTextColor: DefaultTheme.action.active.textColor,
    borderColor: DefaultTheme.action.default.borderColor,
    activeBorderColor: DefaultTheme.action.active.borderColor,
    borderRadius: 4 as string | number,
    fontSize: DefaultTheme.action.default.fontSize,
    fontWeight: DefaultTheme.action.default.fontWeight,
    alignment: 'center' as 'center' | 'left' | 'right',
  },
});
