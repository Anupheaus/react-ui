import { pureFC } from '../../anuxComponents';
import { Tag } from '../Tag';

export const DialogContent = pureFC()('DialogContent', {
  dialogContent: {
    padding: '0px 24px',
  },
}, ({
  theme: { css },
  children = null,
}) => (
  <Tag name="dialog-content" className={css.dialogContent}>
    {children}
  </Tag>
));
