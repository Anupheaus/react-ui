import { ComponentProps, ReactElement, ReactNode } from 'react';
import { anuxPureFC } from '../../anuxComponents';
import { useBinder } from '../../hooks';
import { Theme } from '../../providers/ThemeProvider';
import { useRipple } from '../Ripple';
import { Tag } from '../Tag';
import { Label } from '../Label';
import { TextTheme } from './TextTheme';
import { Button } from '../Button';
import { Toolbar } from '../Toolbar';
import { AssistiveLabel } from '../AssistiveLabel';

interface Props {
  theme?: typeof TextTheme;
  label?: ReactNode;
  value?: string;
  width?: string | number;
  buttons?: ReactElement<ComponentProps<typeof Button>>[];
  isOptional?: boolean;
  help?: ReactNode;
  assistiveHelp?: ReactNode;
  onChange?(value: string): void;
}

export const Text = anuxPureFC<Props>('Text', ({
  theme,
  label,
  value,
  width,
  buttons,
  isOptional,
  help,
  assistiveHelp,
  onChange
}) => {
  const { classes, } = useTheme(theme);
  const { UIRipple, rippleTarget } = useRipple();
  const bind = useBinder();

  return (
    <Tag name="text" className={classes.text} width={width}>
      <Label isOptional={isOptional} help={help}>{label}</Label>
      <Tag name="text-input" ref={rippleTarget} className={classes.textInput}>
        <UIRipple />
        <input
          type="text"
          className={classes.input}
          value={value ?? ''}
          onChange={bind(event => onChange?.(event.target.value))}
        />
        {buttons instanceof Array && <Toolbar className={classes.toolbar}>{buttons}</Toolbar>}
      </Tag>
      <AssistiveLabel>{assistiveHelp}</AssistiveLabel>
    </Tag >
  );
});

const useTheme = Theme.createThemeUsing(TextTheme, styles => ({
  text: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    minWidth: 50,
    gap: 4,
  },
  textInput: {
    display: 'flex',
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: styles.backgroundColor,
    padding: '0 12px',
    borderColor: styles.borderColor,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: styles.borderRadius,
    minHeight: 34,
    alignItems: 'center',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  },
  input: {
    outline: 'none',
    appearance: 'none',
    border: 0,
    padding: 0,
    width: 0,
    flexGrow: 1,
    textOverflow: 'ellipsis',
  },
  toolbar: {
    borderRadius: 0,
    borderWidth: 0,
    borderLeftWidth: 1,
    marginRight: -12,
    marginLeft: 12,
  },
}));