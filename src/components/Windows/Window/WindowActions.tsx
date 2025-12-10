import { createStyles } from '../../../theme';
import { createComponent } from '../../Component';
import type { ActionsToolbarProps } from '../../ActionsToolbar';
import { ActionsToolbar } from '../../ActionsToolbar';
import { useBound } from '../../../hooks';
import { useWindowValidation } from './WindowValidationContext';
import { useNotifications } from '../../Notifications';

interface Props extends ActionsToolbarProps { }

const useStyles = createStyles(({ windows: { content } }) => ({
  windowActions: {
    height: 'min-content',
    padding: content.active.padding,
    backgroundColor: content.active.backgroundColor,
    color: content.active.textColor,
    fontSize: content.active.textSize,
    fontWeight: content.active.textWeight,
  },
}));

export const WindowActions = createComponent('WindowActions', ({
  onSave,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const { isValid } = useWindowValidation();
  const { showError } = useNotifications();

  const save = useBound(() => {
    if (!isValid()) {
      showError('There are validation errors in this window that must be fixed before saving.');
      return;
    }
    onSave?.();
  });

  return (
    <ActionsToolbar {...props} onSave={onSave == null ? undefined : save} className={join(css.windowActions, props.className)} />
  );
});
