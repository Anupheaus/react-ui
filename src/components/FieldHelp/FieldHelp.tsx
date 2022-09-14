import { anuxPureFC } from '../../anuxComponents';
import { Theme } from '../../providers/ThemeProvider';
import { Icon } from '../Icon';
import { Tag } from '../Tag';
import { Tooltip } from '../Tooltip';
import { FieldHelpTheme } from './FieldHelpTheme';

interface Props {
  className?: string;
  theme?: typeof FieldHelpTheme;
}

export const FieldHelp = anuxPureFC<Props>('FieldHelp', ({
  className,
  theme,
  children = null,
}) => {
  const { classes, icons, join } = useTheme(theme);
  if (children == null) return null;
  return (
    <Tag name="field-help" className={join(classes.fieldHelp, classes.theme, className)}>
      <Tooltip content={children} showArrow>
        <Icon size={'small'}>{icons.help}</Icon>
      </Tooltip>
    </Tag>
  );
});

const useTheme = Theme.createThemeUsing(FieldHelpTheme, () => ({
  fieldHelp: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));