import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import { Field } from './Field';
import { useState } from 'react';
import { useFields } from './useFields';
import { Text } from '../Text';

const meta: Meta<typeof Field> = {
  component: Field,
};
export default meta;

type Story = StoryObj<typeof Field>;

const config = {
  args: {
    tagName: 'field',
    label: 'Label',
  },
  render: (props: React.ComponentProps<typeof Field>) => (
    <Field {...props}>&nbsp;</Field>
  ),
} satisfies Story;

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const UIStates: Story = createStorybookComponentStates({ ...config, includeError: true });
UIStates.name = 'UI States';
UIStates.play = waitForStoryReady;

export const useFieldsStory: Story = {
  name: 'useFields',
  args: {},
  render: () => {
    const [record, setRecord] = useState({ name: '' });
    const { Field: FieldComponent } = useFields(record, setRecord);
    return (
      <FieldComponent component={Text} field="name" label="Name" wide />
    );
  },
};
