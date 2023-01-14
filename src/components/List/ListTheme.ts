import { createTheme, DefaultTheme } from '../../theme';

export const ListTheme = createTheme({
  id: 'ListTheme',

  definition: {
    backgroundColor: DefaultTheme.surface.asAContainer.backgroundColor,
    borderColor: DefaultTheme.surface.asAContainer.borderColor,
    borderRadius: DefaultTheme.field.default.borderRadius,
    padding: 8 as string | number,
  },
});
