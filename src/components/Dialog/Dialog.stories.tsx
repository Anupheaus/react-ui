/* eslint-disable no-console */
import { createStories } from '../../Storybook';
import { useDialog } from './useDialog';
import { Button } from '../Button';
import { createStyles, ThemesProvider } from '../../theme';
import { DialogTheme } from './DialogTheme';
import { Flex } from '../Flex';
import { useBinder, useBound } from '../../hooks';
import { DialogsContainer } from './DialogsContainer';

const useStyles = createStyles({
  background: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url(https://www.metoffice.gov.uk/binaries/content/gallery/metofficegovuk/hero-images/advice/maps-satellite-images/satellite-image-of-globe.jpg)',
    backgroundSize: 'cover',
    zIndex: -1,
  },
  text: {
    color: 'white',
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
        const { css, join } = useStyles();
        const bind = useBinder();
        const { Dialog, DialogContent, DialogActions, openDialog, closeDialog, OkButton } = useDialog();

        const handleClosed = useBound((reason: string) => {
          // eslint-disable-next-line no-console
          console.log('Dialog closed', reason);
        });

        return (<>
          <ThemesProvider themes={join(MyDialogTheme)}>
            <Flex tagName="dialog-test" valign="top" align="left" isVertical>
              <Flex gap={4}>
                <Button onClick={bind(async () => {
                  const reason = await openDialog();
                  console.log({ reason });
                })}>Open</Button>
                <Button onClick={bind(() => {
                  closeDialog('blah');
                })}>Close</Button>
              </Flex>
              <DialogsContainer>
                <Flex tagName="background" className={css.background} />
                <Flex className={css.text}>This should be blurred!</Flex>
                <Dialog title={'Test Dialog'} onClosed={handleClosed}>
                  <DialogContent>
                    This is the content of the Dialog
                  </DialogContent>
                  <DialogActions>
                    <OkButton />
                  </DialogActions>
                </Dialog>
              </DialogsContainer>
            </Flex>
          </ThemesProvider>
        </>);
      },
    }),
  },
}));
