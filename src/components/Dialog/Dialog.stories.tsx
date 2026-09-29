import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Dialog as DialogType } from './Dialog';
import { createStyles } from '../../theme';
import { useBound } from '../../hooks';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { StorybookComponent } from '../../Storybook/StorybookComponent2';
import { Dialogs } from './Dialogs';
import { createDialog } from './createDialog';
import { useDialog } from './useDialog';
import { useConfirmationDialog } from './useConfirmationDialog';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { DropDown } from '../DropDown';
import { Radio } from '../Radio';

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

const TestDialogDefinition = createDialog('TestDialog', ({ Dialog, Content, Actions, OkButton }) => (something?: number, children?: ReactNode) => (
  <Dialog title={`Test Dialog ${something ?? ''}`}>
    <Content>
      {children ?? 'This is the content of the dialog'}
    </Content>
    <Actions>
      <OkButton />
    </Actions>
  </Dialog>
));

export const Default: Story = {
  args: {},
  render: () => {
    const { css } = useStyles();
    const { openTestDialog } = useDialog(TestDialogDefinition);
    const { openConfirmationDialog } = useConfirmationDialog();

    const onOpen = useBound(async () => {
      const result = await openTestDialog(123, 'This is the content of the dialog');
       
      console.log('Dialog closed with result:', result);
    });

    const onConfirm = useBound(async () => {
      const result = await openConfirmationDialog('Confirm?', 'Are you sure?');
       
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
          </Dialogs>
        </StorybookComponent>
      </Flex>
    );
  },
};

export const MobileBottomSheet: Story = {
  args: {},
  parameters: { device: 'mobile' },
  render: () => {
    const { css } = useStyles();
    const { openTestDialog } = useDialog(TestDialogDefinition);

    const onOpen = useBound(async () => {
      await openTestDialog(123, 'This dialog should slide up from the bottom as a sheet on mobile.');
    });

    return (
      <Flex tagName="dialog-test" valign="top" align="left" isVertical>
        <Flex gap={4}>
          <Button onClick={onOpen}>Open</Button>
        </Flex>
        <StorybookComponent width={390} height={700} showComponentBorders>
          <Dialogs shouldBlurBackground>
            <Flex tagName="background" className={css.background} />
            <Flex className={css.text}>This should be blurred behind the sheet!</Flex>
          </Dialogs>
        </StorybookComponent>
      </Flex>
    );
  },
};

const PRODUCT_TYPES = [{ id: 'roller', text: 'Roller Blind' }, { id: 'vertical', text: 'Vertical Blind' }];
const TUBE_SIZES = [{ id: '25', text: '25mm' }, { id: '32', text: '32mm' }, { id: '40', text: '40mm' }, { id: '45', text: '45mm' }];

/** Content that grows after the dialog opens: picking a type adds fields. The dialog grows to fit them (sc-693). */
const GrowingContent = () => {
  const [type, setType] = useState<string>();
  const [tube, setTube] = useState<string>();
  const [chain, setChain] = useState<string>();
  const extraFields = useMemo(() => (type == null ? null : (
    <>
      <Radio label="Tube size" values={TUBE_SIZES} value={tube} onChange={setTube} isHorizontal />
      <Radio label="Chain side" values={[{ id: 'left', text: 'Left' }, { id: 'right', text: 'Right' }]} value={chain} onChange={setChain} isHorizontal />
      <DropDown label="Fabric range" values={PRODUCT_TYPES} />
    </>
  )), [type, tube, chain]);
  return (
    <Flex isVertical gap={8}>
      <DropDown label="Product type" values={PRODUCT_TYPES} value={type} onChange={setType} />
      {extraFields}
    </Flex>
  );
};

const GrowingDialogDefinition = createDialog('GrowingDialog', ({ Dialog, Content, Actions, OkButton }) => () => (
  <Dialog title="Add a product" minWidth={420}>
    <Content>
      <GrowingContent />
    </Content>
    <Actions>
      <OkButton />
    </Actions>
  </Dialog>
));

export const ContentThatGrows: Story = {
  args: {},
  render: () => {
    const { openGrowingDialog } = useDialog(GrowingDialogDefinition);
    const onOpen = useBound(() => { void openGrowingDialog(); });
    return (
      <Flex tagName="dialog-test" valign="top" align="left" isVertical>
        <Button onClick={onOpen}>Open</Button>
        <StorybookComponent width={1200} height={600} showComponentBorders>
          <Dialogs />
        </StorybookComponent>
      </Flex>
    );
  },
};
ContentThatGrows.name = 'Content that grows after opening';
