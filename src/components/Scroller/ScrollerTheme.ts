import { createTheme } from '../../theme';

export const ScrollerTheme = createTheme({
  id: 'Scroller',

  definition: {
    shadow: '0 0 8px 4px rgba(0 0 0 / 50%)',
    scrollbarColor: 'rgba(0 0 0 / 30%)',
    width: 16,
    offsets: {
      top: 0,
      bottom: -16,
      left: 0,
      right: 0,
    },
  },
});
