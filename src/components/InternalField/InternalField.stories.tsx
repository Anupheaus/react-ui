import { Meta, StoryObj } from '@storybook/react';
import { createStorybookComponentStates } from '../../Storybook';
import { InternalField } from './InternalField';

const meta: Meta<typeof InternalField> = {
  component: InternalField,
};
export default meta;

type Story = StoryObj<typeof InternalField>;

const config = {
  storyName: '',
  args: {
    tagName: 'field',
    label: 'Label',
  },
  render: props => (
    <InternalField {...props}>&nbsp;</InternalField>
  ),
} satisfies Story;

export const UIStates = createStorybookComponentStates({ ...config, includeError: true });
UIStates.storyName = 'UI States';
