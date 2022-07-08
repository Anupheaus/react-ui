import { createStories } from '../../Storybook';
import { StorybookComponent } from '../../Storybook/StorybookComponent';
import { Icon } from './Icon';

createStories(() => ({
  module,
  name: 'Components/Icon',
  stories: {
    'Icon': {
      wrapInStorybookComponent: false,
      component: () => (<>
        <StorybookComponent title="Small Icon">
          <Icon name="FiActivity" size="small" />
        </StorybookComponent>

        <StorybookComponent title="Normal Icon">
          <Icon name="FiActivity" size="normal" />
        </StorybookComponent>

        <StorybookComponent title="Large Icon">
          <Icon name="FiActivity" size="large" />
        </StorybookComponent>
      </>),
    },
  },
}));
