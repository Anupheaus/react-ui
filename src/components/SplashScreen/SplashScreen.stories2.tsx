import { useState } from 'react';
import { useBound } from '../../hooks';
import { UIState } from '../../providers';
import { createStories, StorybookComponent } from '../../Storybook';
import { Button } from '../Button';
import { Flex } from '../Flex';
import { SplashScreen } from './SplashScreen';

createStories(({ createStory }) => ({
  name: 'Components/SplashScreen',
  module,
  stories: {
    'Default': createStory({
      wrapInStorybookComponent: false,
      component: () => {
        const [isEnabled, setIsEnabled] = useState(true);

        const toggleSplashScreen = useBound(() => {
          setIsEnabled(v => !v);
        });

        return (
          <StorybookComponent width={1000} height={600} title={'Default'}>
            <Flex isVertical align="left">
              <Button onClick={toggleSplashScreen}>Toggle SplashScreen</Button>
              <UIState isLoading={isEnabled}>
                <SplashScreen>
                  hey
                </SplashScreen>
              </UIState>
            </Flex>
          </StorybookComponent>
        );
      },
    }),
  },
}));