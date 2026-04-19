import type { MapOf } from '@anupheaus/common';
import type { FunctionComponent as ComponentType } from 'react';
import type { StoryConfig } from '../../Storybook';
import { StorybookComponent } from '../../Storybook';
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