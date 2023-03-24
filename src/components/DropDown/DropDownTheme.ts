import { createTheme } from '../../theme';
import { InternalFieldTheme } from '../InternalField';
import { MenuTheme } from '../Menu';

export const DropDownTheme = createTheme({
  id: 'DropDownTheme',

  definition: {
    ...InternalFieldTheme.definition,
    menuItem: {
      ...MenuTheme.definition.menuItem,
    },
  },
});
