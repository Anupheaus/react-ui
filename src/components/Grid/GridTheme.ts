import { createTheme } from '../../theme';

export const GridTheme = createTheme({
  id: 'GridTheme',

  definition: {
    headers: {
      backgroundColor: '#1e88e5' as string | undefined,
      fontSize: 13,
      textColor: 'white' as string | undefined, // 'rgba(0 0 0 / 60%)',
    },
    borders: {
      color: '#F0F0F0',
      radius: '8px 8px 0 0' as string | number,
    },
    rows: {
      fontSize: 14,
    },
  },
});
