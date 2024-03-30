import { Meta, StoryObj } from '@storybook/react';
import { Dialog as DialogType } from './Dialog';
import { createStyles } from '../../theme';
import { useBinder, useBound } from '../../hooks';
import { useDialog } from './useDialog';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { StorybookComponent } from '../../Storybook';
import { Dialogs } from './Dialogs';

const meta: Meta<typeof DialogType> = {
  component: DialogType,
};
export default meta;

type Story = StoryObj<typeof DialogType>;

const useStyles = createStyles({
  background: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url(https://www.metoffice.gov.uk/binaries/content/gallery/metofficegovuk/hero-images/advice/maps-satellite-images/satellite-image-of-globe.jpg)',
    backgroundSize: 'cover',
    minHeight: 600,
  },
  text: {
    color: 'white',
  },
});

export const Default: Story = {
  args: {
  },
  render: () => {
    const { css } = useStyles();
    const bind = useBinder();
    const { Dialog, DialogContent, DialogActions, openDialog, closeDialog, OkButton } = useDialog();

    const handleClosed = useBound((reason: string) => {
      // eslint-disable-next-line no-console
      console.log('Dialog closed', reason);
    });

    return (
      <Flex tagName="dialog-test" valign="top" align="left" isVertical>
        <Flex gap={4}>
          <Button onClick={bind(async () => {
            await openDialog();
          })}>Open</Button>
          <Button onClick={bind(() => {
            closeDialog('blah');
          })}>Close</Button>
        </Flex>
        <StorybookComponent width={1200} height={600} showComponentBorders>
          <Dialogs shouldBlurBackground>
            <Flex tagName="background" className={css.background} />
            <Flex className={css.text}>This should be blurred!</Flex>
            <Dialog title={'Test Dialog'} allowCloseButton allowMaximizeButton onClosed={handleClosed}>
              <DialogContent>
                This is the content of the Dialog
              </DialogContent>
              <DialogActions>
                <OkButton />
              </DialogActions>
            </Dialog>
          </Dialogs>
        </StorybookComponent>
      </Flex>
    );
  },
};
