import { createLegacyStyles } from '../../theme/createStyles';
import { ReactNode } from 'react';
import { createComponent } from '../Component';
import { Flex } from '../Flex';

interface Props {
  children?: ReactNode;
}
const useStyles = createLegacyStyles(() => ({
  styles: {
    dialogActions: {
      //padding: '0px 14px',
    },
  },
}));

export const DialogActions = createComponent('DialogActions', ({
  children = null,
}: Props) => {
  const { css } = useStyles();
  return (
    <Flex tagName="dialog-actions" className={css.dialogActions} valign={'center'} align={'right'} gap={12}>
      {children}
    </Flex>
  );
});
