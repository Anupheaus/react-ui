import { MapOf } from 'anux-common';
import { PureFC } from '../../anuxComponents';
import { StorybookComponent, StoryConfig } from '../../Storybook';
import { UIState } from './UIState';

export function generateUIStateStories<T extends {}>(Component: PureFC<T>): MapOf<StoryConfig<T>> {
  return {
    'UI States': {
      wrapInStorybookComponent: false,
      component: (props: any) => (<>

        <StorybookComponent title="Loading">
          <UIState isLoading>
            <Component {...props} />
          </UIState>
        </StorybookComponent>

        <StorybookComponent title="Normal">
          <Component {...props} />
        </StorybookComponent>

      </>),
    },
  };
}