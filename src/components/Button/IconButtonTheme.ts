import { createTheme } from '../../theme';
import { ButtonTheme } from '../Button';

export const IconButtonTheme = createTheme({
  id: 'IconButtonTheme',

  definition: {
    ...ButtonTheme.definition,
    borderRadius: '50%' as string | number,
    backgroundColor: 'transparent',
    activeBackgroundColor: 'rgba(0 0 0 / 20%)',
  },
});
