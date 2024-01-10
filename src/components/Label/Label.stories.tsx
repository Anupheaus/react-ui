import { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';
import { createStorybookComponentStates } from '../../Storybook';

const meta: Meta<typeof Label> = {
  component: Label,
};
export default meta;

type Story = StoryObj<typeof Label>;

const config = {
  storyName: '',
  args: {
    children: 'Label',
    isOptional: false,
  },
  render: props => (
    <Label {...props} />
  ),
} satisfies Story;

export const UIStates = createStorybookComponentStates(config);
UIStates.storyName = 'UI States';

export const UIStatesWithOptional = createStorybookComponentStates({ ...config, args: { ...config.args, isOptional: true } });
UIStatesWithOptional.storyName = 'UI States as Optional';

export const UIStatesWithHelp = createStorybookComponentStates({ ...config, args: { ...config.args, help: 'This is my help' } });
UIStatesWithHelp.storyName = 'UI States with Help';

export const UIStatesWithOptionalAndHelp = createStorybookComponentStates({ ...config, args: { ...config.args, isOptional: true, help: 'This is my help' } });
UIStatesWithOptionalAndHelp.storyName = 'UI States as Optional with Help';
