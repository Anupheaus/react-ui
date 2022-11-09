import { ComponentProps, useState } from 'react';
import { UIState } from '../../providers';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories, StorybookComponent, StoryConfig } from '../../Storybook';
import { Checkbox } from './Checkbox';

interface StoryProps {
  isLoading?: boolean;
}

const EditableCheckbox = (props: ComponentProps<typeof Checkbox>) => {
  const [isChecked, setIsChecked] = useState(false);
  return <Checkbox {...props} value={isChecked} onChange={setIsChecked} />;
};

function generateStories({ isLoading = false }: StoryProps = {}, additionalProps: Partial<ComponentProps<typeof Checkbox>> = {}): StoryConfig {
  return {
    wrapInStorybookComponent: false,
    component: () => (
      <UIState isLoading={isLoading}>
        <StorybookComponent title="Normal">
          <EditableCheckbox label={'Label'} {...additionalProps} />
        </StorybookComponent>

        <StorybookComponent title="No Label">
          <EditableCheckbox {...additionalProps} />
        </StorybookComponent>

        <StorybookComponent title="With Help">
          <EditableCheckbox help={<>This is my help</>} {...additionalProps}>Label</EditableCheckbox>
        </StorybookComponent>

        <StorybookComponent title="Is Optional">
          <EditableCheckbox isOptional {...additionalProps}>Label</EditableCheckbox>
        </StorybookComponent>

        <StorybookComponent title="With Help and Is Optional">
          <EditableCheckbox help={<>This is my help</>} isOptional {...additionalProps}>Label</EditableCheckbox>
        </StorybookComponent>

        <StorybookComponent title="With Assistive Text">
          <EditableCheckbox assistiveText={<>This is assistive text</>} {...additionalProps}>Label</EditableCheckbox>
        </StorybookComponent>

        <StorybookComponent title="With Assistive Text and Help">
          <EditableCheckbox assistiveText={<>This is assistive text</>} help={<>This is my help</>} {...additionalProps}>Label</EditableCheckbox>
        </StorybookComponent>

        <StorybookComponent title="With Assistive Text, Help and Is Optional">
          <EditableCheckbox assistiveText={<>Assistive text</>} help={<>This is my help</>} isOptional {...additionalProps}>Label</EditableCheckbox>
        </StorybookComponent>
      </UIState>
    ),
  };
}

createStories(() => ({
  module,
  name: 'Components/Checkbox',
  stories: {
    ...generateUIStateStories(EditableCheckbox),
    'Label on Right': generateStories(),
    'Label on Left': generateStories({}, { labelPosition: 'left' }),
    'Label on Top': generateStories({}, { labelPosition: 'top' }),
    'Label on Bottom': generateStories({}, { labelPosition: 'bottom' }),
    'Loading': generateStories({ isLoading: true }),
  },
}));
