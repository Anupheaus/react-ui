import { ReactNode } from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import { createComponent } from '../Component';
import { Icon, IconType } from '../Icon';
import { Tag } from '../Tag';
import { Tooltip } from '../Tooltip';

interface Props {
  className?: string;
  icon?: IconType;
  children?: ReactNode;
}

export const HelpInfo = createComponent({
  id: 'HelpInfo',

  styles: () => ({
    styles: {
      fieldHelp: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  }),

  render({
    className,
    icon = FiHelpCircle,
    children = null,
  }: Props, { css, join }) {
    if (children == null) return null;
    return (
      <Tag name="field-help" className={join(css.fieldHelp, className)}>
        <Tooltip content={children} showArrow>
          <Icon size={'small'}>{icon}</Icon>
        </Tooltip>
      </Tag>
    );
  },
});
