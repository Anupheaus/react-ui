import { createStories, StorybookComponent, StoryConfig } from '../../Storybook';
import { Button } from './Button';
import { FiArrowRightCircle } from 'react-icons/fi';
// import { PrimaryButtonTheme } from './Button.stories.utils';
import { createThemeIcons } from '../../theme';
import { PropsOf } from '../../extensions';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';

const icons = createThemeIcons({
  'close': ({ size }) => (<FiArrowRightCircle size={size} />),
});

function generateButtonStories(props: Partial<PropsOf<typeof Button>> = {}): StoryConfig {
  return {
    wrapInStorybookComponent: false,
    component: () => (<>
      <StorybookComponent title="With Error">
        <Button {...props} icon={() => { throw new Error('Testing my error!'); }}>Test</Button>
      </StorybookComponent>

      <StorybookComponent title="With Icon">
        <Button {...props} icon={icons.close}>Test</Button>
      </StorybookComponent>
    </>),
  };
}

interface Props {
  children: string;
}

createStories<Props>(() => ({
  module,
  name: 'Components/Button',
  props: {
    children: { type: 'string', defaultValue: 'Test', name: 'Label' },
  },
  stories: {
    ...generateUIStateStories(Button),
    'Default': generateButtonStories(),
  },
}));
