import { ReactNode } from 'react';
import { anuxPureFC } from '../../anuxComponents';
import { Theme } from '../../providers/ThemeProvider';
import { FieldHelp } from '../FieldHelp';
import { Tag } from '../Tag';
import { Tooltip } from '../Tooltip';
import { LabelTheme } from './LabelTheme';

interface Props {
  className?: string;
  theme?: typeof LabelTheme;
  help?: ReactNode;
  isOptional?: boolean;
}

export const Label = anuxPureFC<Props>('Label', ({
  className,
  theme,
  help,
  isOptional = false,
  children = null,
}) => {
  const { classes, join } = useTheme(theme);

  if (children == null) return null;

  return (
    <Tag name="label" className={join(classes.label, classes.theme, className)}>
      {children}
      {help != null && <FieldHelp>{help}</FieldHelp>}
      <Tooltip content="This field is optional" showArrow>
        {isOptional && <Tag name="label-is-optional" className={classes.isOptional}>optional</Tag>}
      </Tooltip>
    </Tag>
  );
});

const useTheme = Theme.createThemeUsing(LabelTheme, styles => ({
  label: {
    display: 'flex',
    flexGrow: 0,
    flexShrink: 0,
    fontSize: styles.fontSize,
    fontWeight: styles.fontWeight,
    gap: 4,
    minHeight: 18,
    alignItems: 'center',
  },
  isOptional: {
    fontSize: '0.8em',
    alignSelf: 'flex-end',
    margin: '0 0 1px 4px',
    fontWeight: 400,
  },
}));
