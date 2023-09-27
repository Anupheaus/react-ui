import { createTheme } from '../../theme';
import { ButtonTheme } from './ButtonTheme';

export const IconButtonTheme = createTheme({
  id: 'IconButtonTheme',

  definition: {
    ...ButtonTheme.definition,
    default: {
      ...ButtonTheme.definition.default,
      backgroundColor: 'transparent',
    },
    active: {
      ...ButtonTheme.definition.active,
      backgroundColor: 'rgba(0 0 0 / 20%)',
    },
    borderRadius: '50%' as string | number,
  },
});
