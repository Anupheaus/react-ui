import { pureFC } from '../../anuxComponents';
import { useUpdatableState } from '../../hooks/useUpdatableState';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories } from '../../Storybook';
import { InternalText, InternalTextProps } from './InternalText';
import { generateInternalTextStories } from './InternalText.stories.utils';

const EditableText = pureFC<InternalTextProps>()('EditableText', props => {
  const [value, setValue] = useUpdatableState(() => props.value, [props.value]);

  return (<InternalText tagName="text" type="text" width={150} label={'Label'} {...props} value={value} onChange={setValue} />);
});

createStories(() => ({
  module,
  name: 'Components/Internal Text',
  stories: {
    ...generateUIStateStories(props => <EditableText {...props} />),
    ...generateInternalTextStories(EditableText),
  },
}));
