import { createTheme, DefaultTheme } from '../../theme';

export const ToolbarTheme = createTheme({
  id: 'ToolbarTheme',
  definition: {
    default: {
      ...DefaultTheme.toolbar.default,
      borderRadius: DefaultTheme.field.default.borderRadius,
    },
    active: DefaultTheme.toolbar.active,
  },
});
