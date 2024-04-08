import { Meta, StoryObj } from '@storybook/react';
import { createStorybookComponentStates } from '../../Storybook';
import { Field } from './Field';

const meta: Meta<typeof Field> = {
  component: Field,
};
export default meta;

type Story = StoryObj<typeof Field>;

const config = {
  storyName: '',
  args: {
    tagName: 'field',
    label: 'Label',
  },
  render: props => (
    <Field {...props}>&nbsp;</Field>
  ),
} satisfies Story;

export const UIStates: Story = createStorybookComponentStates({ ...config, includeError: true });
UIStates.storyName = 'UI States';
