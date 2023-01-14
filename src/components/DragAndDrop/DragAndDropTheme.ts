import { createTheme } from '../../theme';

export const DragAndDropTheme = createTheme({
  id: 'DragAndDropTheme',

  definition: {
    validOverlayColor: 'rgba(0 255 0 / 20%)',
    invalidOverlayColor: 'rgba(255 0 0 / 20%)',
  },
});
