import { createLegacyStyles } from '../../theme/createStyles';
import { MouseEvent, ReactNode } from 'react';
import { useBound } from '../../hooks';
import { createComponent } from '../Component';
import { HelpInfo } from '../HelpInfo';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import { Tooltip } from '../Tooltip';
import { LabelTheme } from './LabelTheme';

interface Props {
  className?: string;
  help?: ReactNode;
  isOptional?: boolean;
  children?: ReactNode;
  onClick?(event: MouseEvent<HTMLDivElement>): void;
}
const useStyles = createLegacyStyles(({ useTheme }) => {
  const { fontSize, fontWeight } = useTheme(LabelTheme);
  return {
    styles: {
      label: {
        display: 'flex',
        flex: 'none',
        fontSize: fontSize,
        fontWeight: fontWeight,
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
      },
      isClickable: {
        cursor: 'pointer',
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
    },
  };
});

export const Label = createComponent('Label', ({
  className,
  help,
  isOptional = false,
  children = null,
  onClick,
}: Props) => {
  const { css, join } = useStyles();
  if (children == null) return null;

  const stopPropagation = useBound((event: MouseEvent) => event.stopPropagation());

  return (
    <Tag name="label" className={join(css.label, className)}>
      <Tag name="label-content" className={join(css.labelContent)}>
        <Skeleton type="text">
          <Tag
            name="label-text"
            className={join(css.labelText, onClick != null && css.isClickable)}
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
