import Color from 'color';
import { createTheme, DefaultTheme } from '../../theme';

export const TabsTheme = createTheme({
  id: 'TabsTheme',

  definition: {
    ...DefaultTheme.action.normal,
    hightlightColor: Color('white').alpha(0.2).hexa(),
    highlightHeight: 2,

    activeTab: {
      ...DefaultTheme.action.active,
      highlightHeight: 3,
      highlightColor: Color('white').alpha(0.8).hexa(),
    },

    inactiveTab: {
      ...DefaultTheme.action.normal,
      highlightHeight: 3,
      highlightColor: Color('white').alpha(0.4).hexa(),
    },
  },
});
