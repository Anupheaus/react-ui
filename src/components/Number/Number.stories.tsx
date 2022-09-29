import { pureFC } from '../../anuxComponents';
import { PropsOf } from '../../extensions';
import { useUpdatableState } from '../../hooks/useUpdatableState';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories } from '../../Storybook';
import { generateInternalTextStories } from '../InternalText/InternalText.stories.utils';
import { Number } from './Number';


const EditableNumber = pureFC<PropsOf<typeof Number>>()('EditableNumber', props => {
  const [value, setValue] = useUpdatableState(() => props.value, [props.value]);

  return (<Number width={150} label={'Label'} {...props} value={value} onChange={setValue} />);
});

// function generateStories(additionalProps: Partial<ComponentProps<typeof Number>> = {}): StoryConfig {
//   return {
//     wrapInStorybookComponent: false,
//     component: () => (<>

//     </>),
//   };
// }

createStories(() => ({
  module,
  name: 'Components/Number',
  stories: {
    ...generateUIStateStories(EditableNumber),
    ...generateInternalTextStories(EditableNumber),
    // 'Number': generateStories(),
  },
}));
