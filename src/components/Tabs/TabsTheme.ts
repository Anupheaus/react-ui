import Color from 'color';
import { createTheme, DefaultTheme } from '../../theme';

export const TabsTheme = createTheme({
  id: 'TabsTheme',

  definition: {
    backgroundColor: DefaultTheme.action.default.backgroundColor,
    hightlightColor: Color('white').alpha(0.2).hexa(),
    highlightHeight: 2,

    activeTab: {
      backgroundColor: DefaultTheme.action.active.backgroundColor,
      textColor: DefaultTheme.action.active.color,
      highlightHeight: 3,
      highlightColor: Color('white').alpha(0.8).hexa(),
    },

    inactiveTab: {
      backgroundColor: DefaultTheme.action.default.backgroundColor,
      textColor: DefaultTheme.action.default.color,
      highlightHeight: 3,
      highlightColor: Color('white').alpha(0.4).hexa(),
    },
  },
});
