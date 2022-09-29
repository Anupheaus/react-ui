import { ReactNode } from 'react';
import { pureFC } from '../../anuxComponents';
import { HelpInfo } from '../HelpInfo';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import { Tooltip } from '../Tooltip';
import { LabelTheme } from './LabelTheme';

interface Props {
  className?: string;
  theme?: typeof LabelTheme;
  help?: ReactNode;
  isOptional?: boolean;
}

export const Label = pureFC<Props>()('Label', LabelTheme, ({ fontSize, fontWeight }) => ({
  label: {
    display: 'flex',
    flexGrow: 0,
    flexShrink: 0,
    fontSize: fontSize,
    fontWeight: fontWeight,
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
  isOptionalSkeleton: {
    maxHeight: 'calc(100% - 12px)',
    paddingTop: 4,
    marginBottom: -4,
    boxSizing: 'border-box',
  },
}), ({
  className,
  theme: {
    css,
    join,
  },
  help,
  isOptional = false,
  children = null,
}) => {
  if (children == null) return null;

  return (
    <Tag name="label" className={join(css.label, className)}>
      <Skeleton variant="text">{children}</Skeleton>
      {help != null && <HelpInfo>{help}</HelpInfo>}
      <Tooltip content="This field is optional" showArrow>
        {isOptional && <Skeleton variant="text" className={css.isOptionalSkeleton}><Tag name="label-is-optional" className={css.isOptional}>optional</Tag></Skeleton>}
      </Tooltip>
    </Tag>
  );
});
