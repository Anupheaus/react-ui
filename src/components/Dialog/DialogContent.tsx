import { createLegacyStyles } from '../../theme/createStyles';
import { CSSProperties, ReactNode, useMemo } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';

interface Props {
  className?: string;
  gap?: number | string;
  children?: ReactNode;
}
const useStyles = createLegacyStyles(() => ({
  styles: {
    dialogContent: {
      display: 'flex',
      flex: 'auto',
      flexDirection: 'column',
      //padding: '0px 24px',
    },
  },
}));

export const DialogContent = createComponent('DialogContent', ({
  className,
  gap,
  children = null,
}: Props) => {
  const { css, join } = useStyles();
  const style = useMemo<CSSProperties>(() => ({
    gap: typeof (gap) === 'number' ? `${gap}px` : gap,
  }), [gap]);

  return (
    <Tag name="dialog-content" className={join(css.dialogContent, className)} style={style}>
      {children}
    </Tag>
  );
});
