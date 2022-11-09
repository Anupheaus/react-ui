import { createTheme } from '../createTheme';

export const TransitionTheme = createTheme({
  id: 'TransitionTheme',
  definition: {
    transitionDuration: '400ms',
    transitionTimingFunction: 'ease',
  },
});