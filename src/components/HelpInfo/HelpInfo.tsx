import { ReactNode } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { Tooltip } from '../Tooltip';
import { Icon } from '../Icon';
import { createStyles2 } from '../../theme';

interface Props {
  className?: string;
  icon?: ReactNode;
  children?: ReactNode;
}
const useStyles = createStyles2({
  fieldHelp: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const HelpInfo = createComponent('HelpInfo', ({
  className,
  icon = <Icon name={'help'} size={'small'} />,
  children = null,
}: Props) => {
  const { css, join } = useStyles();
  if (children == null) return null;
  return (
    <Tag name="field-help" className={join(css.fieldHelp, className)}>
      <Tooltip content={children} showArrow>
        {icon}
      </Tooltip>
    </Tag>
  );
});
