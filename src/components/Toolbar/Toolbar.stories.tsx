import { FiHelpCircle } from 'react-icons/fi';
import { createComponent } from '../Component';
import { Button } from '../Button';
import { Toolbar } from './Toolbar';
import { createStories } from '../../Storybook';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';

export const TestToolbar = createComponent('TestToolbar', () => (<Toolbar><Button>Test</Button><Button icon={<FiHelpCircle />} /></Toolbar>));


createStories(() => ({
  module,
  name: 'Components/Toolbar',
  stories: {
    ...generateUIStateStories(() => <TestToolbar />),
  },
}));
