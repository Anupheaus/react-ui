import { createStyles } from '../../theme';

export const useInputStyles = createStyles(({ pseudoClasses }) => ({
  input: {
    outline: 'none',
    appearance: 'textfield',
    inset: 0,
    border: 0,
    padding: '0 8px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    backgroundColor: 'transparent!important',
    fontSize: 'unset',
    color: 'unset',
    fontFamily: 'unset',
    fontWeight: 'unset',
    width: '100%',

    [pseudoClasses.tablet]: {
      fontSize: '1.2em',
      padding: '8px 12px',
    },
  },
  textArea: {
    resize: 'none',
    outline: 'none',
    appearance: 'textfield',
    border: 0,
    height: 'auto',
    width: '100%',
    padding: '2px 8px',
    fontSize: 'unset',
    color: 'unset',
    fontFamily: 'unset',
    fontWeight: 'unset',

    [pseudoClasses.tablet]: {
      fontSize: '1.2em',
      padding: '8px 12px',
    },
  },
  textTransform_uppercase: { textTransform: 'uppercase' },
  textTransform_lowercase: { textTransform: 'lowercase' },
  textTransform_capitalize: { textTransform: 'capitalize' },
  textTransform_none: { textTransform: 'none' },
  textAreaFieldContainer: {
    flexGrow: 1,
  },
}));