import type { MouseEvent, ReactNode } from 'react';
import { useBound } from '../../hooks';
import { createComponent } from '../Component';
import { HelpInfo } from '../HelpInfo';
import { NoSkeletons, Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
// import { Tooltip } from '../Tooltip';
import { createStyles } from '../../theme';
import { useUIState } from '../../providers';

interface Props {
  className?: string;
  help?: ReactNode;
  isOptional?: boolean;
  children?: ReactNode;
  wide?: boolean;
  onClick?(event: MouseEvent<HTMLDivElement>): void;
}

const useStyles = createStyles(({ fields: { label } }) => ({
  label: {
    display: 'flex',
    flex: 'none',
    fontSize: label.normal.textSize,
    fontWeight: label.normal.textWeight,
    color: label.normal.textColor,
    alignItems: 'center',
    minWidth: 'max-content',

    '&.full-width': {
      flexGrow: 1,
    },
  },
  labelContent: {
    display: 'flex',
    flex: 'none',
    minHeight: 18,
    cursor: 'default',
    position: 'relative',

    '&.full-width': {
      flexGrow: 1,
    },
  },
  labelText: {
    display: 'flex',
    flex: 'none',
    alignItems: 'center',
  },
  isClickable: {
    cursor: 'pointer',
  },
  isRequired: {
    fontSize: '0.8em',
    alignSelf: 'flex-start',
    margin: '0 0 1px 1px',
    fontWeight: 400,
  },
  isOptionalSkeleton: {
    maxHeight: 8,
    alignSelf: 'flex-end',
  },
  help: {
    marginLeft: 4,
  },
}));

export const Label = createComponent('Label', ({
  className,
  help,
  wide = false,
  children = null,
  onClick,
}: Props) => {
  const { css, join } = useStyles();
  const { isReadOnly } = useUIState();

  const stopPropagation = useBound((event: MouseEvent) => event.stopPropagation());

  const handleClick = useBound((event: MouseEvent<HTMLDivElement>) => {
    if (isReadOnly) return;
    onClick?.(event);
  });

  if (children == null) return null;

  return (
    <Tag name="label" className={join(css.label, wide && 'full-width', className)}>
      <Tag name="label-content" className={join(css.labelContent, wide && 'full-width')}>
        <Skeleton type="text" useRandomWidth={children === ''} wide={wide}>
          {children === '' ? null : (
            <NoSkeletons>
              <Tag
                name="label-text"
                className={join(css.labelText, onClick != null && !isReadOnly && css.isClickable)}
                onMouseDown={onClick != null ? stopPropagation : undefined}
                onClick={handleClick}
              >
                {children}
              </Tag>
            </NoSkeletons>
          )}
        </Skeleton>
        {/* <Tooltip content="This field is required" showArrow>
          {!isOptional && <Skeleton type="circle" className={css.isOptionalSkeleton}><Tag name="label-is-required" className={css.isRequired}>*</Tag></Skeleton>}
        </Tooltip> */}
        {help != null && <HelpInfo className={css.help}>{help}</HelpInfo>}
      </Tag>
    </Tag>
  );
});
