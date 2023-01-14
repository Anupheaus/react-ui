import { createTheme, DefaultTheme } from '../../theme';

export const ToolbarTheme = createTheme({
  id: 'ToolbarTheme',
  definition: {
    backgroundColor: DefaultTheme.surface.asAContainer.backgroundColor,
    borderColor: DefaultTheme.surface.asAContainer.borderColor,
    borderRadius: DefaultTheme.field.default.borderRadius,
    textColor: DefaultTheme.surface.asAContainer.textColor,
  },
});
