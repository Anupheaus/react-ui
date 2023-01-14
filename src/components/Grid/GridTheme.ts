import { createTheme } from '../../theme';

export const GridTheme = createTheme({
  id: 'GridTheme',

  definition: {
    headers: {
      backgroundColor: '#1e88e5' as string | undefined,
      fontSize: 13,
      fontColor: 'white' as string | undefined, // 'rgba(0 0 0 / 60%)',
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
