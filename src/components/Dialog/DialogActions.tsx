import { anuxPureFC } from '../../anuxComponents';
import { Theme } from '../../providers/ThemeProvider';
import { Flex } from '../Flex';
import { DialogTheme } from './DialogTheme';

interface Props {

}

export const DialogActions = anuxPureFC<Props>('DialogActions', ({
  children = null,
}) => {
  const { classes } = useTheme();

  return (
    <Flex tagName="dialog-actions" className={classes.dialogActions} valign={'center'} align={'right'} gap={12}>
      {children}
    </Flex>
  );
});

const useTheme = Theme.createThemeUsing(DialogTheme, () => ({
  dialogActions: {
    padding: '0px 14px',
  },
}));