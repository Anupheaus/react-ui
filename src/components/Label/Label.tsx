import { MouseEvent, ReactNode } from 'react';
import { useBound } from '../../hooks';
import { createComponent } from '../Component';
import { HelpInfo } from '../HelpInfo';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import { Tooltip } from '../Tooltip';
import { createStyles2 } from '../../theme';
import { useUIState } from '../../providers';

interface Props {
  className?: string;
  help?: ReactNode;
  isOptional?: boolean;
  children?: ReactNode;
  onClick?(event: MouseEvent<HTMLDivElement>): void;
}

const useStyles = createStyles2(({ field: { label, default: defaultField } }) => ({
  label: {
    display: 'flex',
    flex: 'none',
    ...defaultField,
    ...label,
    alignItems: 'center',
  },
  labelContent: {
    display: 'flex',
    flex: 'none',
    gap: 4,
    minHeight: 18,
    cursor: 'default',
    position: 'relative',
  },
  labelText: {
    display: 'flex',
    flex: 'none',
    alignItems: 'center',
    userSelect: 'none',

    '&.is-clickable': {
      cursor: 'pointer',
    },
  },
  isOptional: {
    fontSize: '0.8em',
    alignSelf: 'flex-end',
    margin: '0 0 1px 4px',
    fontWeight: 400,
  },
  isOptionalSkeleton: {
    maxHeight: 8,
    alignSelf: 'flex-end',
  },
}));

export const Label = createComponent('Label', ({
  className,
  help,
  isOptional = false,
  children = null,
  onClick,
}: Props) => {
  const { css, join } = useStyles();
  const { isReadOnly } = useUIState();

  const stopPropagation = useBound((event: MouseEvent) => event.stopPropagation());

  if (children == null) return null;

  return (
    <Tag name="label" className={join(css.label, className)}>
      <Tag name="label-content" className={join(css.labelContent)}>
        <Skeleton type="text">
          <Tag
            name="label-text"
            className={join(css.labelText, onClick != null && !isReadOnly && 'is-clickable')}
            onMouseDown={onClick != null ? stopPropagation : undefined}
            onClick={onClick}
          >
            {children}
          </Tag>
        </Skeleton>
        {help != null && <HelpInfo>{help}</HelpInfo>}
        <Tooltip content="This field is optional" showArrow>
          {isOptional && <Skeleton type="text" className={css.isOptionalSkeleton}><Tag name="label-is-optional" className={css.isOptional}>optional</Tag></Skeleton>}
        </Tooltip>
      </Tag>
    </Tag>
  );
});
