import { createTheme, DefaultTheme } from '../../theme';

export const CheckboxTheme = createTheme({
  id: 'CheckboxTheme',
  definition: {
    backgroundColor: DefaultTheme.surface.default.backgroundColor,
    uncheckedColor: DefaultTheme.action.default.backgroundColor,
    checkedColor: DefaultTheme.action.default.backgroundColor,
    activeColor: DefaultTheme.action.active.backgroundColor,
  },
});
