import type { Meta, StoryObj } from '@storybook/react';
import { createStorybookComponentStates } from '../../Storybook';
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


export const useFieldsStory = {
  storyName: '',
  args: {},
  render: () => {
    const [record, setRecord] = useState({ name: '' });
    const { Field: FieldComponent } = useFields(record, setRecord);
    return (
      <FieldComponent component={Text} field="name" label="Name" wide />
    );
  },
} satisfies Story;
useFieldsStory.storyName = 'useFields';
