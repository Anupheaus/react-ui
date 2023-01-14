import { createTheme, DefaultTheme } from '../../../theme';

export const DraggableListItemTheme = createTheme({
  id: 'DraggableListItem',

  definition: {
    backgroundColor: DefaultTheme.field.default.backgroundColor,
    borderColor: DefaultTheme.field.default.borderColor,
    borderRadius: DefaultTheme.field.default.borderRadius,
    padding: '4px 8px',
  },
});
