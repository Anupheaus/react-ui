import { createStories, StorybookComponent, StoryConfig } from '../../Storybook';
import { Button } from './Button';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { ComponentProps } from 'react';
import { Icon } from '../Icon';
import { createStyles, DefaultTheme } from '../../theme';

const useStyles = createStyles({
  iconOnly: {
    padding: 16,
    backgroundColor: DefaultTheme.action.default.backgroundColor,
  },
  wideButton: {
    width: 300,
  }
});

// const RaiseError = () => { throw new Error('Testing my error!'); };

function generateButtonStories(props: Partial<ComponentProps<typeof Button>> = {}): StoryConfig {
  return {
    wrapInStorybookComponent: false,
    component: () => {
      const { css } = useStyles();
      return (<>
        {/* <StorybookComponent title="With Error">
        <Button {...props} icon={icons.close}><RaiseError /></Button>
      </StorybookComponent> */}

        <StorybookComponent title="Simple">
          <Button {...props}>Test</Button>
        </StorybookComponent>

        <StorybookComponent title="Wide">
          <Button {...props} className={css.wideButton}>Test</Button>
        </StorybookComponent>

        <StorybookComponent title="With Icon">
          <Button {...props}><Icon name="drawer-close" />Test</Button>
        </StorybookComponent>

        <StorybookComponent title="Wide With Icon">
          <Button {...props} className={css.wideButton}><Icon name="drawer-close" />Test</Button>
        </StorybookComponent>

        <StorybookComponent title="Icon Only" className={css.iconOnly}>
          <Button {...props}><Icon name="drawer-close" /></Button>
        </StorybookComponent>
      </>);
    },
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
