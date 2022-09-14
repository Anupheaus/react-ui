import { ComponentProps } from 'react';
import { UIState } from '../../providers';
import { createStories, StorybookComponent, StoryConfig } from '../../Storybook';
import { Button } from './Button';
import { FiArrowRightCircle } from 'react-icons/fi';
import { PrimaryButtonTheme, SecondaryButtonTheme, TertiaryButtonTheme } from './Button.stories.utils';
import { Theme } from '../../providers/ThemeProvider';

const icons = Theme.icons.define({
  'close': ({ size }) => (<FiArrowRightCircle size={size} />),
});

function generateButtonStories(props: Partial<ComponentProps<typeof Button>> = {}): StoryConfig {
  return {
    wrapInStorybookComponent: false,
    component: () => (<>

      <StorybookComponent title="Loading">
        <UIState isLoading>
          <Button {...props} icon={icons.close}>Test</Button>
        </UIState>
      </StorybookComponent>

      <StorybookComponent title="Normal">
        <Button {...props} icon={icons.close}>Test</Button>
      </StorybookComponent>

    </>),
  };
}

createStories(() => ({
  module,
  name: 'Components/Button',
  stories: {
    'Default': generateButtonStories(),
    'Primary': generateButtonStories({ theme: PrimaryButtonTheme }),
    'Secondary': generateButtonStories({ theme: SecondaryButtonTheme }),
    'Tertiary': generateButtonStories({ theme: TertiaryButtonTheme }),
  },
}));
