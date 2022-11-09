import { createComponent } from '../Component';
import { useUpdatableState } from '../../hooks/useUpdatableState';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories } from '../../Storybook';
import { generateInternalTextStories } from '../InternalText/InternalText.stories.utils';
import { Number } from './Number';
import { ComponentProps } from 'react';

interface Props extends ComponentProps<typeof Number> { }

const EditableNumber = createComponent({
  id: 'EditableNumber',

  render(props: Props) {
    const [value, setValue] = useUpdatableState(() => props.value, [props.value]);

    return (<Number width={150} label={'Label'} {...props} value={value} onChange={setValue} />);
  },
});

createStories(() => ({
  module,
  name: 'Components/Number',
  stories: {
    ...generateUIStateStories(EditableNumber),
    ...generateInternalTextStories(EditableNumber),
  },
}));
