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
});