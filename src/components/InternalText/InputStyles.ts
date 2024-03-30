import { createStyles } from '../../theme';

export const useInputStyles = createStyles({
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
    fontSize: 'unset',
    color: 'unset',
    fontFamily: 'unset',
    fontWeight: 'unset',
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
  },
  textTransform_uppercase: { textTransform: 'uppercase' },
  textTransform_lowercase: { textTransform: 'lowercase' },
  textTransform_capitalize: { textTransform: 'capitalize' },
  textTransform_none: { textTransform: 'none' },
  textAreaFieldContainer: {
    flexGrow: 1,
  },
});