import { createTheme } from '../../theme';

export const GridTheme = createTheme({
  id: 'GridTheme',

  definition: {
    headers: {
      backgroundColor: '#F0F0F0',
      fontSize: 13,
      fontColor: 'rgba(0 0 0 / 60%)',
    },
    borders: {
      color: '#F0F0F0',
      radius: 8,
    },
    rows: {
      fontSize: 14,
    },
  },
});
