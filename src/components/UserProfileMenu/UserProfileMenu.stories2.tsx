import { createStories, StorybookComponent, StoryConfig } from '../../Storybook';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { ComponentProps } from 'react';
import { UserProfileMenu } from './UserProfileMenu';

const menuItems = [
  { id: 'sign-out', text: 'Sign Out' },
  { id: 'settings', text: 'Settings' },
  { id: 'help', text: 'Help' },
];

const DemoMenu = (props: Props) => {
  return (
    <UserProfileMenu {...props} items={menuItems} />
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
