import { MapOf } from '@anupheaus/common';
import { Component as ComponentType } from '../../components/Component';
import { StorybookComponent, StoryConfig } from '../../Storybook';
import { UIState } from './UIState';

export function generateUIStateStories<T extends {}>(Component: ComponentType<T>): MapOf<StoryConfig<T>> {
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