import { FiHelpCircle } from 'react-icons/fi';
import { pureFC } from '../../anuxComponents';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories } from '../../Storybook';
import { createThemeIcons } from '../../theme';
import { Button } from '../Button';
import { Toolbar } from './Toolbar';

const icons = createThemeIcons({
  help: FiHelpCircle,
});

const TestToolbar = pureFC()('TestToolbar', () => (<Toolbar><Button>Test</Button><Button icon={icons.help} /></Toolbar>));

createStories(() => ({
  module,
  name: 'Components/Toolbar',
  stories: {
    ...generateUIStateStories(() => <TestToolbar />),
  },
}));
