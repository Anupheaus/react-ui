import { pureFC } from '../../anuxComponents';
import { Flex } from '../Flex';

export const DialogActions = pureFC()('DialogActions', {
  dialogActions: {
    padding: '0px 14px',
  },
}, ({
  theme: { css },
  children = null,
}) => (
  <Flex tagName="dialog-actions" className={css.dialogActions} valign={'center'} align={'right'} gap={12}>
    {children}
  </Flex>
));
