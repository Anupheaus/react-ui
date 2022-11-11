import { CSSProperties, ReactNode, useMemo } from 'react';
import { createComponent } from '../Component/createComponent';
import { Tag } from '../Tag';

interface Props {
  className?: string;
  gap?: number | string;
  children?: ReactNode;
}

export const DialogContent = createComponent({
  id: 'DialogContent',

  styles: () => ({
    styles: {
      dialogContent: {
        padding: '0px 24px',
      },
    },
  }),

  render({
    className,
    gap,
    children = null,
  }: Props, { css, join }) {
    const style = useMemo<CSSProperties>(() => ({
      gap: typeof (gap) === 'number' ? `${gap}px` : gap,
    }), [gap]);

    return (
      <Tag name="dialog-content" className={join(css.dialogContent, className)} style={style}>
        {children}
      </Tag>
    );
  },
});
