import { createStyles } from '../../../theme';
import { createComponent } from '../../Component';
import type { ActionsToolbarProps } from '../../ActionsToolbar';
import { ActionsToolbar } from '../../ActionsToolbar';

interface Props extends ActionsToolbarProps { }

const useStyles = createStyles(({ windows: { content, actions } }) => ({
  windowActions: {
    height: 'min-content',
    padding: actions.padding,
    backgroundColor: content.active.backgroundColor,
    color: content.active.textColor,
    fontSize: content.active.textSize,
    fontWeight: content.active.textWeight,
  },
}));

export const WindowActions = createComponent('WindowActions', (props: Props) => {
  const { css, join } = useStyles();

  return (
    <ActionsToolbar {...props} className={join(css.windowActions, props.className)} />
  );
});
