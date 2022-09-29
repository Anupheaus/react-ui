import { pureFC } from '../../anuxComponents';
import { PropsOf } from '../../extensions';
import { useUpdatableState } from '../../hooks/useUpdatableState';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories } from '../../Storybook';
import { generateInternalTextStories } from '../InternalText/InternalText.stories.utils';
import { Password } from './Password';

const EditablePassword = pureFC<PropsOf<typeof Password>>()('EditablePassword', props => {
  const [value, setValue] = useUpdatableState(() => props.value, [props.value]);

  return (<Password width={150} label={'Label'} {...props} value={value} onChange={setValue} />);
});

createStories(() => ({
  module,
  name: 'Components/Password',
  stories: {
    ...generateUIStateStories(EditablePassword),
    ...generateInternalTextStories(EditablePassword),
  },
}));
