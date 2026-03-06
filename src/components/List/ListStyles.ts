import { createStyles } from '../../theme';

export const useListStyles = createStyles({
  list: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  listContainer: {
    flexGrow: 1,
    flexShrink: 1,
  },
});