import { Meta, StoryObj } from '@storybook/react';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { StorybookComponent } from '../../Storybook';
import { createUseDialog } from './createUseDialog';
import { Dialog as DialogType } from './Dialog';
import { useBinder } from '../../hooks';

const meta: Meta<typeof DialogType> = {
  component: DialogType,
};
export default meta;

type Story = StoryObj<typeof DialogType>;

const useTestDialog = createUseDialog('TestDialog', ({ Dialog, Content, Actions, OkayButton }) => () => props => (
  <Dialog title={'Test Dialog'} {...props}>
    <Content>
      This is the content of the Dialog
    </Content>
    <Actions>
      <OkayButton label="Sure" />
    </Actions>
  </Dialog>
));

export const Default: Story = {
  args: {
  },
  render: () => {
    const { TestDialog, openTestDialog, closeTestDialog } = useTestDialog();
    const bind = useBinder();

    return (
      <Flex tagName="dialog-test" valign="top" align="left" isVertical>
        <Flex gap={4}>
          <Button onClick={openTestDialog}>Open</Button>
          <Button onClick={bind(() => closeTestDialog())}>Close</Button>
        </Flex>
        <StorybookComponent width={1200} height={600} showComponentBorders>
          <TestDialog title={'Override Title'} />
        </StorybookComponent>
      </Flex>
    );
  },
};
