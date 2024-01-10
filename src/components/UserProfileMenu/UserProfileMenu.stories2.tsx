import { createStories, StorybookComponent, StoryConfig } from '../../Storybook';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { ComponentProps } from 'react';
import { UserProfileMenu } from './UserProfileMenu';
import { MenuItem } from '../Menu';

const DemoMenu = (props: Props) => {
  return (
    <UserProfileMenu {...props}>
      <MenuItem>Sign Out</MenuItem>
      <MenuItem>Settings</MenuItem>
      <MenuItem>Help</MenuItem>
    </UserProfileMenu>
  );
};

function generateStories(partialProps: Partial<ComponentProps<typeof UserProfileMenu>> = {}): StoryConfig<Props> {
  return {
    wrapInStorybookComponent: false,
    component: fullProps => {
      return (<>

        <StorybookComponent title="Simple">
          <DemoMenu {...fullProps} {...partialProps} />
        </StorybookComponent>
      </>);
    },
  };
}

interface Props {
  emailAddress?: string;
  displayName: string;
}

createStories<Props>(() => ({
  module,
  name: 'Components/UserProfileMenu',
  props: {
    emailAddress: { type: 'string', defaultValue: 'email@tonyhales.co.uk' },
    displayName: { type: 'string', defaultValue: 'Tony Hales' },
  },
  stories: {
    ...generateUIStateStories(DemoMenu),
    'Default': generateStories(),
  },
}));
