import type { Meta, StoryObj } from '@storybook/react';
import { Dialog as DialogType } from './Dialog';
import { createStyles } from '../../theme';
import { useBound } from '../../hooks';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { StorybookComponent } from '../../Storybook';
import { Dialogs } from './Dialogs';
import { createDialog } from './createDialog';
import { useConfirmationDialog } from './useConfirmationDialog';
import type { ReactNode } from 'react';

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

interface Props {
  something: number;
  children: ReactNode;
}

const useTestDialog = createDialog('TestDialog', ({ Dialog, Content, Actions, OkButton }) => ({ children }: Props) => () => (
  <Dialog title={'Test Dialog'}>
    <Content>
      {children}
    </Content>
    <Actions>
      <OkButton />
    </Actions>
  </Dialog>
));


export const Default: Story = {
  args: {
  },
  render: () => {
    const { css } = useStyles();
    const { TestDialog, openTestDialog } = useTestDialog();
    const { ConfirmationDialog, openConfirmationDialog } = useConfirmationDialog();

    const onOpen = useBound(async () => {
      const result = await openTestDialog();
      // eslint-disable-next-line no-console
      console.log('Dialog closed with result:', result);
    });

    const onConfirm = useBound(async () => {
      const result = await openConfirmationDialog('Confirm?', 'Are you sure?');
      // eslint-disable-next-line no-console
      console.log('Confirmation dialog closed with result:', result);
    });

    return (
      <Flex tagName="dialog-test" valign="top" align="left" isVertical>
        <Flex gap={4}>
          <Button onClick={onOpen}>Open</Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </Flex>
        <StorybookComponent width={1200} height={600} showComponentBorders>
          <Dialogs shouldBlurBackground>
            <Flex tagName="background" className={css.background} />
            <Flex className={css.text}>This should be blurred!</Flex>
            <TestDialog something={123}>
              This is the content of the dialog
            </TestDialog>
            <ConfirmationDialog title="Should be overridden" message="Should be overridden" />
          </Dialogs>
        </StorybookComponent>
      </Flex>
    );
  },
};
