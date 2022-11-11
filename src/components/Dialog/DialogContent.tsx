import { ReactNode } from 'react';
import { createComponent } from '../Component/createComponent';
import { Tag } from '../Tag';

interface Props {
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
    children = null,
  }: Props, { css }) {
    return (
      <Tag name="dialog-content" className={css.dialogContent}>
        {children}
      </Tag>
    );
  },
});
