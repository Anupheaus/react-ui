import { faker } from '@faker-js/faker';
import { Meta, StoryObj } from '@storybook/react';
import { createStory } from '../../Storybook';
import { ReactListItem } from '../../models';
import { useState } from 'react';
import { InternalDropDown } from './InternalDropDown';

faker.seed(10121);

const staticItems = new Array(150).fill(0).map((): ReactListItem => {
  return {
    id: faker.string.uuid(),
    text: '',
    label: <span>{faker.person.fullName()}</span>,
  };
});

const meta: Meta<typeof InternalDropDown> = {
  component: InternalDropDown,
};
export default meta;

type Story = StoryObj<typeof InternalDropDown>;

export const StaticItems: Story = createStory<typeof InternalDropDown>({
  args: {

  },
  width: 240,
  height: 300,
  render: () => {
    const [value, setValue] = useState<string>();

    return (
      <InternalDropDown
        tagName="internal-dropdown"
        value={value}
        values={staticItems}
        onChange={setValue}
        wide
      />
    );
  },
});
