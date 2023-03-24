import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories } from '../../Storybook';
import { InternalField } from './InternalField';
import { generateInternalFieldStories } from './InternalField.stories.utils';

createStories(() => ({
  module,
  name: 'Components/Internal Field',
  stories: {
    ...generateUIStateStories(props => <InternalField tagName="field" {...props}>Hey</InternalField>),
    ...generateInternalFieldStories(InternalField),
  },
}));
