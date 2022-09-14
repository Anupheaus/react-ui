import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories, StorybookComponent, StoryConfig } from '../../Storybook';
import { Label } from './Label';

function generateStories(): StoryConfig<Props> {
  return {
    wrapInStorybookComponent: false,
    component: props => (<>
      <StorybookComponent title="Normal">
        <Label {...props} />
      </StorybookComponent>

      <StorybookComponent title="No Label">
        <Label />
      </StorybookComponent>

      <StorybookComponent title="With Help">
        <Label {...props} help={<>This is my help</>} />
      </StorybookComponent>

      <StorybookComponent title="Is Optional">
        <Label {...props} isOptional />
      </StorybookComponent>

      <StorybookComponent title="With Help and Is Optional">
        <Label {...props} help={<>This is my help</>} isOptional />
      </StorybookComponent>
    </>),
  };
}

interface Props {
  children: string;
}

createStories<Props>(() => ({
  module,
  name: 'Components/Label',
  props: {
    children: { name: 'Value', defaultValue: 'Label', type: 'string' },
  },
  stories: {
    ...generateUIStateStories(props => <Label {...props} />),
    'Tests': generateStories(),
  },
}));
