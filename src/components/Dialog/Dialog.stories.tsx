import { createStories } from '../../Storybook';
import { useDialog, DialogTheme } from '.';
import { FiArrowRightCircle } from 'react-icons/fi';
import { Button } from '../Button';
import { Theme, ThemesProvider } from '../../providers/ThemeProvider';
import { PrimaryButtonTheme } from '../Button/Button.stories.utils';

const icons = Theme.icons.define({
  'close': ({ size }) => (<FiArrowRightCircle size={size} />),
});

const myDialogTheme = DialogTheme.createVariant({
  styles: {
    titleBackgroundColor: '#7cd18b', // PrimaryTheme.styles.backgroundColor,
  },
});

createStories(() => ({
  module,
  name: 'Components/Dialog',
  stories: {
    'Main': () => {
      const { Dialog, DialogContent, DialogActions, openDialog, OkButton } = useDialog();

      return (<>
        <ThemesProvider themes={[PrimaryButtonTheme, myDialogTheme]}>
          <Button onClick={openDialog}>Test</Button>
          <Dialog title={'Test Dialog'} icon={icons.close}>
            <DialogContent>
              This is the content of the Dialog
            </DialogContent>
            <DialogActions>
              <OkButton />
            </DialogActions>
          </Dialog>
        </ThemesProvider>
      </>);
    },
  },
}));
