import { MapOf } from '@anupheaus/common';
import { FunctionComponent as ComponentType } from 'react';
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

        <StorybookComponent title="Read Only">
          <UIState isReadOnly>
            <Component {...props} />
          </UIState>
        </StorybookComponent>

      </>),
    },
  };
}