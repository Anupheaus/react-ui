import { pureFC } from '../../anuxComponents';
import { Icon } from '../Icon';
import { Tag } from '../Tag';
import { Tooltip } from '../Tooltip';
import { HelpInfoTheme } from './HelpInfoTheme';

interface Props {
  className?: string;
  theme?: typeof HelpInfoTheme;
}

export const HelpInfo = pureFC<Props>()('HelpInfo', HelpInfoTheme, () => ({
  fieldHelp: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}), ({
  className,
  theme: {
    css,
    icons,
    join,
  },
  children = null,
}) => {
  if (children == null) return null;
  return (
    <Tag name="field-help" className={join(css.fieldHelp, className)}>
      <Tooltip content={children} showArrow>
        <Icon size={'small'}>{icons.help}</Icon>
      </Tooltip>
    </Tag>
  );
});
