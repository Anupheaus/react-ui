import { createStories, StorybookComponent, StoryConfig } from '../../Storybook';
import { Button } from './Button';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { ComponentProps } from 'react';
import { Icon } from '../Icon';
import { createStyles, DefaultTheme } from '../../theme';
import { useBound } from '../../hooks';

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

      const doNeverEndingTask = useBound(() => new Promise<void>(() => void 0));

      return (<>

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

        <StorybookComponent title="Is Busy">
          <Button {...props} onSelect={doNeverEndingTask}>Save</Button>
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
