import { anuxPureFC } from '../../anuxComponents';
import { Theme } from '../../providers/ThemeProvider';
import { Tag } from '../Tag';
import { AssistiveLabelTheme } from './AssistiveLabelTheme';

interface Props {
  theme?: typeof AssistiveLabelTheme;
}

export const AssistiveLabel = anuxPureFC<Props>('AssistiveLabel', ({
  theme,
  children = null,
}) => {
  const { classes, join } = useTheme(theme);

  if (children == null) return null;
  return (
    <Tag name="assistive-label" className={join(classes.assistiveLabel, classes.theme)}>
      {children}
    </Tag>
  );
});

const useTheme = Theme.createThemeUsing(AssistiveLabelTheme, styles => ({
  assistiveLabel: {
    fontSize: styles.fontSize,
    fontWeight: styles.fontWeight,
  },
}));