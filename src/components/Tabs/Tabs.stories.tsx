import { createStories, StorybookComponent } from '../../Storybook';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { Flex } from '../Flex';
import { useTabs } from './useTabs';

interface Props {
  count?: number;
}

const DemoableTabs = ({ count }: Props) => {
  const { Tabs, Tab } = useTabs();
  return (
    <Flex fixedSize width={500} height={200}>
      <Tabs>
        {(count == null || count === 1) && <Tab label={'Tab 1'}>This is the content of tab 1</Tab>}
        {count == null && <Tab label={'Tab 2'}>This is the content of tab 2</Tab>}
      </Tabs>
    </Flex>
  );
};


createStories(({ createStory }) => ({
  name: 'Components/Tabs',
  module,
  stories: {
    ...generateUIStateStories(DemoableTabs),
    'Tabs': createStory({
      wrapInStorybookComponent: false,
      component: () => {
        return (<>
          <StorybookComponent title={'Tabs'}>
            <DemoableTabs />
          </StorybookComponent>
        </>);
      },
    }),

    'Single Tab': createStory({
      wrapInStorybookComponent: false,
      component: () => {
        return (<>
          <StorybookComponent title={'Tabs'}>
            <DemoableTabs count={1} />
          </StorybookComponent>
        </>);
      },
    }),
  },
}));