import { createStories } from '../../Storybook';
import { useDialog } from './useDialog';
import { Button } from '../Button';
import { createStyles, ThemesProvider } from '../../theme';
import { DialogTheme } from './DialogTheme';
import { Flex } from '../Flex';

const useStyles = createStyles({
  background: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url(https://www.metoffice.gov.uk/binaries/content/gallery/metofficegovuk/hero-images/advice/maps-satellite-images/satellite-image-of-globe.jpg)',
    backgroundSize: 'cover',
  },
});

const MyDialogTheme = DialogTheme.createVariant({
  definition: {
    titleBackgroundColor: '#7cd18b',
  },
});

createStories(({ createStory }) => ({
  module,
  name: 'Components/Dialog',
  stories: {
    'Main': createStory({
      width: 500,
      height: 500,
      component: () => {
        const { css } = useStyles();
        const { Dialog, DialogContent, DialogActions, openDialog, OkButton } = useDialog();

        return (<>
          <ThemesProvider themes={[MyDialogTheme]}>
            <Flex tagName="dialog-test" valign="top" align="left">
              <Flex tagName="background" className={css.background} />
              <Button onClick={openDialog}>Test</Button>
              <Dialog title={'Test Dialog'}>
                <DialogContent>
                  This is the content of the Dialog
                </DialogContent>
                <DialogActions>
                  <OkButton />
                </DialogActions>
              </Dialog>
            </Flex>
          </ThemesProvider>
        </>);
      },
    }),
  },
}));
