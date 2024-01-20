import { createTheme, DefaultTheme } from '../../theme';

export const CheckboxTheme = createTheme({
  id: 'CheckboxTheme',
  definition: {
    ...DefaultTheme.field.value.normal,
    backgroundColor: DefaultTheme.surface.general.normal.backgroundColor,
    uncheckedColor: DefaultTheme.action.normal.backgroundColor,
    checkedColor: DefaultTheme.action.normal.backgroundColor,
    activeColor: DefaultTheme.action.normal.backgroundColor,
  },
});
