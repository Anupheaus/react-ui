import { ReactNode } from 'react';
import { createComponent } from '../Component';
import { Flex } from '../Flex';

interface Props {
  children?: ReactNode;
}

export const DialogActions = createComponent({
  id: 'DialogActions',

  styles: () => ({
    styles: {
      dialogActions: {
        padding: '0px 14px',
      },
    },
  }),

  render({
    children = null,
  }: Props, { css }) {
    return (
      <Flex tagName="dialog-actions" className={css.dialogActions} valign={'center'} align={'right'} gap={12}>
        {children}
      </Flex>
    );
  },
});
