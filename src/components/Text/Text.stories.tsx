import { ComponentProps } from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import { anuxPureFC } from '../../anuxComponents';
import { useUpdatableState } from '../../hooks/useUpdatableState';
import { Theme } from '../../providers/ThemeProvider';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories, StorybookComponent, StoryConfig } from '../../Storybook';
import { Button } from '../Button';
import { Text } from './Text';

const icons = Theme.icons.define({
  help: ({ size }) => (<FiHelpCircle size={size} />),
});

const EditableText = anuxPureFC<ComponentProps<typeof Text>>('EditableText', props => {
  const [value, setValue] = useUpdatableState(() => props.value, [props.value]);

  return (<Text width={150} label={'Label'} {...props} value={value} onChange={setValue} />);
});

function generateTextStories(): StoryConfig {
  return {
    wrapInStorybookComponent: false,
    component: () => (<>
      <StorybookComponent title="Normal">
        <EditableText />
      </StorybookComponent>

      <StorybookComponent title="With Button">
        <EditableText buttons={[<Button key={'help'} icon={icons.help} />]} />
      </StorybookComponent>

      <StorybookComponent title="Is Optional">
        <EditableText isOptional />
      </StorybookComponent>

      <StorybookComponent title="With Help">
        <EditableText help={<>This is my help</>} />
      </StorybookComponent>

      <StorybookComponent title="With Assistive Help">
        <EditableText assistiveHelp={<>This is my help</>} />
      </StorybookComponent>
    </>),
  };
}

createStories(() => ({
  module,
  name: 'Components/Text',
  stories: {
    ...generateUIStateStories(props => <EditableText {...props} />),
    'Tests': generateTextStories(),
  },
}));
