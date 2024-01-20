import { createTheme, DefaultTheme } from '../../../theme';

export const DraggableListItemTheme = createTheme({
  id: 'DraggableListItem',

  definition: {
    ...DefaultTheme.field.value.normal,
    padding: '4px 8px',
  },
});
