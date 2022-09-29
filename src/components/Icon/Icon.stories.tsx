import { FiActivity } from 'react-icons/fi';
import { AnuxError } from '../../errors';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories } from '../../Storybook';
import { StorybookComponent } from '../../Storybook/StorybookComponent';
import { createThemeIcons } from '../../theme';
import { Icon } from './Icon';

const icons = createThemeIcons({
  activity: FiActivity,
});

const DemoIcon = () => <Icon>{icons.activity}</Icon>;

createStories(() => ({
  module,
  name: 'Components/Icon',
  stories: {
    ...generateUIStateStories(DemoIcon),
    'Default': {
      wrapInStorybookComponent: false,
      component: () => (<>
        <StorybookComponent title="Small Icon">
          <Icon size="small">{icons.activity}</Icon>
        </StorybookComponent>

        <StorybookComponent title="Normal Icon">
          <Icon size="normal">{icons.activity}</Icon>
        </StorybookComponent>

        <StorybookComponent title="Large Icon">
          <Icon size="large">{icons.activity}</Icon>
        </StorybookComponent>

        <StorybookComponent title="With Error">
          <Icon size="large">{() => { throw new AnuxError({ title: 'Icon Error', message: 'This has occurred in the icon!' }); }}</Icon>
        </StorybookComponent>
      </>),
    },
  },
}));
