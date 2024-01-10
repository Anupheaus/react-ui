import { createTheme, DefaultTheme } from '../../theme';

export const InternalFieldTheme = createTheme({
  id: 'InternalFieldTheme',
  definition: {
    backgroundColor: DefaultTheme.field.default.backgroundColor,
    activeBackgroundColor: DefaultTheme.field.active.backgroundColor,
    textColor: DefaultTheme.field.default.color,
    fontSize: DefaultTheme.field.default.fontSize,
    fontWeight: DefaultTheme.field.default.fontWeight,
    activeTextColor: DefaultTheme.field.active.color,
    borderColor: DefaultTheme.field.default.borderColor,
    activeBorderColor: DefaultTheme.field.active.borderColor,
    borderRadius: DefaultTheme.field.default.borderRadius,
  },
});
