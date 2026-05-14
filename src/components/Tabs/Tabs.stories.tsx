import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useTabs } from './useTabs';
import { createStory } from '../../Storybook/createStory';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { useBound } from '../../hooks';

const meta: Meta = {
  title: 'Navigation/Tabs',
};
export default meta;

type Story = StoryObj;

export const Horizontal: Story = createStory({
  width: 600,
  height: 400,
  render: () => {
    const { Tabs, Tab } = useTabs();
    return (
      <Tabs>
        <Tab label="First">Content for the first tab</Tab>
        <Tab label="Second">Content for the second tab</Tab>
        <Tab label="Third">Content for the third tab</Tab>
      </Tabs>
    );
  },
});
Horizontal.name = 'Horizontal (default)';

export const Vertical: Story = createStory({
  width: 600,
  height: 400,
  render: () => {
    const { Tabs, Tab } = useTabs();
    return (
      <Tabs orientation="vertical">
        <Tab label="First">Content for the first tab</Tab>
        <Tab label="Second">Content for the second tab</Tab>
        <Tab label="Third">Content for the third tab</Tab>
      </Tabs>
    );
  },
});
Vertical.name = 'Vertical';

export const ProgrammaticSelection: Story = createStory({
  width: 600,
  height: 460,
  render: () => {
    const { Tabs, Tab, selectTab } = useTabs();
    const goToFirst = useBound(() => selectTab(0));
    const goToSecond = useBound(() => selectTab(1));
    const goToThird = useBound(() => selectTab(2));
    return (
      <Flex isVertical gap={12}>
        <Flex gap={8} disableGrow>
          <Button onSelect={goToFirst} variant="bordered">First</Button>
          <Button onSelect={goToSecond} variant="bordered">Second</Button>
          <Button onSelect={goToThird} variant="bordered">Third</Button>
        </Flex>
        <Tabs>
          <Tab label="First">Content for the first tab</Tab>
          <Tab label="Second">Content for the second tab</Tab>
          <Tab label="Third">Content for the third tab</Tab>
        </Tabs>
      </Flex>
    );
  },
});
ProgrammaticSelection.name = 'Programmatic Selection';

export const AlwaysShowTabs: Story = createStory({
  width: 600,
  height: 400,
  render: () => {
    const { Tabs, Tab } = useTabs();
    return (
      <Tabs alwaysShowTabs>
        <Tab label="Only Tab">Content for the only tab</Tab>
      </Tabs>
    );
  },
});
AlwaysShowTabs.name = 'Always Show Tabs (single tab)';
