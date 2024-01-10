import { createStyles2 } from '../../theme';

export const useInputStyles = createStyles2({
  input: {
    outline: 'none',
    appearance: 'textfield',
    position: 'absolute',
    inset: 0,
    border: 0,
    padding: '0 8px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    backgroundColor: 'transparent!important',

    '&.is-read-only': {
      cursor: 'default',
      pointerEvents: 'none',
      userSelect: 'none',
      opacity: 0.7,
    },
  },
});