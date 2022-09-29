import { UIState } from '../../providers';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories, StorybookComponent, StoryConfig } from '../../Storybook';
import { Label } from './Label';

interface StoryProps {
  isLoading?: boolean;
}

function generateStories({ isLoading = false }: StoryProps = {}): StoryConfig {
  return {
    wrapInStorybookComponent: false,
    component: () => (
      <UIState isLoading={isLoading}>
        <StorybookComponent title="Normal">
          <Label>Label</Label>
        </StorybookComponent>

        <StorybookComponent title="No Label">
          <Label />
        </StorybookComponent>

        <StorybookComponent title="With Help">
          <Label help={<>This is my help</>}>Label</Label>
        </StorybookComponent>

        <StorybookComponent title="Is Optional">
          <Label isOptional>Label</Label>
        </StorybookComponent>

        <StorybookComponent title="With Help and Is Optional">
          <Label help={<>This is my help</>} isOptional>Label</Label>
        </StorybookComponent>
      </UIState>
    ),
  };
}

const DemoLabel = () => <Label>Label</Label>;

createStories(() => ({
  module,
  name: 'Components/Label',
  stories: {
    ...generateUIStateStories(DemoLabel),
    'Default': generateStories(),
    'Loading': generateStories({ isLoading: true }),
  },
}));
