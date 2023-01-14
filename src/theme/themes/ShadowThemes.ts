import Color from 'color';
import { createTheme } from '../createTheme';

export const ShadowThemes = createTheme({
  id: 'ShadowThemes',

  definition: {
    createSmallInset: (color: string) => `inset 0 0 4px 0 ${Color(color).alpha(0.3).hexa()}`,
  },
});