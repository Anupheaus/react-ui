import { createStories } from '../../Storybook';
import { useDialog, DialogTheme } from '.';
import { FiArrowRightCircle } from 'react-icons/fi';
import { Button } from '../Button';
import { createThemeIcons, ThemesProvider } from '../../theme';

const icons = createThemeIcons({
  arrow: FiArrowRightCircle,
});

const MyDialogTheme = DialogTheme.createVariant({
  definition: {
    titleBackgroundColor: '#7cd18b',
  },
});

createStories(() => ({
  module,
  name: 'Components/Dialog',
  stories: {
    'Main': () => {

      const { Dialog, DialogContent, DialogActions, openDialog, OkButton } = useDialog();

      return (<>
        <ThemesProvider themes={[MyDialogTheme]}>
          <Button onClick={openDialog}>Test</Button>
          <Dialog title={'Test Dialog'} icon={icons.arrow}>
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
