import { createComponent } from '../Component';
import { Button } from '../Button';
import { Toolbar } from './Toolbar';
import { createStories } from '../../Storybook';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { Icon } from '../Icon';

export const TestToolbar = createComponent('TestToolbar', () => (<Toolbar><Button>Test</Button><Button><Icon name={'help'} /></Button></Toolbar>));


createStories(() => ({
  module,
  name: 'Components/Toolbar',
  stories: {
    ...generateUIStateStories(() => <TestToolbar />),
  },
}));
