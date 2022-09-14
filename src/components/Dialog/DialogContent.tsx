import { anuxPureFC } from '../../anuxComponents';
import { Theme } from '../../providers/ThemeProvider';
import { Tag } from '../Tag';
import { DialogTheme } from './DialogTheme';

interface Props {

}

export const DialogContent = anuxPureFC<Props>('DialogContent', ({
  children = null,
}) => {
  const { classes } = useTheme();

  return (
    <Tag name="dialog-content" className={classes.dialogContent}>
      {children}
    </Tag>
  );
});

const useTheme = Theme.createThemeUsing(DialogTheme, () => ({
  dialogContent: {
    padding: '0px 24px',
  },
}));
