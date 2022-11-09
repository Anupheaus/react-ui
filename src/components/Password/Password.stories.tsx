import { createComponent } from '../Component';
import { useUpdatableState } from '../../hooks/useUpdatableState';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories } from '../../Storybook';
import { generateInternalTextStories } from '../InternalText/InternalText.stories.utils';
import { Password } from './Password';
import { ComponentProps } from 'react';

interface Props extends ComponentProps<typeof Password> { }

const EditablePassword = createComponent({
  id: 'EditablePassword',
  render(props: Props) {
    const [value, setValue] = useUpdatableState(() => props.value, [props.value]);

    return (<Password width={150} label={'Label'} {...props} value={value} onChange={setValue} />);
  },
});

createStories(() => ({
  module,
  name: 'Components/Password',
  stories: {
    ...generateUIStateStories(EditablePassword),
    ...generateInternalTextStories(EditablePassword),
  },
}));
