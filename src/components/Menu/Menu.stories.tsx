import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import { Flex } from '../Flex';
import { Menu } from './Menu';
import type { ReactListItem } from '../../models';

const menuItems: ReactListItem[] = [
  { id: '1', text: 'Menu Item 1' },
  { id: '2', text: 'Menu Item 2' },
  { id: '3', text: 'Menu Item 3' },
  {
    id: '4',
    text: 'Menu Item 4',
    subItems: [
      { id: '4.1', text: 'Menu Item 4.1' },
      { id: '4.2', text: 'Menu Item 4.2' },
      { id: '4.3', text: 'Menu Item 4.3' },
      {
        id: '4.4',
        text: 'Menu Item 4.4',
        subItems: [
          { id: '4.4.1', text: 'Menu Item 4.4.1' },
          { id: '4.4.2', text: 'Menu Item 4.4.2' },
          { id: '4.4.3', text: 'Menu Item 4.4.3' },
        ],
      },
    ],
  },
  { id: '5', text: 'Menu Item 5' },
  { id: '6', text: 'Menu Item 6' },
  { id: '7', text: 'Menu Item 7' },
  { id: '8', text: 'Menu Item 8' },
  { id: '9', text: 'Menu Item 9' },
  { id: '10', text: 'Menu Item 10' },
];

const DemoableMenu = () => (
  <Flex fixedSize width={500} height={200}>
    <Menu items={menuItems} />
  </Flex>
);

const meta: Meta<typeof Menu> = {
  component: Menu,
};
export default meta;

type Story = StoryObj<typeof Menu>;

const config = {
  args: {},
  render: () => <DemoableMenu />,
} satisfies Story;

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const UIStates: Story = createStorybookComponentStates({ ...config, includeError: true });
UIStates.name = 'UI States';
UIStates.play = waitForStoryReady;
