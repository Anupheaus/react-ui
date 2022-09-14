import { MapOf } from 'anux-common';
import { ReactNode } from 'react';
import { StorybookComponent, StoryConfig } from '../../Storybook';
import { UIState } from './UIState';

export function generateUIStateStories<T extends {}>(render: (props: T) => ReactNode): MapOf<StoryConfig<T>> {
  return {
    'UI States': {
      wrapInStorybookComponent: false,
      component: props => (<>

        <StorybookComponent title="Loading">
          <UIState isLoading>
            {render(props)}
          </UIState>
        </StorybookComponent>

        <StorybookComponent title="Normal">
          {render(props)}
        </StorybookComponent>

      </>),
    },
  };
}