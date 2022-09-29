import { pureFC } from '../../anuxComponents';
import { Tag } from '../Tag';
import { AssistiveLabelTheme } from './AssistiveLabelTheme';

interface Props {
  isError?: boolean;
}

export const AssistiveLabel = pureFC<Props>()('AssistiveLabel', AssistiveLabelTheme, ({ errorTextColor, fontSize, fontWeight }) => ({
  assistiveLabel: {
    fontSize,
    fontWeight,
    cursor: 'default',
  },
  isError: {
    color: errorTextColor,
  },
}), ({
  isError,
  children = null,
  theme: {
    css,
    join,
  },
}) => {
  if (children == null) return null;
  return (
    <Tag
      name="assistive-label"
      className={join(
        css.assistiveLabel,
        isError && css.isError,
      )}>
      {children}
    </Tag>
  );
});
