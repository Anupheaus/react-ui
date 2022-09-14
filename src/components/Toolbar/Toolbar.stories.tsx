import { FiHelpCircle } from 'react-icons/fi';
import { anuxPureFC } from '../../anuxComponents';
import { Theme } from '../../providers/ThemeProvider';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories } from '../../Storybook';
import { Button } from '../Button';
import { Toolbar } from './Toolbar';

const icons = Theme.icons.define({
  help: ({ size }) => (<FiHelpCircle size={size} />),
});

const TestToolbar = anuxPureFC('TestToolbar', () => (<Toolbar><Button>Test</Button><Button icon={icons.help} /></Toolbar>));

createStories(() => ({
  module,
  name: 'Components/Toolbar',
  stories: {
    ...generateUIStateStories(() => <TestToolbar />),
  },
}));
