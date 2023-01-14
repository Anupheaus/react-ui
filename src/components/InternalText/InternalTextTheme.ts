import { createTheme, DefaultTheme } from '../../theme';

export const InternalTextTheme = createTheme({
  id: 'InternalTextTheme',
  definition: {
    backgroundColor: DefaultTheme.field.default.backgroundColor,
    activeBackgroundColor: DefaultTheme.field.active.backgroundColor,
    textColor: DefaultTheme.field.default.textColor,
    activeTextColor: DefaultTheme.field.active.textColor,
    borderColor: DefaultTheme.field.default.borderColor,
    activeBorderColor: DefaultTheme.field.active.borderColor,
    borderRadius: DefaultTheme.field.default.borderRadius,
  },
});
