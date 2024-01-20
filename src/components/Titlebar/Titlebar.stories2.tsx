import { createComponent } from '../Component';
import { Button } from '../Button';
import { Titlebar } from './Titlebar';
import { createStories } from '../../Storybook';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { Icon } from '../Icon';

export const TestToolbar = createComponent('TestToolbar', () => (<Titlebar><Button>Test</Button><Button><Icon name={'help'} /></Button></Titlebar>));


createStories(() => ({
  module,
  name: 'Components/Toolbar',
  stories: {
    ...generateUIStateStories(() => <TestToolbar />),
  },
}));
