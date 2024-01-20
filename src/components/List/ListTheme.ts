import { createTheme, DefaultTheme } from '../../theme';

export const ListTheme = createTheme({
  id: 'ListTheme',

  definition: {
    ...DefaultTheme.field.value.normal,
    padding: 8 as string | number,
  },
});
