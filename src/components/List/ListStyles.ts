import { createStyles } from '../../theme';

export const useListStyles = createStyles({
  list: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    '&.full-height': {
      height: '100%',
    },
  },
  listContainer: {
    flexGrow: 1,
    flexShrink: 1,
  },
  // Doubled so it beats the field's own border, including its hover and focus colours.
  listContainerBorderless: {
    '&&': {
      borderWidth: 0,
      borderRadius: 0,
    },
  },
});